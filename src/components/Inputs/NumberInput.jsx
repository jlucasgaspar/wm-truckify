import React from "react"

import { Form, Input } from "antd"

const NumberInput = ({
  name,
  required,
  message,
  placeholder,
  icon,
  loadingInput,
  addonAfter,
  addonBefore,
  lengthNumber,
  lengthNumberMessage
}) => (
  <Form.Item
    name={name}
    rules={[
      { required: required, message: message },
      { len: lengthNumber, message: lengthNumberMessage },
    ]}
  >
    <Input
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      type="number"
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

export default NumberInput