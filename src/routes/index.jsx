import React from "react"
import { Switch } from "react-router-dom"

import AppRoute from "./AppRoute"

import Login from "../pages/Login"
import Register from "../pages/Register"

import Home from "../pages/Home"
import Drivers from "../pages/Drivers"
import Customers from "../pages/Customers"

const Routes = () => (
  <Switch>
    <AppRoute path="/" exact component={Login} />
    <AppRoute path="/cadastro" component={Register} />
    <AppRoute path="/inicio" component={Home} isPrivate />
    <AppRoute path="/motoristas" component={Drivers} isPrivate />
    <AppRoute path="/clientes" component={Customers} isPrivate />
  </Switch>
)

export default Routes