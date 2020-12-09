import React, { useCallback, useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"

import { Drawer, PageHeader, Table, Row, Col, Form, DatePicker, Button, Space } from "antd"
import { InfoCircleTwoTone, DeleteTwoTone, FileAddOutlined, MinusCircleTwoTone } from "@ant-design/icons"
import { BsTrash } from "react-icons/bs"

import { useStock } from "../../hooks/Stock"
import { useAuth } from "../../hooks/Auth"

import ProductInStockDetailed from "../../views/ProductInStockDetailed"
import { OrangeButton } from "../../components/Buttons"
import { LoadingComponent } from "../../components/Loading"
import { TextInput, NumberInput, FileInput, TextAreaInput } from "../../components/Inputs"

const { Column } = Table

const StockByCustomer = () => {
  const [loadingPage, setLoadingPage] = useState(true)

  const [visible, seVisible] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)
  const [file, setFile] = useState(null)

  const [currentProduct, setCurrentProduct] = useState({})
  const [productModalVisible, setProductModalVisible] = useState(false)

  const { saveProductInStock, productsArray, getProductsInStockByCustomer, setProductsArray } = useStock()
  const { currentUser } = useAuth()

  const { customerName, customerId } = useParams()
  const history = useHistory()

  useEffect(() => {
    const getProductsInStockByCustomerFromDB = async () => {
      const data =  await getProductsInStockByCustomer({
        id: customerId,
        errMsg: `Erro ao carregar os produtos em estoque do cliente ${customerName}.`
      })

      setProductsArray(data)

      return setLoadingPage(false)
    }

    return getProductsInStockByCustomerFromDB()
  }, [customerId, customerName, getProductsInStockByCustomer, setProductsArray])

  const handleCreateNewProduct = useCallback(async ({
    name, quantity, ncm, date, quantityType, description
  }) => {
    setLoadingForm(true)

    const savedProduct = {
      id: `${customerId}_${ncm}_${name}_${quantityType}`,
      name: name,
      ncm: Number(ncm),
      quantity: Number(quantity),
      quantityType: quantityType,
      date: date._d,
      description: description ? description : "",
      file: file,
      customer_name: customerName,
      customer_id: customerId,
      user_id: currentUser.id
    }

    await saveProductInStock({ savedProduct: savedProduct })

    return setLoadingForm(false)
  }, [currentUser.id, customerId, customerName, file, saveProductInStock])

  const handleShowProductDetailed = useCallback(product => {
    setCurrentProduct(product)
    return setProductModalVisible(true)
  }, [])

  const handleDeleteProduct = useCallback((id, name) => {
    console.log("delete...")
  }, [])

  if (loadingPage) return <LoadingComponent />
  return (
    <>
      <PageHeader
        title={<strong>Produtos em estoque | {customerName}</strong>}
        onBack={() => history.goBack()}
        extra={[
          <div style={{ display: "flex" }}>
            <Button
              icon={<MinusCircleTwoTone twoToneColor="red" />}
              block
              danger
              shape="round"
              size="large"
              style={{
                fontSize: 18,
                marginRight: 10
              }}
              onclick={() => console.log("retirar vários...")}
            >
              Retirar vários produtos
            </Button>

            <OrangeButton
              htmlType="button"
              text="Adicionar novo produto"
              onClick={() => seVisible(true)}
              icon={<FileAddOutlined />}
            />
          </div>
        ]}
      />

      <Table
        dataSource={productsArray}
        style={{ padding: 40 }}
        pagination={{
          pageSizeOptions: ["15", "30", "50", "100", "200"],
          showSizeChanger: true,
          defaultPageSize: "15"
        }}
      >
        <Column title={<strong>Código</strong>} dataIndex="ncm" sorter={(a, b) => a.ncm - b.ncm} />
        
        <Column title={<strong>Produto</strong>} dataIndex="name" />

        <Column
          title={<strong>Quantidade</strong>}
          render={product => `${product.quantity} ${product.quantityType}`}
          sorter={(a, b) => a.quantity - b.quantity}
        />

        <Column
          title={<strong>Mais informações</strong>}
          render={product => (
            <Space size="small" key={product.id} style={{ margin: "auto" }}>
              <Button
                style={{
                  borderRadius: 5,
                  backgroundColor: "#389e0d",
                  color: "#FFF"
                }}
                onClick={() => handleShowProductDetailed(product)}
              >
                <InfoCircleTwoTone twoToneColor="green" /> Detalhes da Nota Fiscal
              </Button>
              <Button
                onClick={() => handleDeleteProduct(product.id, product.number)}
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
        title={<strong>Novo produto | Cliente {customerName}</strong>}
        width={650}
        onClose={() => seVisible(false)}
        closable
        visible={visible}
        style={{ zIndex: 2 }}
      >
        <Form layout="vertical" hideRequiredMark onFinish={handleCreateNewProduct}>
          <Row gutter={16}>
            <Col span={12}>
              <TextInput
                loadingInput={true}
                placeholder={customerName}
              />
            </Col>
            <Col span={12}>
              <TextInput
                name="name"
                required
                message="Insira um nome válido."
                loadingInput={loadingForm}
                placeholder="Nome do produto"
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <NumberInput
                name="ncm"
                required
                message="Código inválido."
                loadingInput={loadingForm}
                placeholder="Código do produto(NCM)"
              />
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                rules={[{ required: true, message: "Data inválida." }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%", height: 40, borderRadius: 4 }}
                  getPopupContainer={trigger => trigger.parentElement}
                  disabled={loadingForm}
                  placeholder="Data da armazenagem"
                  required
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <NumberInput
                name="quantity"
                required
                message="Quantidade inválida."
                loadingInput={loadingForm}
                placeholder="Quantidade"
              />
            </Col>
            <Col span={12}>
              <TextInput
                name="quantityType"
                required
                message="Tipo inválido."
                loadingInput={loadingForm}
                placeholder="Unidades, Caixas, etc..."
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <TextAreaInput
                loadingInput={loadingForm}
                placeholder="Insira qualquer observação adicional (Opcional)"
              />
            </Col>
          </Row>

          <FileInput
            name="file"
            label={<strong>Arquivo do produto: (Opcional)</strong>}
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
            text="Cadastrar Produto"
            icon={<FileAddOutlined style={{ marginRight: 5 }} />}
            loadingButton={loadingForm}
          />

        </Form>
      </Drawer>
    
      <ProductInStockDetailed
        productModalVisible={productModalVisible}
        setProductModalVisible={setProductModalVisible}
        currentProduct={currentProduct}
      />
    </>
  )
}

export default StockByCustomer