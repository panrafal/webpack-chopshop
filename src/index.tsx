import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import AppContainer from "./AppContainer"
import registerServiceWorker from "./registerServiceWorker"
import { createTheme, ThemeProvider, Theme, StyledEngineProvider } from "@mui/material";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const rootEl = document.getElementById("root")
const theme = createTheme()

registerServiceWorker()

function AppRoot() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AppContainer />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ReactDOM.render(<AppRoot />, rootEl)
