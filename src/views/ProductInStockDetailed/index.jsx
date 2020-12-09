import React, { useState, useCallback, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"

import { PageHeader, Descriptions, Modal, Divider, Select } from "antd"
import { Tabs, List, Button, Drawer, Form, Row, Col, Input } from "antd"
import { InfoCircleTwoTone } from "@ant-design/icons"
import { CloseCircleTwoTone, PlusCircleTwoTone, MinusCircleTwoTone } from "@ant-design/icons"
import { FaBoxes } from "react-icons/fa"
import { GiBoxUnpacking } from "react-icons/gi"

import { useStock } from "../../hooks/Stock"

import { LoadingFast } from "../../components/Loading"
import { DateInput, FileInput, NumberInput, TextAreaInput, TextInput } from "../../components/Inputs"
import { OrangeButton } from "../../components/Buttons"
import { Container } from "./styles"

const { TabPane } = Tabs
const { Option } = Select

const ProductInStockDetailed = ({ productModalVisible, setProductModalVisible, currentProduct }) => {
  const [loadingModal, setLoadingModal] = useState(true)
  
  const [historic, setHistoric] = useState([])
  
  const [productHistoricDetailed, setProductHistoricDetailed] = useState({})
  const [productHistoricDetailedVisible, setProductHistoricDetailedVisible] = useState(false)

  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
  const [status, setStatus] = useState("")
  const [file, setFile] = useState(null)
  const [nfNumber, setNfNumber] = useState("")

  const { getProductHistoric, updateProductInStock } = useStock()
  const { customerName, customerId } = useParams()
  const history = useHistory()

  useEffect(() => {
    const getHistoric = async () => {
      const productHistory = await getProductHistoric({
        currentProduct: currentProduct,
        errMsg: `Erro ao carregar o histórico do ${currentProduct.name}`
      })

      setHistoric(productHistory)

      return setLoadingModal(false)
    }

    return getHistoric()
  }, [currentProduct, getProductHistoric])

  const handleCloseModal = useCallback(() => {
    setProductModalVisible(false)
    return setProductHistoricDetailedVisible(false)
  }, [setProductModalVisible])

  const handleUpdateProductStock = useCallback(async ({ quantity, date, description }) => {
    //setLoadingForm(true)

    const timestamp = Date.now()

    let quantityByStatus;
    if (status === "deposit") quantityByStatus = Number(+quantity)
    else if (status === "withdraw") quantityByStatus = Number(-quantity)
    else quantityByStatus = 0

    const updatedProduct = {
      id: `${currentProduct.id}_${timestamp}`,
      date: date._d,
      file: file ? file : "",
      nfNumber: nfNumber,
      status: status,
      quantity: quantityByStatus,
      quantity_type: currentProduct.quantityType,
      description: description ? description : "",
      product_id: currentProduct.id,
      product_name: currentProduct.name,
      customer_id: customerId,
      customer_name: customerName
    }

    await updateProductInStock({ updatedProduct: updatedProduct, currentProduct: currentProduct })

    setLoadingForm(false)

    return history.goBack()
  }, [file, nfNumber, status, currentProduct, customerId, customerName, history, updateProductInStock])

  return (
    <Modal
      visible={productModalVisible}
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
      {loadingModal
      ? <LoadingFast />
      :
        <>
          <PageHeader
            title={<h1 style={{ margin: "auto" }}>Detalhes do Produto</h1>}
            extra={[
              <OrangeButton
                text="Editar Produto"
                onClick={()  => { setProductModalVisible(false); return setVisibleDrawer(true) }}
                icon={<FaBoxes style={{ marginRight: 10 }} />}
              />
            ]}
          />

          <Divider />

          <Descriptions column={3}>
            <Descriptions.Item label={<strong>Nome do produto</strong>}>
              {currentProduct.name}
            </Descriptions.Item>

            <Descriptions.Item label={<strong>Quantidade atual</strong>}>
              {`${currentProduct.quantity} ${currentProduct.quantityType}`}
            </Descriptions.Item>

            <Descriptions.Item label={<strong>Código do produto</strong>}>
              {currentProduct.ncm}
            </Descriptions.Item>
          </Descriptions>

          <Tabs defaultActiveKey="1" centered type="card">
            <TabPane
              tab={<span><InfoCircleTwoTone twoToneColor="#5993ff"/>Histórico do estoque</span>}
              key="1"
            >
              <Container>
                <div style={{ width: "55%" }}>
                {historic &&
                  <List
                    pagination={{
                      pageSizeOptions: ["15", "30", "50", "100", "200"],
                      showSizeChanger: true,
                      defaultPageSize: "15"
                    }}
                    dataSource={historic}
                    renderItem={historicItem => {
                      let title; let icon; let description;

                      if (historicItem.status === "deposit") {
                        title = "Produto armazenado"
                        description = <>
                          Qtde armazenada: {historicItem.quantity} {historicItem.quantityType} <br />
                          Dia: {new Date(historicItem.date).toLocaleDateString("pt-br")}
                        </>
                        icon =
                        <PlusCircleTwoTone
                          twoToneColor="#52c41a"
                          style={{ fontSize: 25 }}
                        /> 
                        } else if (historicItem.status === "withdraw") {
                        title = "Produto retirado"
                        description = <>
                          Qtde retirada: {historicItem.quantity} {historicItem.quantityType} <br />
                          Dia: {new Date(historicItem.date).toLocaleDateString("pt-br")}
                        </>
                        icon =
                        <MinusCircleTwoTone
                          twoToneColor="#a9a9a9"
                          style={{ fontSize: 25 }}
                        />
                      } else if (historicItem.status === "error") {
                        title = "Houve algum erro"
                        description = "Explicar o erro"
                        icon =
                          <CloseCircleTwoTone
                            twoToneColor="red"
                            style={{ fontSize: 25 }}
                          />
                      } else {
                        title = "Erro ao carregar os dados desse produto"
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
                              setProductHistoricDetailedVisible(true)
                              return setProductHistoricDetailed(historicItem)
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
                  {productHistoricDetailedVisible &&
                  <>
                    <strong style={{ marginRight: 5 }}>Arquivo:</strong>
                    {productHistoricDetailed.file === ""
                    ? ( 
                      "Não possui arquivo em anexo."
                      ) : ( 
                        <>
                        <a href={productHistoricDetailed.file} target="_blank" rel="noreferrer">
                          Clique aqui
                        </a>
                        <img src={productHistoricDetailed.file} />
                        </>
                      )
                    }

                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />

                    <strong style={{ marginRight: 5 }}>Observações Adicionais:</strong>
                    {productHistoricDetailed.description
                      ? (
                        productHistoricDetailed.description
                        ) : (
                          "Não possui observação adicional."
                        )
                    }
                  </>}
                </div>
              </Container>
            </TabPane>
          </Tabs>

          <Drawer
            title={<strong>Atualizar estoque do produto {currentProduct.name}</strong>}
            width={650}
            visible={visibleDrawer}
            onClose={() => setVisibleDrawer(false)}
            style={{ zIndex: 2 }}
          >
            <Form layout="vertical" hideRequiredMark onFinish={handleUpdateProductStock}>
              <Row gutter={16}>
                <Col span={9}>
                  <TextInput
                    label="Nome do cliente"
                    placeholder={customerName}
                    loadingInput
                  />
                </Col>
                <Col span={9}>
                  <TextInput
                    label="Nome do produto"
                    placeholder={currentProduct.name}
                    loadingInput
                  />
                </Col>
                <Col span={3}>
                  <TextInput
                    label="Código"
                    placeholder={currentProduct.ncm}
                    loadingInput
                  />
                </Col>
                <Col span={3}>
                  <TextInput
                    label="Qtde"
                    placeholder={currentProduct.quantity}
                    loadingInput
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={13} style={{ marginLeft: -12, marginTop: -8 }}>
                  {status === "error"
                  ?
                    <NumberInput
                      name="quantity"
                      placeholder="0"
                      loadingInput
                      addonAfter={currentProduct.quantityType}
                    />
                  :
                    <NumberInput
                      name="quantity"
                      required
                      message="Número inválido."
                      placeholder="Quantidade"
                      loadingInput={loadingForm}
                      addonAfter={currentProduct.quantityType}
                    />
                  }
                </Col>
                <Col span={11}>
                  <Form.Item required={[{ required: true, message: "Insira uma opção válida." }]}>
                    <Select
                      disabled={loadingForm}
                      placeholder="Depósito/Retirada"
                      onChange={e => setStatus(e)}
                    >
                      <Option value="deposit">Depósito</Option>
                      <Option value="withdraw">Retirada</Option>
                      <Option value="error">Erro</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <DateInput
                    message="Data inválida."
                    placeholder="Data da armazenagem"
                    loadingInput={loadingForm}
                  />
                </Col>
                <Col span={12}>
                  {status === "withdraw" &&
                    <Form.Item
                      rules={[{ required: true, message: "Selecione um número de NF válido." }]}
                      name="nfNumber"
                    >
                      <Input
                        disabled={loadingForm}
                        placeholder="Número da NF"
                        type="number"
                        onChange={e => setNfNumber(e.target.value)}
                      />
                    </Form.Item>
                  }
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <TextAreaInput
                    placeholder="Observações (Opcional)"
                    loadingInput={loadingForm}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <FileInput
                    label={<strong>Arquivo (Opcional):</strong>}
                    onChange={e => setFile(e.target.files[0])}
                  />
                </Col>
              </Row>

              <div style={{ height: 100 }} />

              <OrangeButton
                text="Atualizar estoque"
                icon={<GiBoxUnpacking style={{ marginRight: 5 }} />}
                loadingButton={loadingForm}
              />
            </Form>
          </Drawer>
        </>
      }
    </Modal>
  )
}

export default ProductInStockDetailed