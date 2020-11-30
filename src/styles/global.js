import { createGlobalStyle } from "styled-components"

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: 0;
    outline: 0;
  }

  body {
    background-color: #E9E9E9;
    color: #111;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font-family: "Poppins", sans-serif;
    font-size: 16px;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }
`
