import React from "react"
import ReactDOM from "react-dom"
import AppRoot from "./AppRoot"
import "./index.css"
import registerServiceWorker from "./registerServiceWorker"

const rootEl = document.getElementById("root")

registerServiceWorker()

ReactDOM.render(<AppRoot />, rootEl)
