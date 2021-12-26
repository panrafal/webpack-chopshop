import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import AppContainer from "./AppContainer"
import registerServiceWorker from "./registerServiceWorker"
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material"
import { createAppTheme } from "./ui/theme"
import { hot } from "react-hot-loader"
import { HistoryContextProvider } from "./logic/useHistoryState"

registerServiceWorker()

export default function AppRoot() {
  const theme = createAppTheme()

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <HistoryContextProvider>
          <AppContainer />
        </HistoryContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
