import React, { useContext, createContext, useState, useCallback, useEffect } from "react"
import { useToasts } from "react-toast-notifications"
import { useFirestore } from "./Firestore"
import { useAuth } from "./Auth"

import { firebase } from "../services/firebase"

const CustomersContext = createContext({
  saveCustomer: async () => {},
  customersArray: []
})

const CustomersProvider = ({ children }) => {
  const [customers, setCustomers] = useState([])

  const { findWhere, findWhereTwice, save } = useFirestore()
  const { currentUser, loadingAuth } = useAuth()

  const { addToast } = useToasts()

  useEffect(() => {
    const getCustomerFromFB = async () => {
      try {
        const { data } = await findWhere({
          collection: "customers",
          whereField: "user_id",
          whereValue: currentUser.id,
          errMsg: "Erro ao carregar os clientes."
        })

        return setCustomers(data)
      } catch (err) {
        console.log("useCustomers Error: ", err)
        return addToast("Erro ao carregar os clientes.", { appearance: "error" })
      }
    }

    if (!loadingAuth) return getCustomerFromFB()
  }, [addToast, currentUser.id, findWhere, loadingAuth])

  const addCustomerToArray = useCallback(newCustomer => {
    const newCustomerData = {
      ...newCustomer,
      key: newCustomer.id,
      created_at: Date(),
      updated_at: Date(),
      timestamp_test: firebase.FieldValue.serverTimestamp()
    }

    console.log(newCustomerData)

    return setCustomers([newCustomerData, ...customers])
  }, [customers])

  const saveCustomer = useCallback(async ({ name, razaoSocial, cnpj, errMsg, successMsg }) => {
    try {
      const { snapshot } = await findWhereTwice({
        collection: "customers",
        whereField: "cnpj",
        whereValue: cnpj,
        whereField2: "user_id",
        whereValue2: currentUser.id,
        errMsg: "Erro no servidor."
      })

      if (!snapshot.empty) {
        return addToast(`CNPJ ${cnpj} já está cadastrado.`, { appearance: "error" })
      }

      const savedCustomer = {
        id: `${currentUser.id}_${cnpj}`,
        user_id: currentUser.id,
        name: name,
        razao_social: razaoSocial,
        cnpj: cnpj
      }

      await save({
        collection: "customers",
        id: savedCustomer.id,
        savedData: savedCustomer,
        errMsg: "Erro no servidor."
      })

      addCustomerToArray(savedCustomer)

      return addToast(successMsg, { appearance: "success" })
    } catch (err) {
      console.log("useCustomers Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addCustomerToArray, addToast, currentUser.id, findWhereTwice, save])

  return (
    <CustomersContext.Provider value={{ saveCustomer, customersArray: customers }}>
      {children}
    </CustomersContext.Provider>
  )
}

const useCustomers = () => {
  const context = useContext(CustomersContext)

  if (!context) {
    throw new Error("useCustomers must be used within an CustomersProvider.")
  }

  return context
}

export { CustomersProvider, useCustomers }