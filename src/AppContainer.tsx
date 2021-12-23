import { CssBaseline, LinearProgress } from "@mui/material"
import { fontSize } from "@mui/system"
import { lazy, useMemo } from "react"
import { isAbortSignal } from "./analysis/parallel"
import ErrorBar from "./ui/ErrorBar"
import { usePromiseTracker } from "./ui/hooks/usePromiseTracker"
import LoadingBoundary from "./ui/LoadingBoundary"
import { makeStyles } from "./ui/makeStyles"

const App = lazy(() => import("./App"))

const useStyles = makeStyles({ name: "AppContainer" })((theme) => ({
  root: {
    touchAction: "none",
  },
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
  const app = useMemo(() => <App trackLoading={trackLoading} />, [trackLoading])
  return (
    <div className={classes.root}>
      <CssBaseline />
      <LoadingBoundary fallback={<Loading />} errorComponent={Error}>
        {loading && <Loading />}
        {error && !isAbortSignal(error) && <Error error={error} />}
        {app}
      </LoadingBoundary>
    </div>
  )
}

export default AppContainer
