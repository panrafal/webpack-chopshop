import { StyledEngineProvider, ThemeProvider } from "@mui/material"
import React from "react"
import AppContainer from "./AppContainer"
import "./index.css"
import { HistoryContextProvider } from "./logic/useHistoryState"
import registerServiceWorker from "./registerServiceWorker"
import { createAppTheme } from "./ui/theme"

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
