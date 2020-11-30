import React from "react"
import { Redirect, Route } from "react-router-dom"

import { useAuth } from "../hooks/Auth"

import Navbar from "../components/Navbar"
import { LoadingComponent } from "../components/Loading"

const AppRoute = ({ isPrivate = false, ...rest }) => {
  const { loadingAuth, authenticated, currentUser } = useAuth()

  if (loadingAuth) return <LoadingComponent />

  if (isPrivate === authenticated) return (
    <Navbar
      authenticated={authenticated}
      currentUser={currentUser}
    >
      <Route {...rest} />
    </Navbar>
  )
  
  return (
    isPrivate
    ? <Redirect to="/" />
    : <Redirect to="/inicio" />
  )
}

export default AppRoute