import React from "react"
import { useHistory } from "react-router-dom"
import { PageHeader } from "antd"
import { useCustomers } from "../../hooks/Customers"
import CustomersTable from "../../components/Tables/CustomersTable"

const Stock = () => {
  const history = useHistory()
  const { customersArray } = useCustomers()

  return (
    <>
      <PageHeader
        onBack={() => history.goBack()}
        title={<h1>Estoque</h1>}
      />

      <CustomersTable path="estoque" customersArray={customersArray} />
    </>
  )
}

export default Stock