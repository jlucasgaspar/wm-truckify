import React, { useState } from "react"
import { Link } from "react-router-dom"

import { Layout, Menu } from "antd"
import { GrMapLocation, GrUserManager } from "react-icons/gr"
import {
  PoweroffOutlined,
  EditOutlined,
  FileDoneOutlined,
  DatabaseOutlined,
  IdcardOutlined,
  UserOutlined,
  HomeOutlined
} from "@ant-design/icons"

const { Sider } = Layout
const { SubMenu } = Menu

const Navbar = ({ children, authenticated, currentUser, logout }) => {
  const [menuIsHidden, setMenuIsHidden] = useState(true)

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {authenticated &&
        <Sider
          onMouseEnter={() => setMenuIsHidden(false)}
          onMouseLeave={() => setMenuIsHidden(true)}
          trigger={null}
          collapsible
          collapsed={menuIsHidden}
          style={{
            background: "#E5E5E5",
            boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.3)",
            borderRight: "solid 1px  rgba(0,0,0,0.2)",
            zIndex: 1
          }}
        >
          <div onClick={() => setMenuIsHidden(!menuIsHidden)} style={{ height: 100, display: "flex" }}>
            <Link to="/inicio" style={{ margin: "auto" }}>
              Logo
            </Link>
          </div>

          <Menu
            theme="dark"
            mode="vertical"
            defaultSelectedKeys={["0"]}
            style={{
              width: "100%",
              background: "transparent",
              borderRight: "solid 1px #DDD"
            }}
          >
           <Menu.Item
              style={{ color: "#000", margin: "auto", marginTop: 15 }}
              icon={<HomeOutlined style={{ fontSize: 20, color: "#000" }} />}
              >
              <Link to="/inicio" style={{ color: "black" }}>
                Início
              </Link>
            </Menu.Item>
           <Menu.Item
              style={{ color: "#000", margin: "auto", marginTop: 15 }}
              icon={<GrUserManager style={{ fontSize: 20, color: "#000" }} />}
              >
              <Link to="/clientes" style={{ color: "black" }}>
                Clientes
              </Link>
            </Menu.Item>
            <Menu.Item
              style={{ color: "#000", margin: "auto", marginTop: 15 }}
              icon={<FileDoneOutlined style={{ fontSize: 20, color: "#000" }} />}
              >
              <Link to="/nfs" style={{ color: "black" }}>
                Notas Fiscais
              </Link>
            </Menu.Item>
            <Menu.Item
              style={{ color: "#000", margin: "auto", marginTop: 15 }}
              icon={<DatabaseOutlined style={{ fontSize: 20, color: "#000" }} />}
            >
              <Link to="/estoque" style={{ color: "black" }}>Estoque</Link>
            </Menu.Item>
            <Menu.Item
              style={{ color: "#000", margin: "auto", marginTop: 15 }}
              icon={<IdcardOutlined style={{ fontSize: 20, color: "#000" }} />}
            >
              <Link to="/motoristas" style={{ color: "black" }}>Motoristas</Link>
            </Menu.Item>
            <Menu.Item
              style={{ color: "#000", margin: "auto", marginTop: 15 }}
              icon={<GrMapLocation style={{ fontSize: 20, color: "#000" }} />}
            >
              <Link to="/notas/pendentes" style={{ color: "black" }}>NFs pendentes</Link>
            </Menu.Item>
            <SubMenu
              style={{ margin: "auto", marginTop: 15 }}
              title={
                <span style={{ color: "#000" }}>
                  {currentUser.name ? currentUser.name : currentUser.email}
                </span>
              }
              icon={<UserOutlined style={{ fontSize: 20, color: "#000" }} />}
            >
              <Menu.Item icon={<EditOutlined />}>
                <Link to="/editar">Editar informações</Link>
              </Menu.Item>
            </SubMenu>

            <Menu.Item
              onClick={() => logout()}
              icon={
                menuIsHidden 
                ? <PoweroffOutlined />
                : <PoweroffOutlined style={{ marginLeft: 50 }} />
              }            
              style={{
                width: "100%",
                color: "red",
                position: "absolute",
                bottom: 0
              }}
            >
              Sair
            </Menu.Item>
          </Menu>
        </Sider>
      }

      <Layout>
        {children}
      </Layout>
    </Layout>
  )
}

export default Navbar