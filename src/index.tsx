import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import AppContainer from "./AppContainer"
import registerServiceWorker from "./registerServiceWorker"
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material"
import { createAppTheme } from "./ui/theme"

const rootEl = document.getElementById("root")
const theme = createAppTheme()

registerServiceWorker()

function AppRoot() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AppContainer />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

ReactDOM.render(<AppRoot />, rootEl)
