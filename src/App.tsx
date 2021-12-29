import {
  AppBar,
  Badge,
  LinearProgress,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material"
import { lazy, useState } from "react"
import { countVisibleChanges } from "./analysis/changes"
import { useGraphState } from "./logic/useGraphState"
import { usePinnedState } from "./logic/usePinnedState"
import { PromiseTrackerFn } from "./ui/hooks/usePromiseTracker"
import LoadingBoundary from "./ui/LoadingBoundary"
import { makeStyles } from "./ui/makeStyles"
import OpenStatsPage from "./ui/open/OpenStatsPage"
import WarningBar from "./ui/WarningBar"

const TreePage = lazy(() => import("./ui/tree/TreePage"))
const ChangesPage = lazy(() => import("./ui/changes/ChangesPage"))

const useStyles = makeStyles({ name: "App" })((theme) => ({
  root: {
    display: "grid",
    gridAutoFlow: "row",
    gridAutoRows: "auto 1fr",
    height: "100vh",

    // minWidth: 1200,
    // flexDirection: "column",
    // justifyContent: "stretch",
  },
  container: {
    // maxWidth: 2000,
    // minWidth: 1200,
    width: "100vw",
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    marginLeft: "auto",
    textTransform: "uppercase",
  },
  search: {
    color: "#fff",
    borderBottom: "2px solid #fff",
    width: 300,
  },
  dropzone: {},
  openButton: {},
  progress: {},
  openFileMessage: {
    textAlign: "center",
    width: "30em",
    alignSelf: "center",
    margin: "auto",
    cursor: "pointer",
  },
}))

type Props = {
  className?: string
  trackLoading: PromiseTrackerFn
}

export default function App({ className, trackLoading }: Props) {
  const { classes, cx } = useStyles()

  const [page, setPage] = useState<string>("open")

  // Graph handling -----------------------------------

  const {
    graph,
    graphWorker,
    graphLoadState,
    openGraph,
    changes,
    updateChanges,
  } = useGraphState({
    trackLoading,
    onLoaded: () => setPage("tree/async"),
  })

  // Pinned items ---------------------------------------
  const [pinned, togglePinned] = usePinnedState()

  // UI

  const [showChanges, setShowChanges] = useState(false)

  let pageElement = null
  if (!graph || page === "open") {
    pageElement = (
      <OpenStatsPage
        openGraph={openGraph}
        trackLoading={trackLoading}
        graphLoadState={graphLoadState}
      />
    )
  } else if (graph && page.startsWith("tree/")) {
    pageElement = (
      <TreePage
        className={classes.container}
        graph={graph}
        graphWorker={graphWorker}
        pinned={pinned}
        togglePinned={togglePinned}
        updateChanges={updateChanges}
        trackLoading={trackLoading}
        mode={
          page === "tree/async"
            ? "async"
            : page === "tree/modules"
            ? "modules"
            : page === "tree/cycles"
            ? "cycles"
            : "modules"
        }
      />
    )
  } else if (graph && page === "changes") {
    pageElement = (
      <ChangesPage
        graph={graph}
        changes={changes}
        pinned={pinned}
        updateChanges={updateChanges}
      />
    )
  }

  return (
    <div className={cx(classes.root, className)}>
      <AppBar position="static" color="primary">
        <Toolbar className={classes.container} variant="dense">
          {
            <Tabs
              value={page}
              indicatorColor="secondary"
              textColor="inherit"
              onChange={(event, v) => setPage(v)}
            >
              <Tab value="open" label="Open stats" />
              <Tab disabled={!graph} value="tree/async" label="Split points" />
              <Tab disabled={!graph} value="tree/modules" label="Modules" />
              <Tab disabled={!graph} value="tree/cycles" label="Cycles" />
              <Tab
                disabled={!graph}
                value="changes"
                label={
                  <Badge
                    badgeContent={countVisibleChanges(changes)}
                    invisible={countVisibleChanges(changes) === 0}
                    color="secondary"
                  >
                    Show changes
                  </Badge>
                }
                onClick={() => setShowChanges(true)}
              />
            </Tabs>
          }
          <Typography variant="h6" color="inherit" className={classes.title}>
            Webpack Chop Shop
          </Typography>
        </Toolbar>
      </AppBar>
      <LoadingBoundary
        fallback={<LinearProgress className={classes.progress} />}
      >
        {pageElement}
      </LoadingBoundary>
      {graph && graph.errors.length > 0 && (
        <WarningBar>
          There where {graph.errors.length} errors found. Check the console for
          more
        </WarningBar>
      )}
    </div>
  )
}
