import React, { useCallback, useState } from "react"
import { Link } from "react-router-dom"

import { Form, Input, Divider } from "antd"
import { MdEmail } from "react-icons/md"
import { AiFillLock } from "react-icons/ai"
import { FiSend } from "react-icons/fi"
import { VscSignIn } from "react-icons/vsc"

import { useAuth } from "../../hooks/Auth"

import logoImg from "../../assets/images/logo.png"
import { OrangeButton } from "../../components/Buttons"
import { Container, Content, LoginBackground } from "./styles"

const Login = () => {
  const [loadingForm, setLoadingForm] = useState(false)
  const { login } = useAuth()

  const handleLoginUser = useCallback(async ({ email, password }) => {
    setLoadingForm(true)

    await login({
      email: email,
      password: password,
      successMsg: `Bem-vindo, ${email}.`,
      errMsg: `Erro ao logar o administrador ${email}.`
    })

    setLoadingForm(false)
  }, [login])

  return (
    <Container>
      <LoginBackground />
      <Content>
        <Form name="register" onFinish={handleLoginUser}>
          <img src={logoImg} alt="Truckify logo" width="250" />

          <h1>
            {loadingForm ? "Carregando..." : "Faça seu login"}
          </h1>

          <Divider />

          <Form.Item
            name="email"
            rules={[
              { type: "email", message: "Insira um e-mail válido." },
              { required: true, message: "Insira seu e-mail." }
            ]}
          >
            <Input
              readOnly={loadingForm}
              prefix={<MdEmail size={20} style={{ marginRight: 5 }} />}
              placeholder="E-mail"
              style={{
                borderRadius: 5,
                padding: "8px 12px",
                fontSize: 15
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Insira sua senha." },
              { min: 6, message: "Mínimo de 6 dígitos."}
            ]}
          >
            <Input
              readOnly={loadingForm}
              prefix={<AiFillLock size={20} style={{ marginRight: 5 }} />}
              type="password"
              placeholder="Senha"
              style={{
                borderRadius: 5,
                padding: "8px 12px",
                fontSize: 15
              }}
            />
          </Form.Item>

          <Form.Item>
            <OrangeButton
              icon={<FiSend size={20} style={{ marginRight: 8 }} />}
              loadingButton={loadingForm}
              text="Login"
            />
          </Form.Item>

          <div>
            Não tem cadastro?
            <Link to="/cadastro">
              <VscSignIn style={{ marginLeft: 5 }} />
              <strong>Cadestre-se.</strong>
            </Link>
          </div>
        </Form>
      </Content>
    </Container>
  )
}

export default Login