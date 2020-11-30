import React, { createContext, useState, useEffect, useContext, useCallback } from "react"
import { useToasts } from "react-toast-notifications"
import { auth } from "../services/firebase"
import { useFirestore } from "./Firestore"

const AuthContext = createContext({
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  authenticated: false,
  loadingApp: true,
  currentUser: {
    name: "",
    email: "",
    photo: "",
    id: ""
  }
})

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({})
  const [authenticated, setAuthenticated] = useState(false)
  const [loadingApp, setLoadingApp] = useState(true)
  const { findWhere, findById, deleteById, save } = useFirestore()
  const { addToast } = useToasts()

  useEffect(() => {   
    return auth.onAuthStateChanged(async user => {
      if (!user) {
        setLoadingApp(false)
        setAuthenticated(false)
        return setCurrentUser({})
      }

      const { data } = await findById({
        collection: "admins",
        id: user.uid,
        errMsg: "Usuário não identificado."
      })

      if (data) {
        setCurrentUser({
          id: data.id,
          name: data.name,
          email: data.email,
          photo: data.photo
        })
  
        setLoadingApp(false)
  
        return setAuthenticated(true)
      }
    })
  }, [findById, setAuthenticated, setCurrentUser, setLoadingApp])

  const register = useCallback(async ({ email, password, successMsg, errMsg }) => {   
    try {
      const { data } = await findWhere({
        collection: "new_admin",
        whereField: "email",
        whereValue: email,
        errMsg: `E-mail ${email} não possui permissão para ser administrador.`
      })

      await deleteById({
        collection: "new_admin",
        id: data[0].id,
        errMsg: "Erro no servidor."
      })

      const { user } = await auth.createUserWithEmailAndPassword(email, password)

      const savedUser = {
        id: user.uid,
        email: email,
        photo: "",
        name: ""
      }

      await save({
        collection: "admins",
        id: `${user.uid}`,
        savedData: savedUser
      })

      const teste = await auth.signInWithEmailAndPassword(email, password)

      console.log(teste)

      setCurrentUser(savedUser)

      setAuthenticated(true)

      addToast(successMsg, { appearance: "success" })

      return currentUser
    } catch (err) {
      console.log("useAuth Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast, currentUser, deleteById, findWhere, save])

  const login = useCallback(async ({ email, password, successMsg, errMsg }) => {
    try {
      const { data } = await findWhere({
        collection: "admins",
        whereField: "email",
        whereValue: email,
        errMsg: `E-mail ${email} não tem acesso permitido.`
      })
  
      const { user } = await auth.signInWithEmailAndPassword(email, password)

      if (!user) {
        return addToast("Usuário não encontrado", { appearance: "error" })
      }
      
      if (data[0].id !== user.uid) {
        return addToast(errMsg, { appearance: "error" })
      }

      setCurrentUser(data[0])

      setAuthenticated(true)
  
      return addToast(successMsg, { appearance: "success" })
    } catch (err) {
      console.log("useAuth Error: ", err)
      return addToast(errMsg, { appearance: "error" })
    }
  }, [addToast, currentUser, findWhere])

  const logout = useCallback(() => {
    setCurrentUser({})
    setAuthenticated(false)
    return auth.signOut()
  }, [])

  return (
    <AuthContext.Provider value={{
        currentUser: currentUser,
        authenticated: authenticated,
        loadingApp: loadingApp,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.")
  }

  return context
}

export { AuthProvider, useAuth }