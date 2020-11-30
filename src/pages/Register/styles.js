import styled from "styled-components"

import registerBackgroundImg from "../../assets/images/register-background.jpg"
import loginBackgroundImg from "../../assets/images/login-background.jpg"

export const Container = styled.div`
  height: 100vh;
  
  display: flex;
  align-items: stretch;

  background-color: #FFFFFF;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  place-content: center;

  width: 100%;
  max-width: 700px;

  form {
    background-color: #E9E9E9;
    padding: 15px;
    border-radius: 10px;
    width: 90%;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.2);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    input {
      width: 400px;
    }

    button {
      width: 400px;
    }
  }
`

export const RegisterBackground = styled.div`
  flex: 1;
  background: url(${registerBackgroundImg}) no-repeat center;
  background-size: cover;
`

export const LoginBackground = styled.div`
  flex: 1;
  background: url(${loginBackgroundImg}) no-repeat center;
  background-size: cover;
`