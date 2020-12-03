import React from "react"
import { useHistory } from "react-router-dom"
import { PageHeader } from "antd"
import { useCustomers } from "../../hooks/Customers"
import CustomersTable from "../../components/Tables/CustomersTable"

const Nfs = () => {
  const history = useHistory()
  const { customersArray } = useCustomers()

  return (
    <>
      <PageHeader
        onBack={() => history.goBack()}
        title={<h1>Notas fiscais</h1>}
      />

      <CustomersTable path="nfs" customersArray={customersArray} />
    </>
  )
}

export default Nfs