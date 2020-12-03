import React from "react"
import { DatePicker, Form } from "antd"

const DateInput = ({
  message,
  loadingInput,
  placeholder,
  label
}) => (
  <Form.Item
    label={label}
    name="date"
    rules={[{ required: true, message: message }]}
  >
    <DatePicker
      format="DD/MM/YYYY"
      style={{ width: "100%" }}
      getPopupContainer={trigger => trigger.parentElement}
      disabled={loadingInput}
      placeholder={placeholder}
      required
    />
  </Form.Item>
)

export default DateInput