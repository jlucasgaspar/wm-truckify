import React from "react"

import { AuthProvider } from "./Auth"
import { FirestoreProvider } from "./Firestore"
import { StorageProvider } from "./Storage"
//import { GlobalProvider } from "./Global"
import { DriversProvider } from "./Drivers"
import { CustomersProvider } from "./Customers"
import { NfsProvider } from "./Nfs"
import { StockProvider } from "./Stock"

const AppProvider = ({ children }) => (
  <FirestoreProvider>
    <AuthProvider>
      <StorageProvider>
        <DriversProvider>
          <CustomersProvider>
            <NfsProvider>
              <StockProvider>
                {children}
              </StockProvider>
            </NfsProvider>
          </CustomersProvider>
        </DriversProvider>
      </StorageProvider>
    </AuthProvider>
  </FirestoreProvider>
)

export default AppProvider