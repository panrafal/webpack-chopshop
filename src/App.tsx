import type { Change } from "./analysis/changes"
import { useDropzone } from "react-dropzone"

import { decodeUrlStateHash, encodeUrlStateHash } from "./history"
import { lazy, useCallback, useEffect, useState } from "react"
import { PromiseTrackerFn } from "./ui/hooks/usePromiseTracker"
import { usePinnedState } from "./logic/usePinnedState"
import { useGraphState } from "./logic/useGraphState"
import {
  AppBar,
  Button,
  Drawer,
  Icon,
  LinearProgress,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core"
import LoadingBoundary from "./ui/LoadingBoundary"
import WarningBar from "./ui/WarningBar"
import EmptyBox from "./ui/EmptyBox"
import classNames from "classnames"

const ChainsPage = lazy(() => import("./ui/chains/ChainsPage"))
const TreePage = lazy(() => import("./ui/tree/TreePage"))
const ChangesView = lazy(() => import("./ui/chains/ChangesView"))

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    minWidth: 1200,
    flexDirection: "column",
    justifyContent: "stretch",
    fontFamily: "Roboto Helvetica Arial sans-serif",
  },
  container: {
    maxWidth: 2000,
    minWidth: 1200,
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
  const classes = useStyles()

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

  // const [loadingState, ] = usePromiseTracking()

  const pageElement =
    graph && page === "tree" ? (
      <TreePage
        className={classes.container}
        graph={graph}
        pinned={pinned}
        updateChanges={updateChanges}
        trackLoading={trackLoading}
      />
    ) : graph && page === "chains" ? null : null // /> //   onPinnedToggle={onPinnedToggle} //   onAddChange={onAddChange} //   onToNodeSelect={onToNodeSelect} //   onFromNodeSelect={onFromNodeSelect} //   pinned={pinned} //   toNode={toNode} //   fromNode={fromNode} //   graph={graph} //   baseGraph={baseGraph} //   className={classes.container} // <ChainsPage

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

  return (
    <div {...getRootProps({ className: classNames(classes.root, className) })}>
      {/* @ts-expect-error */}
      <input {...getInputProps()} />
      <LoadingBoundary
        fallback={<LinearProgress className={classes.progress} />}
      >
        <AppBar position="static">
          <Toolbar variant="regular" className={classes.container}>
            {
              <Button color="inherit" onClick={() => openFileDialog()}>
                Open stats
              </Button>
            }
            {graph && (
              <Button color="inherit" onClick={() => setShowChanges(true)}>
                See changes
                {changes.length ? ` (${changes.length})` : null}
              </Button>
            )}
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
        {!graph && (
          <div
            onClick={() => openFileDialog()}
            className={classes.openFileMessage}
          >
            <EmptyBox
              icon={
                <Icon color="inherit" fontSize="medium">
                  open_in_browser
                </Icon>
              }
            >
              First,{" "}
              <a
                href="https://webpack.js.org/api/cli/#stats-options"
                target="_blank"
                rel="noopener noreferrer"
              >
                generate the stats file in webpack
              </a>
              , then click here or drop it anywhere on the page to start
            </EmptyBox>
          </div>
        )}
        {graph && (
          <Drawer
            anchor="top"
            open={showChanges}
            onClose={() => setShowChanges(false)}
          >
            <div className={classes.container}>
              <ChangesView
                graph={graph}
                changes={changes}
                pinned={pinned}
                onChangesUpdate={() => {}}
              />
            </div>
          </Drawer>
        )}
      </LoadingBoundary>
    </div>
  )
}
