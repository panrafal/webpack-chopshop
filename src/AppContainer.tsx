import { CssBaseline, LinearProgress } from "@mui/material"
import { fontSize } from "@mui/system"
import { lazy } from "react"
import { hot } from "react-hot-loader"
import { isAbortSignal } from "./analysis/utils"
import ErrorBar from "./ui/ErrorBar"
import { usePromiseTracker } from "./ui/hooks/usePromiseTracker"
import LoadingBoundary from "./ui/LoadingBoundary"
import { makeStyles } from "./ui/makeStyles"

const App = lazy(() => import("./App"))

const useStyles = makeStyles({ name: "AppContainer" })((theme) => ({
  AppContainer: {},
  progress: {
    position: "fixed",
    left: 0,
    top: 0,
    right: 0,
    zIndex: 2100,
  },
  error: {
    position: "fixed",
    left: 0,
    top: 0,
    right: 0,
    zIndex: 2000,
  },
}))

function Loading() {
  const { classes } = useStyles()
  return <LinearProgress className={classes.progress} />
}
function Error({ error }) {
  const { classes } = useStyles()
  return <ErrorBar className={classes.error}>{String(error)}</ErrorBar>
}

function AppContainer() {
  const { classes } = useStyles()
  const [{ loading, error }, trackLoading] = usePromiseTracker()
  return (
    <div className={classes.AppContainer}>
      <CssBaseline />
      <LoadingBoundary fallback={<Loading />} errorComponent={Error}>
        {loading && <Loading />}
        {error && !isAbortSignal(error) && <Error error={error} />}
        <App trackLoading={trackLoading} />
      </LoadingBoundary>
    </div>
  )
}

export default hot(module)(AppContainer)
