import React from "react"
import { Switch, Route } from "react-router-dom"

import AppRoute from "./AppRoute"

import Navbar from "../components/Navbar"

import Login from "../pages/Login"
import Register from "../pages/Register"
import Home from "../pages/Home"
import Drivers from "../pages/Drivers"

const Routes = () => (
  <Switch>
    <AppRoute path="/" exact component={Login} />
    <AppRoute path="/cadastro" component={Register} />
    <AppRoute path="/inicio" component={Home} isPrivate />
    <AppRoute path="/motoristas" component={Drivers} isPrivate />
  </Switch>
)

export default Routes