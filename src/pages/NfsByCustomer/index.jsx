import React, { useCallback, useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import Geocode from "react-geocode"

import { Drawer, PageHeader, Table, Row, Col, Form, Tag, Button, Space } from "antd"
import {
  FileAddOutlined,
  ClockCircleOutlined,
  DeliveredProcedureOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteTwoTone,
  InfoCircleTwoTone
} from "@ant-design/icons"
import { BsTrash } from "react-icons/bs"

import { useNfs } from "../../hooks/Nfs"
import { useAuth } from "../../hooks/Auth"

import NfDetailed from "../../views/NfDetailed"
import { OrangeButton } from "../../components/Buttons"
import { LoadingComponent } from "../../components/Loading"
import { TextInput, NumberInput, FileInput, DateInput, TextAreaInput } from "../../components/Inputs"

const { Column } = Table

Geocode.setApiKey("AIzaSyBElpinnit2Dw8Nx-sPWxyqFq6QS0-rces")
Geocode.setLanguage("pt-br")
Geocode.setRegion("br")
Geocode.enableDebug()

const NfsByCustomer = () => {
  const [loadingPage, setLoadingPage] = useState(true)

  const [currentNf, setCurrentNf] = useState({})
  const [nfDetailedVisible, setNfDetailedVisible] = useState(false)

  const [visible, seVisible] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
  const [file, setFile] = useState(null)

  const { getNfsByCustomer, saveNf, nfsArray, setNfsArray } = useNfs()
  const { currentUser } = useAuth()

  const history = useHistory()
  const { customerId, customerName } = useParams()

  useEffect(() => {
    const getNfsByCustomerFromDB = async () => {
      const data =  await getNfsByCustomer({
        id: customerId,
        errMsg: `Erro ao carregar as Notas Fiscais do cliente ${customerName}.`
      })

      setNfsArray(data)

      return setLoadingPage(false)
    }

    return getNfsByCustomerFromDB()
  }, [getNfsByCustomer, customerId, customerName, setNfsArray])

  const handleCreateNf = useCallback( async ({
    addressCity, addressNeighborhood, addressStreet, date, nfNumber, nfValue, nfWeight, description
  }) => {
    setLoadingForm(true)

    const geocode = await Geocode
      .fromAddress(`${addressStreet} - ${addressNeighborhood} - ${addressCity}`)
    const { lat, lng } = geocode.results[0].geometry.location

    const newNfNumber = Number(nfNumber)

    const savedNf = {
      id: `${customerId}_${newNfNumber}-${new Date().getFullYear()}`,
      number: `${newNfNumber}/${new Date().getFullYear()}`,
      value: Number(nfValue),
      weight: Number(nfWeight),
      file: file,
      date: date._d,
      address: {
        street: addressStreet,
        neighborhood: addressNeighborhood,
        city: addressCity
      },
      description: description || "",
      coordinates: { lat: lat, lng: lng },
      customer_id: customerId,
      customer_name: customerName,
      user_id: currentUser.id
    }

    await saveNf({
      savedData: savedNf,
      successMsg: `NF ${nfNumber} cadastrada com sucesso.`,
      errMsg: `Erro ao cadastrar a NF ${nfNumber}`,
      nfNumberForError: nfNumber
    })

    return setLoadingForm(false)
  }, [file, currentUser.id, customerId, customerName, saveNf])

  const handleDeleteNf = useCallback((id, name) => {
    console.log("delete...")
  }, [])

  const handleShowNfDetailed = useCallback(nf => {
    setCurrentNf({ ...nf, date: nf.date_table })
    return setNfDetailedVisible(true)
  }, [])

  if (loadingPage) return <LoadingComponent />
  return (
    <>
      <PageHeader
        title={<h1>Notas Fiscais | {customerName}</h1>}
        onBack={() => history.goBack()}
        extra={[
          <OrangeButton
            htmlType="button"
            text="Adicionar nota fiscal"
            onClick={() => seVisible(true)}
            icon={<FileAddOutlined />}
          />
        ]}
      />

      <Table
        dataSource={nfsArray}
        style={{ padding: 40 }}
        pagination={{
          pageSizeOptions: ["15", "30", "50", "100", "200"],
          showSizeChanger: true,
          defaultPageSize: "15"
        }}
      >
        <Column
          title={<strong>Nº da NF</strong>}
          width={115}
          render={nf => nf.number.split("/")[0]}
          sorter={(a, b) => Number(a.number.split("/")[0]) - Number(b.number.split("/")[0])}
        />

        <Column
          title={<strong>Valor</strong>}
          render={nf => nf.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          sorter={(a, b) => a.value - b.value}
        />

        <Column
          title={<strong>Data</strong>}
          render={nf => nf.date_table}
          sorter={(a, b) => a.timestamp - b.timestamp}
        />

        <Column
          title={<strong>Endereço</strong>}
          dataIndex="address"
          render={address => address.street}
        />

        <Column
          title={<strong>Bairro</strong>}
          dataIndex="address"
          render={address => address.neighborhood}
        />

        <Column
          title={<strong>Município</strong>}
          dataIndex="address"
          render={address => address.city}
        />
      
        <Column
          title={<strong>Status</strong>}
          filters={[
            { text: "Em armazenagem", value: "storage" },
            { text: "Entregue", value: "shipped" },
            { text: "Em rota", value: "shipping" },
            { text: "Com erro na entrega", value: "deliveryError" },
            { text: "Com outro tipo de erro", value: "otherError"}
          ]}
          onFilter={(value, record) => record.status.indexOf(value) === 0}
          render={nf => {
            let color; let text; let icon;
            if (nf.status === "storage") {
              color = "default"
              text = "Em armazenagem"
              icon = <ClockCircleOutlined />
            } else if (nf.status === "shipping") {
              color = "processing"
              text = "Em viagem"
              icon = <DeliveredProcedureOutlined />
            } else if (nf.status === "shipped") {
              color = "success"
              text = "Finalizada"
              icon = <CheckCircleOutlined />
            } else if (nf.status === "deliveryError") {
              color = "error"
              text = "Erro na entrega"
              icon = <CloseCircleOutlined />
            } else if (nf.status === "otherError") {
              color = "error"
              text = "Com erro"
              icon = <CloseCircleOutlined />
            } else {
              color="error"
              text="Houve algum erro"
              icon = <CloseCircleOutlined />
            }
            
            return (
              <Tag className="m-auto" color={color} icon={icon}>
                {text}
              </Tag>
            )
          }}
        />

        <Column
          title={<strong>Mais informações</strong>}
          render={nf => (
            <Space size="small" key={nf.id} style={{ margin: "auto" }}>
              <Button
                style={{
                  borderRadius: 5,
                  backgroundColor: "#389e0d",
                  color: "#FFF"
                }}
                onClick={() => handleShowNfDetailed(nf)}
              >
                <InfoCircleTwoTone twoToneColor="green" /> Detalhes da Nota Fiscal
              </Button>
              <Button
                onClick={() => handleDeleteNf(nf.if, nf.number)}
                style={{
                  borderRadius: 5,
                  backgroundColor: "#f5222d"
                }}
              >
                <DeleteTwoTone twoToneColor="white" />
              </Button>
            </Space>
          )}
        />
      </Table>

      <Drawer
        title={<strong>Adicionar uma Nota Fiscal | Cliente {customerName}</strong>}
        width={650}
        onClose={() => seVisible(false)}
        closable
        visible={visible}
        style={{ zIndex: 2 }}
      >
        <Form layout="vertical" hideRequiredMark onFinish={handleCreateNf}>
          <Row gutter={16}>
            <Col span={12}>
              <TextInput
                loadingInput={true}
                placeholder={customerName}
              />
            </Col>
            <Col span={12}>
              <NumberInput
                name="nfNumber"
                required
                message="Insira um número de NF válido."
                loadingInput={loadingForm}
                placeholder="Número da NF"
              />
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <NumberInput
                name="nfValue"
                required
                message="Insira um valor válido."
                addonBefore="R$"
                loadingInput={loadingForm}
                placeholder="Valor da NF"
              />
            </Col>
            <Col span={8}>
              <NumberInput
                name="nfWeight"
                required
                message="Insira um valor válido."
                addonAfter="KG"
                loadingInput={loadingForm}
                placeholder="Peso da NF"
              />
            </Col>
            <Col span={8}>
              <div style={{ height: 8 }} />
              <DateInput
                message="Insira uma data válida."
                loadingInput={loadingForm}
                placeholder="Data armazenagem"
              />
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={10}>
              <TextInput
                name="addressStreet"
                required
                message="Insira um endereço válido."
                loadingInput={loadingForm}
                placeholder="Endereço"
              />
            </Col>
            <Col span={7}>
              <TextInput
                name="addressNeighborhood"
                required
                message="Insira um bairro válido."
                loadingInput={loadingForm}
                placeholder="Bairro"
              />
            </Col>
            <Col span={7}>
              <TextInput
                name="addressCity"
                required
                message="Município inválido."
                loadingInput={loadingForm}
                placeholder="Município"
              />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <TextAreaInput
                loadingInput={loadingForm}
                placeholder="Insira qualquer observação adicional (Opcional)"
              />
            </Col>
          </Row>

          <FileInput
            name="file"
            label={<strong>PDF da Nota Fiscal: (Opcional)</strong>}
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
            text="Cadastrar Nota Fiscal"
            icon={<FileAddOutlined style={{ marginRight: 5 }} />}
            loadingButton={loadingForm}
          />
        </Form>
      </Drawer>
    
      <NfDetailed
        nfDetailedVisible={nfDetailedVisible}
        setNfDetailedVisible={setNfDetailedVisible}
        currentNf={currentNf}
      />
    </>
  )
}

export default NfsByCustomer