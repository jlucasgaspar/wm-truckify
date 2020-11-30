import React from "react"

import { Form } from "antd"

const FileInput = ({ name, required, message, label, onChange }) => (
  <Form.Item
    name={name}
    label={label}
    style={{ marginBottom: 10, overflow: "hidden" }}
    rules={[
      { required: required, message: message }
    ]}
  >
    <input type="file" required={required} onChange={onChange} />
  </Form.Item>
)

export default FileInput