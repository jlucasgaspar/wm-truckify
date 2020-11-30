import React, { useCallback, createContext, useContext } from "react"
import { useToasts } from "react-toast-notifications"
import { storage } from "../services/firebase"
import { useAuth } from "./Auth"

const StorageContext = createContext({
  saveFile: async () => {}
})

const StorageProvider = ({ children }) => {
  const { addToast } = useToasts()
  const { currentUser } = useAuth()

  const saveFile = useCallback(async ({ folder, filename, savedFile, errMsg }) => {
    const timestamp = Date.now()

    try {
      await storage
        .ref(`${folder}/${filename}-${currentUser.id}_${timestamp}`)
        .put(savedFile)

      const url = await storage
        .ref(`${folder}/${filename}-${currentUser.id}_${timestamp}`)
        .getDownloadURL()

      return url
    } catch (err) {
      console.log(err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast, currentUser.id])

  return (
    <StorageContext.Provider value={{ saveFile }}>
      {children}
    </StorageContext.Provider>
  )
}

const useStorage = () => {
  const context = useContext(StorageContext)

  if (!context) {
    throw new Error("useStorage must be used within an StorageProvider.")
  }

  return context
}

export { StorageProvider, useStorage }