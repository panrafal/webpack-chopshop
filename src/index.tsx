import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import AppContainer from "./AppContainer"
import registerServiceWorker from "./registerServiceWorker"
import { createTheme, ThemeProvider } from "@material-ui/core"

const rootEl = document.getElementById("root")
const theme = createTheme()

registerServiceWorker()

function AppRoot() {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer />
    </ThemeProvider>
  )
}

ReactDOM.render(<AppRoot />, rootEl)
