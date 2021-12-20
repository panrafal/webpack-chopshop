import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import AppContainer from "./AppContainer"
import registerServiceWorker from "./registerServiceWorker"
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material"
import { createAppTheme } from "./ui/theme"
import AppRoot from "./AppRoot"

const rootEl = document.getElementById("root")

registerServiceWorker()

ReactDOM.render(<AppRoot />, rootEl)
