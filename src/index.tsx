import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import AppContainer from "./AppContainer"
import registerServiceWorker from "./registerServiceWorker"
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material"

const rootEl = document.getElementById("root")
const theme = createTheme({
  palette: {
    mode: "dark",
  },
})

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
