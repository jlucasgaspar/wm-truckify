import React, { createContext, useContext, useCallback } from "react"
import { useToasts } from "react-toast-notifications"
import { firestore, firebase } from "../services/firebase"

const FirestoreContext = createContext({
  save: async () => {},
  update: async () => {},
  deleteById: async () => {},
  find: async () => {},
  findById: async () => {},
  findWhere: async () => {},
  findByOrder: async () => {},
  findWhereByOrder: async () => {}
})

const FirestoreProvider = ({ children }) => {
  const { addToast } = useToasts()

  const save = useCallback(async ({ collection, id, savedData, successMsg, errMsg }) => {
    try {
      await firestore
        .collection(collection)
        .doc(id)
        .set({
          ...savedData,
          created_at: firebase.FieldValue.serverTimestamp(),
          updated_at: firebase.FieldValue.serverTimestamp()
        })

      if (successMsg) {
        addToast(successMsg, { appearance: "success" })
      }

      return { message: "Documento salvo com sucesso." }
    } catch (err) {
      console.log("useFirestor Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast])

  const update = useCallback(async () => {}, [])

  const deleteById = useCallback(async ({ collection, id, successMsg, errMsg }) => {
    try {
      await firestore
        .collection(collection)
        .doc(id)
        .delete()

      if (successMsg) {
        addToast(successMsg, { appearance: "success" })
      }

      return { message: "Documento removido com sucesso." }
    } catch (err) {
      console.log("useFirestore Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast])

  const find = useCallback(async () => {}, [])

  const findById = useCallback(async ({ collection, id, successMsg, errMsg }) => {
    try {
      const snap = await firestore
        .collection(collection)
        .doc(id)
        .get()

      if (!snap.exists) {
        return addToast(errMsg, { appearance: "error" })
      }

      if (successMsg) {
        addToast(successMsg, { appearance: "error" })
      }

      return { data: snap.data() }
    } catch (err) {
      console.log("useFirestore Error: ", err)

      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast])

  const findWhere = useCallback(async ({ collection, whereField, whereValue, successMsg, errMsg }) => {
    try {
      const snap = await firestore
        .collection(collection)
        .where(whereField, "==", whereValue)
        .get()

      if (snap.empty) {
        return addToast(errMsg, { appearance: "error" })
      }

      const array = []
      snap.forEach(doc => array.push(doc.data()))

      if (successMsg) {
        addToast(successMsg, { appearance: "success" })
      }

      return { data: array, snapshot: snap }
    } catch (err) {
      console.log("useFirestore Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast])

  const findByOrder = useCallback(async () => {}, [])

  const findWhereByOrder = useCallback(async () => {}, [])

  return (
    <FirestoreContext.Provider
      value={{
        save,
        update,
        deleteById,
        find,
        findById,
        findByOrder,
        findWhere,
        findWhereByOrder
      }}
    >
      {children}
    </FirestoreContext.Provider>
  )
}

const useFirestore = () => {
  const context = useContext(FirestoreContext)

  if (!context) {
    throw new Error("useFirestore must be used within an FirestoreProvider.")
  }

  return context
}

export { FirestoreProvider, useFirestore }