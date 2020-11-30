import React, { useCallback } from "react"
import { Table, Button, Space } from "antd"
import { InfoCircleTwoTone, DeleteTwoTone } from "@ant-design/icons"
import { Link } from "react-router-dom"

const { Column } = Table

const CustomersTable = ({ tableIsFor, customersArray }) => {
  const handleDeleteCustomer = useCallback(({ id, name }) => {
    console.log(id, name)
  }, [])

  return (
    <Table
      dataSource={customersArray}
      style={{ padding: 40 }}
      pagination={{
        pageSizeOptions: ["15", "30", "50", "100", "200"],
        showSizeChanger: true,
        defaultPageSize: "15"
      }}
    >
      <Column
        title={<strong>Cliente</strong>}
        dataIndex="name"
      />
      <Column
        title={<strong>Razão Social</strong>}
        dataIndex="razao_social"
      />
      <Column
        title={<strong>CNPJ</strong>}
        dataIndex="cnpj"
      />
  
      {tableIsFor &&
        <Column
          title={<strong>Mais informações</strong>}
          render={customer => (
            <Space size="small" key={customer.id}>

              {tableIsFor === "nfs" &&
                <Link to={`/nfs/${customer.id}/${customer.name}`}>
                  <Button
                    icon={<InfoCircleTwoTone twoToneColor="green" style={{ marginRight: 5 }} />}
                    style={{
                      borderRadius: 5,
                      backgroundColor: "#389e0d",
                      color: "#FFF"
                    }}
                  >
                    Ver peditos e notas
                  </Button>
                </Link>
              }

              {tableIsFor === "products" &&
                <Link to={`/estoque/${customer.id}/${customer.name}`}>
                  <Button
                    icon={<InfoCircleTwoTone twoToneColor="green" style={{ marginRight: 5 }} />}
                    style={{
                      borderRadius: 5,
                      backgroundColor: "green"
                    }}
                  >
                    Ver peditos e notas
                  </Button>
                </Link>
              }

              <Button
                onClick={() => handleDeleteCustomer({ id: customer.id, name: customer.name })}
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
      }
    </Table>
  )
}

export default CustomersTable