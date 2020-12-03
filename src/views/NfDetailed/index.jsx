import React, { useState, useCallback } from "react"

import { PageHeader, Descriptions, Modal, Divider, Select } from "antd"
import { Tabs, List, Button, Drawer, Form, Row, Col, Tag } from "antd"
import { InfoCircleTwoTone, FileAddOutlined, DeliveredProcedureOutlined } from "@ant-design/icons"
import { CloseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { CloseCircleTwoTone, CheckCircleTwoTone, ClockCircleTwoTone } from "@ant-design/icons"
import { MessageTwoTone } from "@ant-design/icons"
import { FaTruckLoading } from "react-icons/fa"

import { useDrivers } from "../../hooks/Drivers"
import { useNfs } from "../../hooks/Nfs"

import { DateInput, FileInput, TextAreaInput, TextInput } from "../../components/Inputs"
import { OrangeButton } from "../../components/Buttons"
import { Container } from "./styles"

const { TabPane } = Tabs
const { Option } = Select

const NfDetailed = ({ nfDetailedVisible, setNfDetailedVisible, currentNf }) => {
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
  const [file, setFile] = useState("")
  const [cte, setCte] = useState("")

  const [deliveryDetailsVisible, setDeliveryDetailsVisible] = useState(false)
  const [deliveryDetails, setDeliveryDetails] = useState({})

  const { driversArray } = useDrivers()
  const { updateNf } = useNfs()

  const handleNewDelivery = useCallback(async ({ date, description, driver, status }) => {
    setLoadingForm(true)

    const timestamp = Date.now()

    const savedDelivery = {
      id: `${currentNf.id}_${timestamp}`,
      file: file,
      cte: cte,
      date: date._d,
      timestamp: timestamp,
      driver_id: driver,
      driver_name: driver ? driver.split("_")[1] : "",
      description: description ? description : "",
      status: status
    }

    await updateNf({
      savedData: savedDelivery,
      currentNf: currentNf,
      successMsg: `NF ${currentNf.number} atualizada com sucesso.`,
      errMsg: `Erro ao atualizar a NF ${currentNf.number}`
    })

    return setLoadingForm(false)
  }, [file, cte, updateNf, currentNf])

  const handleCloseModal = useCallback(() => {
    setNfDetailedVisible(false)
    setDeliveryDetailsVisible(false)
    return setDeliveryDetails({})
  }, [setNfDetailedVisible])
  
  return (
    <Modal
      visible={nfDetailedVisible}
      width={900}
      onOk={handleCloseModal}
      onCancel={handleCloseModal}
      footer={null}
      closable
      style={{
        paddingBottom: 0,
        top: 30,
        marginBottom: 30,
        boxShadow: "1px 0px 5px 5px rgba(0, 0, 0, 0.3)"
      }}
    >
      <PageHeader
        title={<h1 style={{ margin: "auto" }}>Detalhes da Nota Fiscal</h1>}
        extra={[
          <OrangeButton
            text="Editar Nota Fiscal"
            onClick={()  => { setNfDetailedVisible(false); return setVisibleDrawer(true) }}
            icon={<FaTruckLoading style={{ marginRight: 10 }} />}
          />
        ]}
      >
        <Divider />

        <Descriptions column={4}>
          <Descriptions.Item label={<strong>Número</strong>}>
            {currentNf.number}
          </Descriptions.Item>
          
          <Descriptions.Item label={<strong>Data</strong>}>
            {currentNf.date}
          </Descriptions.Item>

          <Descriptions.Item label={<strong>NF</strong>}>
            <a href={currentNf.file} target="_blank" rel="noreferrer">
              Clique aqui
            </a>
          </Descriptions.Item>

          {currentNf.status &&
            <Descriptions.Item label={<strong>Satus</strong>}>
              {currentNf.status === "storage" &&
                <Tag color="default" icon={<ClockCircleOutlined />}>
                  Em armazenagem
                </Tag>
              }
              {currentNf.status === "shipping" &&
                <Tag color="processing" icon={<DeliveredProcedureOutlined />}>
                  Em viagem
                </Tag>
              }
              {currentNf.status === "shipped" &&
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  Finalizada
                </Tag>
              }
              {currentNf.status === "deliveryError" &&
                <Tag color="error" icon={<CloseCircleOutlined />}>
                  Erro na entrega
                </Tag>
              }
              {currentNf.status === "otherError" &&
                <Tag color="error" icon={<CloseCircleOutlined />}>
                  Com erro
                </Tag>
              }
              {currentNf.status === "error" &&
                <Tag color="error" icon={<CloseCircleOutlined />}>
                  Houve algum erro
                </Tag>
              }
            </Descriptions.Item>
          }
        </Descriptions>

        <Descriptions column={4}>
          <Descriptions.Item label={<strong>Cliente</strong>}>
            {currentNf.customer_name}
          </Descriptions.Item>  

          {currentNf.address &&
            <Descriptions.Item label={<strong>Endereço</strong>}>
              {`${currentNf.address.street} - ${currentNf.address.neighborhood}, ${currentNf.address.city}`}
            </Descriptions.Item>
          }
        </Descriptions>
      </PageHeader>
      
      <Tabs defaultActiveKey="1" centered type="card">
        <TabPane
          tab={<span><InfoCircleTwoTone twoToneColor="#5993ff"/>Detalhes das entregas</span>}
          key="1"
        >
          <Container>
            <div style={{ width: "55%" }}>
            {currentNf.deliveries &&
              <List
                dataSource={currentNf.deliveries}
                renderItem={delivery => {
                  let title; let icon; let description;

                  if (delivery.status === "storage") {
                    title = "Pedido armazenado"
                    description = `No dia ${delivery.date_br}`
                    icon =
                      <ClockCircleTwoTone
                        twoToneColor="#a9a9a9"
                        style={{ fontSize: 25 }}
                      />
                      
                  } else if (delivery.status === "shipped") {
                    title = "Entrega finalizada"
                    description = `No dia
                      ${delivery.date_br}${delivery.driver_name
                        ? ` pelo motorista ${delivery.driver_name}.`
                        : "."}
                      `
                    icon =
                      <CheckCircleTwoTone
                        twoToneColor="#52c41a"
                        style={{ fontSize: 25 }}
                      />
                      
                  } else if (delivery.status === "shipping") {
                    title = "Pedido na rota para entrega"
                    description = `Entrega está na rota pelo
                      motorista ${delivery.driver_name ? delivery.driver_name : "."}`
                    icon = <MessageTwoTone style={{ fontSize: 25 }} />

                  } else if (delivery.status === "deliveryError") {
                    title = "Erro na entrega"
                    description = `Tentativa de entrega realizada no dia
                      ${delivery.date_br},
                      porém não foi finalizada${delivery.driver_name
                        ? ` pelo motorista ${delivery.driver_name}.`
                        : "."}
                      `
                    icon =
                      <CloseCircleTwoTone
                        twoToneColor="red"
                        style={{ fontSize: 25 }}
                      />
                  } else if (delivery.status === "otherError") {
                    title = "Houve algum erro"
                    description = `Data: ${delivery.date_br}`
                    icon =
                      <CloseCircleTwoTone
                        twoToneColor="red"
                        style={{ fontSize: 25 }}
                      />
                  } else {
                    title = "Erro ao carregar os dados dessa entrega"
                    description = "Erro no servidor"
                    icon =
                      <CloseCircleTwoTone
                        twoToneColor="red"
                        style={{ fontSize: 25 }}
                      />
                  }

                  return (
                    <List.Item
                      actions={[
                        <Button onClick={() => {
                          setDeliveryDetailsVisible(true)
                          return setDeliveryDetails(delivery)
                        }}>
                          Ver mais
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={icon}
                        title={title}
                        description={description}
                      />
                    </List.Item>
                  )
                }}
              />}
            </div>


            <div style={{ width: "45%", marginLeft: 20, marginTop: 20 }}>
              {deliveryDetailsVisible &&
              <>
                <strong style={{ marginRight: 5 }}>Arquivo:</strong>
                {deliveryDetails.file === ""
                ? ( 
                  "Não possui arquivo em anexo."
                  ) : ( <a href={deliveryDetails.file} target="_blank" rel="noreferrer">
                        Clique aqui
                      </a>
                  )
                }

                <Divider style={{ marginTop: 15, marginBottom: 15 }} />

                <strong style={{ marginRight: 5 }}>CTE:</strong>
                {deliveryDetails.cte === ""
                  ? ( 
                    "Não possui arquivo em anexo."
                  ) : ( <a href={deliveryDetails.cte} target="_blank" rel="noreferrer">
                          Clique aqui
                        </a>
                    )
                }

                <Divider style={{ marginTop: 15, marginBottom: 15 }} />

                <strong style={{ marginRight: 5 }}>Observações Adicionais:</strong>
                {deliveryDetails.description === ""
                  ? (
                    "Não possui observação adicional."
                  ) : (
                    deliveryDetails.description
                  )
                }
              </>}
            </div>
          </Container>

        </TabPane>
      </Tabs>

      {!!currentNf.address &&
      <Drawer
        title={<strong>Atualizar entrega da NF {currentNf.number}</strong>}
        width={650}
        visible={visibleDrawer}
        onClose={() => setVisibleDrawer(false)}
        style={{ zIndex: 2 }}
      >
        <Form name="newDelivery" layout="vertical" onFinish={handleNewDelivery}>
          <Row gutter={16}>
            <Col span={8}>
              <TextInput
                loadingInput
                placeholder={currentNf.customer_name}
              />
            </Col>
            <Col span={8}>
              <TextInput
                loadingInput
                placeholder={`Nº da NF: ${currentNf.number}`}
              />
            </Col>
            <Col span={8}>
              <TextInput
                loadingInput
                placeholder={`Armzgem: ${currentNf.date_table}`}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <TextInput
                loadingInput
                placeholder={`${
                  currentNf.address.street} - ${currentNf.address.neighborhood}, ${currentNf.address.city
                }`}
              />
            </Col>
            <Col span={8}>
              <TextInput
                loadingInput
                placeholder={`Valor NF: ${currentNf.value.toLocaleString("pt-BR", {
                  style: "currency", currency: "BRL"
                })}`}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                name="driver"
                label="Selecione o motorista"
                required={[{ required: true, message: "Insira um motorista válido." }]}
              >
                <Select
                  placeholder="Motorista"
                  disabled={loadingForm}
                  showSearch
                >
                  <Option value="" key="noKey">
                    -
                  </Option>
                  {driversArray.map(driver => {
                    return (
                      <Option
                        value={driver.id}
                        key={driver.id}
                      >
                        {driver.name}
                      </Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                name="status"
                label="Status da entrega"
                required={[{ required: true, message: "Insira uma opção válida." }]}
              >
                <Select
                  disabled={loadingForm}
                  showSearch
                  placeholder="Selecione o status da entrega"
                >
                  <Option value="shipped">Entregue</Option>
                  <Option value="shipping">Em rota</Option>
                  <Option value="storage">Em armazenagem</Option>
                  <Option value="deliveryError">Erro na entrega</Option>
                  <Option value="otherError">Outro tipo de erro</Option>
                </Select>
            </Form.Item>
            </Col>
            <Col span={8}>
              <DateInput
                label="Selecione a data"
                placeholder="Data"
                message="Selecione uma data válida."
                loadingInput={loadingForm}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <TextAreaInput
                loadingInput={loadingForm}
                placeholder="Adicione qualquer informação adicional (Opcional)"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FileInput
                label={<strong>Qualquer arquivo adicional (Opcional)</strong>}
                onChange={e => setFile(e.target.files[0])}
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 10 }}>
            <Col span={24}>
              <FileInput
                label={<strong>CTE (Opcional)</strong>}
                onChange={e => setCte(e.target.files[0])}
              />
            </Col>
          </Row>
          
          <div style={{ height: 50 }}></div>

          <OrangeButton
            text="Atualizar"
            icon={<FileAddOutlined style={{ marginRight: 5 }} />}
            loadingButton={loadingForm}
          />
        </Form>
      </Drawer>
      }
    </Modal>
  )
}

export default NfDetailed