import React from "react"

import { AuthProvider } from "./Auth"
import { FirestoreProvider } from "./Firestore"
//import { GlobalProvider } from "./Global"

const AppProvider = ({ children }) => (
  <FirestoreProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </  FirestoreProvider>
)

export default AppProvider