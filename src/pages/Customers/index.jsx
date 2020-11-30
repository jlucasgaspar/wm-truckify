import React, { useCallback, useState } from "react"
import { useHistory } from "react-router-dom"

import { PageHeader, Drawer, Form } from "antd"
import { UserAddOutlined } from "@ant-design/icons"
import { FiSend } from "react-icons/fi"

import { useCustomers } from "../../hooks/Customers"

import { OrangeButton } from "../../components/Buttons"
import { NumberInput, TextInput } from "../../components/Inputs"
import CustomersTable from "../../components/Tables/CustomersTable"

const Customers = () => {
  const [visible, setVisible] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)

  const { customersArray, saveCustomer } = useCustomers()

  const history = useHistory()

  const handleCreateCustomer = useCallback(async ({ name, razaoSocial, cnpj }) => {
    setLoadingForm(true)

    await saveCustomer({
      name: name,
      razaoSocial: razaoSocial,
      cnpj: cnpj,
      successMsg: `Cliente ${name} cadastrado com sucesso.`,
      errMsg: `Erro ao cadastrar o cliente ${name}.`
    })

    setLoadingForm(false)
  }, [saveCustomer])

  return (
    <>
      <PageHeader
        onBack={() => history.goBack()}
        title={<h1>Clientes</h1>}
        extra={[
          <OrangeButton
            htmlType="button"
            text="Adicionar cliente"
            onClick={() => setVisible(true)}
            icon={<UserAddOutlined />}
          />
        ]}
      />

      <CustomersTable customersArray={customersArray} />

      <Drawer
        title={<strong>Adicionar cliente</strong>}
        onClose={() => setVisible(false)}
        closable
        visible={visible}
        width={400}
        style={{ zIndex: 2 }}
      >
        <Form name="createCustomer" hideRequiredMark onFinish={handleCreateCustomer}>
          <TextInput
            name="name"
            required
            message="Insira um nome válido."
            loadingInput={loadingForm}
            placeholder="Nome Fantasia do Cliente"
          />
          <TextInput
            name="razaoSocial"
            required
            message="Insira uma Razaão Social válida."
            loadingInput={loadingForm}
            placeholder="Razão Social do Cliente"
          />
          <NumberInput
            name="cnpj"
            required
            message="Insira um número de CNPJ válido."
            placeholder="CNPJ (apenas números, sem traço e ponto)"
            loadingInput={loadingForm}
            lengthNumber={14}
            lengthNumberMessage="Apenas os 14 dígitos do CNPJ."
          />

          <div style={{ height: 100 }}></div>

          <OrangeButton
            text="Cadastrar cliente"
            icon={<FiSend style={{ marginRight: 5 }} />}
            loadingButton={loadingForm}
          />

        </Form>
      </Drawer>
    </>
  )
}

export default Customers