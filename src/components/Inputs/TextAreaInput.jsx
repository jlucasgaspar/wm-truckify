import React from "react"
import { Form, Input } from "antd"

const { TextArea } = Input

const TextAreaInput = ({ loadingInput, placeholder }) => (
  <Form.Item name="description">
    <TextArea
      disabled={loadingInput}
      placeholder={placeholder}
      autoSize={{ minRows: 1, maxRows: 6 }}
    />
  </Form.Item>
)

export default TextAreaInput