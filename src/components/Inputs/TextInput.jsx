import React from "react"
import { Form, Input } from "antd"

const TextInput = ({
  name,
  required,
  message,
  placeholder,
  icon,
  loadingInput
}) => (
  <Form.Item
    name={name}
    rules={[
      { required: required, message: message }
    ]}
  >
    <Input
      disabled={loadingInput}
      prefix={icon}
      placeholder={placeholder}
      style={{
        borderRadius: 5,
        padding: "8px 12px",
        fontSize: 15
      }}
    />
  </Form.Item>
)

export default TextInput