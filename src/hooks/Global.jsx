import React, { createContext } from "react"

const AuthContext = createContext({
  loadingApp: true,
  setLoadingApp: () => {}
})