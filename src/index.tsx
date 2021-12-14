import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import AppContainer from "./AppContainer"
import registerServiceWorker from "./registerServiceWorker"

const rootEl = document.getElementById("root")

registerServiceWorker()
ReactDOM.render(<AppContainer />, rootEl)
