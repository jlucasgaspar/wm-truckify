import React, { useCallback, useState } from "react"
import { Link } from "react-router-dom"

import { Form, Input, Divider } from "antd"
import { CgLogIn } from "react-icons/cg"
import { MdEmail } from "react-icons/md"
import { AiFillLock } from "react-icons/ai"
import { FiSend } from "react-icons/fi"

import { useAuth } from "../../hooks/Auth"

import logoImg from "../../assets/images/logo.png"
import { OrangeButton } from "../../components/Buttons"
import { Container, Content, RegisterBackground } from "./styles"

const Register = () => {
  const [loadingForm, setLoadingForm] = useState(false)
  const { register } = useAuth()

  const handleRegisterUser = useCallback(async({ email, password }) => {
    setLoadingForm(true)
    
    const currentUser = await register({
      email: email,
      password: password,
      successMsg: `Bem-vindo, ${email}.`,
      errMsg: `E-mail ${email} não tem permissão para ser administrador.`
    })

    console.log(currentUser)

    return setLoadingForm(false)
  }, [register])

  //console.log(useAuth())

  return (
    <Container>
      <Content>
        <Form name="register" onFinish={handleRegisterUser}>
          <img src={logoImg} alt="Truckify logo" width="250" />

          <h1>
            {loadingForm ? "Carregando..." : "Faça seu cadastro"}
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

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Insira a confirmação de senha." },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject("Senhas ainda não conferem.")
                },
              }),
            ]}
          >
            
            <Input
              readOnly={loadingForm}
              prefix={<AiFillLock size={20} style={{ marginRight: 5 }} />}
              type="password"
              placeholder="Confirme sua senha"
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
              text="Cadastrar"
            />
          </Form.Item>

          <div>
            Já tem cadastro?
            <Link to="/">
              <CgLogIn style={{ marginLeft: 5 }} />
              <strong> Faça login.</strong>
            </Link>
          </div>
        </Form>
      </Content>
      <RegisterBackground />
    </Container>
  )
}

export default Register