import React from "react"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import { Container } from "./styles"

const LoadingComponent = ({ text = "Carregando..." }) => (
  <Container>
    <Spin
      spinning
      indicator={<LoadingOutlined style={{ fontSize: 60 }} />}
      tip={text}
      size="large"
      style={{ fontSize: 30, color: "#000" }}
    />
  </Container>
)

const LoadingFast = ({ text = "Carregando..." }) => (
  <Spin
    spinning
    indicator={<LoadingOutlined style={{ fontSize: 60, marginRight: 20 }} />}
    tip={text}
    size="large"
    style={{ 
      fontSize: 30,
      color: "#000",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: 200
    }}
  />
)

export { LoadingComponent, LoadingFast }