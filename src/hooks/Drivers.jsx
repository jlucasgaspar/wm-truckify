import React, { useContext, createContext, useEffect, useState, useCallback } from "react"
import { useToasts } from "react-toast-notifications"

import { useFirestore } from "./Firestore"
import { useStorage } from "./Storage"
import { useAuth } from "./Auth"

import { firebase } from "../services/firebase"

const DriversContext = createContext({
  saveDriver: async () => {},
  driversArray: []
})

const DriversProvider = ({ children }) => {
  const [drivers, setdrivers] = useState()
  
  const { findWhere, findWhereTwice, save } = useFirestore()
  const { saveFile } = useStorage()
  const { currentUser, loadingAuth } = useAuth()
  
  const { addToast } = useToasts()

  useEffect(() => {
    const getDriversFromDB = async () => {
      try {
        const { data } = await findWhere({
          collection: "drivers",
          whereField: "user_id",
          whereValue: currentUser.id,
          errMsg: "Erro ao carregar os motoristas."
        })

        return setdrivers(data)
      } catch (err) {
        console.log(err)
        return addToast("Erro ao carregar os motoristas.", { appearance: "error" })
      }
    }

    if (!loadingAuth) return getDriversFromDB()
  }, [addToast, currentUser, findWhere, loadingAuth])

  const addDriverToArray = useCallback(newDriver => {
    const newDriverData = { 
      ...newDriver,
      key: newDriver.id,
      created_at: Date(),
      updated_at: Date(),
      timestamp_test: firebase.FieldValue.serverTimestamp()
    }

    console.log("Teste do timestamp que está no frontend: ", newDriverData)

    return setdrivers([newDriverData, ...drivers])
  }, [drivers])

  const saveDriver = useCallback(async ({ cpf, file, name }) => {
    try {
      const { snapshot } = await findWhereTwice({
        collection: "drivers",
        whereField: "cpf",
        whereValue: cpf,
        whereField2: "user_id",
        whereValue2: currentUser.id,
        errMsg: "Erro no servidor."
      })

      if (!snapshot.empty) {
        return addToast(`Motorista com CPF ${cpf} já é cadastrado.`, { appearance: "error" })
      }

      const url = await saveFile({
        folder: "drivers",
        filename: file.name,
        savedFile: file,
        errMsg: "Erro ao salvar o arquivo."
      })

      const savedDriver = {
        id: `${currentUser.id}_${name}_${cpf}`,
        name: name,
        cpf: cpf,
        file: url,
        user_id: currentUser.id
      }

      await save({
        collection: "drivers",
        id: savedDriver.id,
        savedData: savedDriver,
        errMsg: `Erro ao cadastrar o motorista ${name}.`
      })

      addDriverToArray(savedDriver)

      return addToast(`Motorista ${name} cadastrado com sucesso.`, { appearance: "success" })
    } catch (err) {
      console.log(err)
      return addToast(`Erro ao cadastrar o motorista ${name}.`, { appearance: "error" })
    }
  }, [addDriverToArray, addToast, currentUser.id, findWhereTwice, save, saveFile])

  return (
    <DriversContext.Provider value={{ saveDriver, driversArray: drivers }}>
      {children}
    </DriversContext.Provider>
  )
}

const useDrivers = () => {
  const context = useContext(DriversContext)

  if (!context) {
    throw new Error("useDrivers must be used within an DriversProvider.")
  }

  return context
}

export { DriversProvider, useDrivers }