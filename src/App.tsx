import { useDropzone } from "react-dropzone"

import { encodeUrlStateHash } from "./history"
import { lazy, useCallback, useEffect, useState } from "react"
import { PromiseTrackerFn } from "./ui/hooks/usePromiseTracker"
import { usePinnedState } from "./logic/usePinnedState"
import { useGraphState } from "./logic/useGraphState"
import {
  AppBar,
  Badge,
  Button,
  Drawer,
  Icon,
  LinearProgress,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material"
import LoadingBoundary from "./ui/LoadingBoundary"
import WarningBar from "./ui/WarningBar"
import EmptyBox from "./ui/EmptyBox"
import { makeStyles } from "./ui/makeStyles"
import OpenStatsPage from "./ui/open/OpenStatsPage"

const TreePage = lazy(() => import("./ui/tree/TreePage"))
const ChangesPage = lazy(() => import("./ui/changes/ChangesPage"))

const useStyles = makeStyles({ name: "App" })((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    // minWidth: 1200,
    flexDirection: "column",
    justifyContent: "stretch",
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

  const [page, setPage] = useState<string>("tree")
  // History ------------------------------------------
  // useEffect(() => {
  //   try {
  //     const handleHistoryChange = () => {
  //       const hash = (window.location.hash || "#").slice(1)
  //       if (!hash) return
  //       const hashState = decodeUrlStateHash(hash)
  //       if (hashState.changes) setChanges(hashState.changes)
  //     }

  //     window.addEventListener("popstate", handleHistoryChange)
  //     handleHistoryChange()
  //     return () => {
  //       window.removeEventListener("popstate", handleHistoryChange)
  //     }
  //   } catch (error) {
  //     console.error("History failed to initialize", error)
  //   }
  // }, [])

  // TODO: Handle navigation and state storage
  const navigate = useCallback(() => {
    const { fromNodeId, toNodeId } = this.state
    const encodedState = encodeUrlStateHash({ fromNodeId, toNodeId })
    window.history.pushState(null, null, `#${encodedState}`)
  }, [])

  // Graph handling -----------------------------------

  const { graph, openGraph, changes, updateChanges } = useGraphState({
    trackLoading,
    onLoaded: () => setPage("tree/async"),
  })

  const handleDrop = useCallback(
    ([file], [rejected]) => {
      if (rejected) {
        trackLoading(
          Promise.reject(
            "Only webpack build stats in json format are accepted!"
          )
        )
        return
      }
      openGraph(
        () =>
          new Promise((resolve, reject) => {
            console.time("loading")
            const reader = new FileReader()
            reader.onload = () => {
              console.timeEnd("loading")
              console.time("parsing")
              const json = JSON.parse(reader.result as any)
              console.timeEnd("parsing")
              resolve(json)
            }
            reader.onerror = () => {
              console.timeEnd("loading")

              reject("Could not read the file")
            }
            reader.readAsBinaryString(file)
          })
      )
    },
    [openGraph, trackLoading]
  )

  // Load stats from Cmd Line
  useEffect(() => {
    if (process.env.REACT_APP_STATS) {
      openGraph(async () => {
        console.time(
          `loading stats file from CLI: "stats/${process.env.REACT_APP_STATS}"`
        )
        const result = await fetch(
          process.env.PUBLIC_URL + `/stats/${process.env.REACT_APP_STATS || ""}`
        )
        console.timeEnd("loading")
        console.time("parsing")
        const json = await result.json()
        console.timeEnd("parsing")
        return json
      })
    }
  }, [openGraph])

  // Pinned items ---------------------------------------
  const [pinned, togglePinned] = usePinnedState()

  // UI

  const [showChanges, setShowChanges] = useState(false)

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
  } = useDropzone({
    multiple: false,
    accept: ".json",
    onDrop: handleDrop,
    noClick: true,
    noKeyboard: true,
  })

  let pageElement = null
  if (!graph || page === "open") {
    pageElement = <OpenStatsPage openFileDialog={openFileDialog} />
  } else if (graph && page.startsWith("tree/")) {
    pageElement = (
      <TreePage
        className={classes.container}
        graph={graph}
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
        onChangesUpdate={() => {}}
      />
    )
  }

  return (
    <div {...getRootProps({ className: cx(classes.root, className) })}>
      {/* @ts-expect-error */}
      <input {...getInputProps()} />
      <LoadingBoundary
        fallback={<LinearProgress className={classes.progress} />}
      >
        <AppBar position="static" color="primary">
          <Toolbar className={classes.container} variant="dense">
            {
              <Tabs
                value={page}
                indicatorColor="secondary"
                textColor="inherit"
                onChange={(event, v) => setPage(v)}
              >
                <Tab
                  value="open"
                  label="Open stats"
                  onClick={(event) => {
                    openFileDialog()
                  }}
                />
                <Tab
                  disabled={!graph}
                  value="tree/async"
                  label="Split points"
                />
                <Tab disabled={!graph} value="tree/modules" label="Modules" />
                <Tab disabled={!graph} value="tree/cycles" label="Cycles" />
                <Tab
                  disabled={!graph}
                  value="changes"
                  label={
                    <Badge
                      badgeContent={changes.length}
                      invisible={changes.length === 0}
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
        {graph && graph.errors.length > 0 && (
          <WarningBar>
            There where {graph.errors.length} errors found. Check the console
            for more
          </WarningBar>
        )}
        {pageElement}
      </LoadingBoundary>
    </div>
  )
}
