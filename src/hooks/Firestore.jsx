import React, { createContext, useContext, useCallback } from "react"
import { useToasts } from "react-toast-notifications"
import { firestore, firebase } from "../services/firebase"

const FirestoreContext = createContext({
  save: async ({ collection, id, savedData, successMsg, errMsg }) => {},
  update: async () => {},
  deleteById: async () => {},
  find: async () => {},
  findById: async () => {},
  findWhere: async () => {},
  findWhereTwice: async () => {},
  findWhereIsDifferentAndWhereIsEqual: async () => {},
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
    } catch (err) {
      console.log("useFirestor Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast])

  const update = useCallback(async ({ collection, id, updatedData, successMsg, errMsg }) => {
    try {
      await firestore
        .collection(collection)
        .doc(id)
        .update(updatedData)

      if (successMsg) {
        addToast(successMsg, { appearance: "success" })
      }

      return { message: "Documento atualizado com sucesso." }
    } catch (err) {
      console.log("useFirestore Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast])

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

      if (successMsg) {
        addToast(successMsg, { appearance: "error" })
      }

      return { data: snap.data(), snapshot: snap }
    } catch (err) {
      console.log("useFirestore Error: ", err)

      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast])

  const findWhere = useCallback(async ({
    collection, whereField, whereValue, successMsg, errMsg
  }) => {
    try {
      const snap = await firestore
        .collection(collection)
        .where(whereField, "==", whereValue)
        .get()

      const array = []
      snap.forEach(doc => array.push({
        ...doc.data(),
        key: doc.id
      }))

      if (successMsg) {
        addToast(successMsg, { appearance: "success" })
      }

      return { data: array, snapshot: snap }
    } catch (err) {
      console.log("useFirestore Error: ", err)
      if (errMsg) {
        return addToast(errMsg, { appearance: "error" })
      }
    }
  }, [addToast])

  const findWhereIsDifferentAndWhereIsEqual = useCallback(async ({
    collection, whereFieldEqual, whereValueEqual,  whereFieldDiff, whereValueDiff, successMsg, errMsg
  }) => {
    try {
      const snap = await firestore
        .collection(collection)
        .where(whereFieldEqual, "==", whereValueEqual)
        .where(whereFieldDiff, "!=", whereValueDiff)
        .get()

      const array = []
      snap.forEach(doc => array.push({
        ...doc.data(),
        key: doc.id,
        date: doc.data().date.toDate()
      }))

      if (successMsg) {
        addToast(successMsg, { appearance: "success" })
      }

      return { data: array, snapshot: snap }
    } catch (err) {
      console.log("useFirestore Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast])

  const findWhereTwice = useCallback(async ({
    collection, whereField, whereValue, whereField2, whereValue2, successMsg, errMsg
  }) => {
    try {
      const snap = await firestore
        .collection(collection)
        .where(whereField, "==", whereValue)
        .where(whereField2, "==", whereValue2)
        .get()

      const array = []
      snap.forEach(doc => {
        return array.push({
          ...doc.data(),
          key: doc.id
        })
      })

      return { data: array, snapshot: snap }
    } catch (err) {
      console.log("useFirestore Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast]) 

  const findByOrder = useCallback(async () => {}, [])

  const findWhereByOrder = useCallback(async ({
    collection, whereField, whereValue, orderField, errMsg
  }) => {
    try {
      const snap = await firestore
        .collection(collection)
        .where(whereField, "==", whereValue)
        .orderBy(orderField)
        .get()

      const array = []
      snap.forEach(doc => array.push({
        ...doc.data(),
        key: doc.id
      }))

      return { data: array, snapshot: snap }
    } catch (err) {
      console.log("useFirestore Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
      
  }, [addToast])

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
        findWhereTwice,
        findWhereIsDifferentAndWhereIsEqual,
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