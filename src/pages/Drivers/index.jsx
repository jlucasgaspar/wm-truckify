import React, { useCallback, useState } from "react"
import { useHistory } from "react-router-dom"

import { PageHeader, Drawer, Form, Table } from "antd"
import { UserAddOutlined } from "@ant-design/icons"
import { FiSend } from "react-icons/fi"
import { BsTrash } from "react-icons/bs"

import { useDrivers } from "../../hooks/Drivers"

import { OrangeButton } from "../../components/Buttons"
import { NumberInput, TextInput, FileInput } from "../../components/Inputs"

const { Column } = Table

const Drivers = () => {
  const [visible, setVisible] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
  const [file, setFile] = useState(null)

  const { saveDriver, driversArray } = useDrivers()

  const history = useHistory()

  const handleCreateDriver = useCallback(async ({ name, cpf }) => {
    setLoadingForm(true)

    await saveDriver({ name: name, cpf: cpf, file: file })

    return setLoadingForm(false)
  }, [file, saveDriver])

  return (
    <>
      <PageHeader
        onBack={() => history.goBack()}
        title={<h1>Motoristas</h1>}
        extra={[
          <OrangeButton
            htmlType="button"
            text="Adicionar motorista"
            onClick={() => setVisible(true)}
            icon={<UserAddOutlined />}
          />
        ]}
      />

      <Table
        dataSource={driversArray}
        style={{ padding: 40 }}
        pagination={{
          pageSizeOptions: ["15", "30", "50", "100", "200"],
          showSizeChanger: true,
          defaultPageSize: "15"
        }}
      >
        <Column
          title={<strong>Nome</strong>}
          dataIndex="name"
        />
        <Column
          title={<strong>CPF</strong>}
          dataIndex="cpf"
        />
      </Table>

      <Drawer
        title={<strong>Adicionar motorista</strong>}
        onClose={() => setVisible(false)}
        closable
        visible={visible}
        width={400}
        style={{ zIndex: 2 }}
      >
        <Form name="createDriver" hideRequiredMark onFinish={handleCreateDriver}>
          <TextInput
            name="name"
            required
            message="Insira um nome válido."
            loadingInput={loadingForm}
            placeholder="Nome do motorista"
          />
          <NumberInput
            name="cpf"
            required
            message="Insira um número de CPF válido."
            placeholder="CPF (apenas números, sem traço e ponto)"
            loadingInput={loadingForm}
            lengthNumber={11}
            lengthNumberMessage="Apenas os 11 dígitos do CPF."
          />
          <FileInput
            name="file"
            label={<strong>CNH do motorista</strong>}
            required
            message="Insira um documento válido."
            onChange={e => setFile(e.target.files[0])}
          />

          <div style={{ height: 100 }}>
            {file &&
              <div style={{ display: "flex", width: "100%", marginTop: 10, marginBottom: 50 }}>
                <span style={{ width: "90%" }}>
                  {file.name}
                </span>
                <BsTrash
                  size={20}
                  style={{ cursor: "pointer", margin: "auto", color: "red" }}
                  onClick={() => { setFile(null); history.goBack() }}
                />
              </div>
            }
          </div>

          <OrangeButton
            text="Enviar"
            icon={<FiSend style={{ marginRight: 5 }} />}
            loadingButton={loadingForm}
          />

        </Form>
      </Drawer>
    </>
  )
}

export default Drivers