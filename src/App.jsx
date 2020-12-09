import React from "react"
import { BrowserRouter } from "react-router-dom"

import { ToastProvider } from "react-toast-notifications"

import AppProvider from "./hooks"
import Routes from "./routes"

import GlobalStyle from "./styles/global"
import "antd/dist/antd.css"
import "leaflet/dist/leaflet.css"

const App = () => (
  <ToastProvider autoDismissTimeout={3000} autoDismiss={true}>
    <BrowserRouter>
      <AppProvider>
        <GlobalStyle />
        <Routes />
      </AppProvider>
    </BrowserRouter>
  </ToastProvider>
)

export default App