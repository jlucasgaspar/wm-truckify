import React from "react"
import { Switch } from "react-router-dom"

import AppRoute from "./AppRoute"

import Login from "../pages/Login"
import Register from "../pages/Register"

import Home from "../pages/Home"
import Drivers from "../pages/Drivers"
import Customers from "../pages/Customers"
import Nfs from "../pages/Nfs"
import NfsByCustomer from "../pages/NfsByCustomer"
import PendingNfsMap from "../pages/PendingNfsMap"
import Stock from "../pages/Stock"
import StockByCustomer from "../pages/StockByCustomer"

const Routes = () => (
  <Switch>
    <AppRoute exact path="/" component={Login} />
    <AppRoute path="/cadastro" component={Register} />
    <AppRoute path="/inicio" component={Home} isPrivate />
    <AppRoute path="/motoristas" component={Drivers} isPrivate />
    <AppRoute path="/clientes" component={Customers} isPrivate />
    <AppRoute exact path="/nfs" component={Nfs} isPrivate />
    <AppRoute exact path="/nfs/:customerId/:customerName" component={NfsByCustomer} isPrivate />
    <AppRoute exact path="/nfs/pendentes" component={PendingNfsMap} isPrivate />
    <AppRoute exact path="/estoque" component={Stock} isPrivate />
    <AppRoute exact path="/estoque/:customerId/:customerName" component={StockByCustomer} isPrivate />
  </Switch>
)

export default Routes