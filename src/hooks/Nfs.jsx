import React, { createContext, useCallback, useContext, useState } from "react"
import { useToasts } from "react-toast-notifications"
import { useFirestore } from "./Firestore"
import { useAuth } from "./Auth"
import { useStorage } from "./Storage"
import { firebase } from "../services/firebase"

const NfsContext = createContext({
  saveNf: async () => {},
  updateNf: async () => {},
  getNfsByCustomer: async () => {},
  getPendingNfs: async () => {},
  setNfsArray: () => {},
  nfsArray: []
})

const NfsProvider = ({ children }) => {
  const [nfsArray, setNfsArray] = useState([])
  
  const { currentUser } = useAuth()
  const { saveFile } = useStorage()
  const { addToast } = useToasts()
  const {
    findWhereIsDifferentAndWhereIsEqual, findWhereByOrder, findWhereTwice, save, update
  } = useFirestore()
  
  const addNfToArray = useCallback(newNf => {
    const newNfData = {
      ...newNf,
      key: newNf.id,
      created_at: Date(),
      updated_at: Date(),
      date_table: new Date(newNf.date).toLocaleDateString("pt-br")
    }

    return setNfsArray([newNfData, ...nfsArray])
  }, [nfsArray])

  const updateNfToArray = useCallback(({ currentNf, newDelivery, fileUrl, cteUrl }) => {
    const newNfData = {
      ...currentNf,
      status: newDelivery.status,
      deliveries: [
        ...currentNf.deliveries,
        {
          ...newDelivery,
          date_br: new Date(newDelivery.date).toLocaleDateString("pt-br"),
          fileUrl: fileUrl,
          cteUrl: cteUrl
        }
      ]
    }

    const filteredNfsArray = nfsArray.filter(nf => nf.id !== currentNf.id)

    return setNfsArray([...filteredNfsArray, newNfData])
  }, [nfsArray])

  const saveNf = useCallback(async ({ savedData, successMsg, errMsg, nfNumberForError }) => {
    try {
      const timestamp = Date.now()

      let fileUrl = ""

      if (savedData.file) {
        fileUrl = await saveFile({
          folder: "nfs",
          filename: savedData.file.name,
          savedFile: savedData.file,
          errMsg: `Erro ao salvar o arquivo ${savedData.file.name}.`
        })
      }

      const { snapshot } = await findWhereTwice({
        collection: "nfs",
        whereField: "user_id",
        whereValue: currentUser.id,
        whereField2: "id",
        whereValue2: savedData.id
      })

      if (!snapshot.empty) {
        return addToast(`NF ${nfNumberForError} já existe.`, { appearance: "error" })
      }

      const savedNf = {
        ...savedData,
        file: fileUrl,
        status: "storage",
        deliveries: [
          {
            id: `${savedData.id}_${timestamp}`,
            date: savedData.date,
            date_br: new Date(savedData.date).toLocaleDateString("pt-br"),
            file: fileUrl,
            cte: "",
            driver_id: "",
            driver_name: "",
            status: "storage",
            description: savedData.description
          }
        ]
      }

      await save({
        collection: "nfs",
        id: savedData.id,
        savedData: savedNf,
        errMsg: errMsg
      })

      addNfToArray(savedNf)

      return addToast(successMsg, { appearance: "success" })
    } catch (err) {
      console.log("useNfs Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast, currentUser.id, findWhereTwice, saveFile, save, addNfToArray])

  const updateNf = useCallback(async ({ savedData, currentNf, successMsg, errMsg }) => {
    if (!savedData.status) {
      return addToast("Status inválido.", { appearence: "error" })
    }

    try {
      const { file, cte } = savedData
      let fileUrl = ""
      let cteUrl = ""

      if (file) {
        fileUrl = await saveFile({ 
          folder: "deliveries-file",
          filename: file.name,
          savedFile: file,
          additionalData: "file",
          errMsg: `Erro ao salvar o arquivo ${file.name}`
        })
      }

      if (cte) {
        cteUrl = await saveFile({ 
          folder: "deliveries-cte",
          filename: file.name,
          savedFile: file,
          additionalData: "cte",
          errMsg: `Erro ao salvar o arquivo ${file.name}`
        })
      }

      await update({
        collection: "nfs",
        id: currentNf.id,
        updatedData: {
          status: savedData.status,
          deliveries: firebase.FieldValue.arrayUnion({
            ...savedData,
            file: fileUrl,
            cte: cteUrl,
            date_br: new Date(savedData.date).toLocaleDateString("pt-br")
          })
        },
        errMsg: `Erro ao atualizar a NF ${currentNf.number}`
      })

      const savedDelivery = {
        id: `${currentNf.id}_${savedData.timestamp}`,
        file: fileUrl,
        cte: cteUrl,
        date: savedData.date,
        description: savedData.description,
        status: savedData.status,
        customer_id: currentNf.customer_id,
        customer_name: currentNf.customer_name,
        driver_id: savedData.driver_id,
        driver_name: savedData.driver_name,
        nf_id: currentNf.id,
        nf_number: currentNf.number,
        nf_value: currentNf.value,
        nf_weight: currentNf.weight,
        nf_address: currentNf.address,
        nf_file: currentNf.file
      }

      if (savedData.status === "shipped" || savedData.status === "deliveryError") {
        await save({
          collection: "deliveries",
          id: `${currentNf.id}_${savedData.timestamp}`,
          savedData: savedDelivery,
          errMsg: `Erro ao salvar a entrega da NF ${currentNf.number}`
        })
      }

      updateNfToArray({
        currentNf: currentNf,
        newDelivery: savedDelivery,
        fileUrl: fileUrl,
        cteUrl: cteUrl
      })

      return addToast(successMsg, { appearance: "success" })
    } catch (err) {
      console.log("useNF Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast, saveFile, update, save, updateNfToArray])

  const getNfsByCustomer = useCallback(async({ id, errMsg }) => {
    try {
      const { snapshot } = await findWhereByOrder({
        collection: "nfs",
        whereField: "customer_id",
        whereValue: id,
        orderField: "created_at",
        errMsg: errMsg
      })

      const array = []
      await snapshot.forEach(doc => {
        array.push({
          ...doc.data(),
          date: doc.data().date.toDate(),
          date_table: new Date(doc.data().date.toDate()).toLocaleDateString("pt-br"),
          timestamp: new Date(doc.data().date.toDate()).getTime()
        })
      })

      return array
    } catch (err) {
      console.log("useNfs Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast, findWhereByOrder])

  const getPendingNfs = useCallback(async () => {
    try {
      const { data } = await findWhereIsDifferentAndWhereIsEqual({
        collection: "nfs",
        whereFieldEqual: "user_id",
        whereValueEqual: currentUser.id,
        whereFieldDiff: "status",
        whereValueDiff: "shipped",
        errMsg: "Erro ao carregar as NFs pendentes"
      })

      console.log(data)
      
      return { data: data }
    } catch (err) {
      console.log(err)
      return addToast
    }
  }, [addToast, currentUser.id, findWhereIsDifferentAndWhereIsEqual])

  return (
    <NfsContext.Provider
      value={{
        updateNf,
        saveNf,
        getNfsByCustomer,
        nfsArray: nfsArray,
        setNfsArray,
        getPendingNfs
      }}
    >
      {children}
    </NfsContext.Provider>
  )
}

const useNfs = () => {
  const context = useContext(NfsContext)

  if (!context) {
    throw new Error("useNfs must be used within an NfsProvider.")
  }

  return context
}

export { NfsProvider, useNfs }