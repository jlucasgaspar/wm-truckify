import React from "react"
import { Button } from "antd"

const OrangeButton = ({ loadingButton, htmlType = "submit", onClick, icon, text }) => (
  <Button
    loading={loadingButton}
    disabled={loadingButton}
    htmlType={htmlType}
    onClick={onClick}
    icon={icon}
    block
    shape="round"
    size="large"
    style={{
      fontSize: 18,
      backgroundColor: "#FF7D13",
      color: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      alignContent: "center"
    }}
  >
    {text}
  </Button>
)

export default OrangeButton