import type { GraphNodeID, GraphNode, Graph } from "./analysis/graph"
import type { Change } from "./analysis/changes"

import LinearProgress from "@material-ui/core/LinearProgress"
import Dropzone from "react-dropzone"
import {
  AppBar,
  Typography,
  Toolbar,
  CssBaseline,
  withStyles,
  Button,
  Drawer,
  Icon,
  makeStyles,
} from "@material-ui/core"

import WarningBar from "./ui/WarningBar"
import ErrorBar from "./ui/ErrorBar"
import EmptyBox from "./ui/EmptyBox"
import { createRef, lazy, Suspense, useRef, useState } from "react"
import LoadingBoundary from "./ui/LoadingBoundary"
import { usePromiseTracking } from "./ui/hooks/usePromiseTracking"

const ChainsPage = lazy(() => import("./ui/chains/ChainsPage"))
const TreePage = lazy(() => import("./ui/tree/TreePage"))
const ChangesView = lazy(() => import("./ui/chains/ChangesView"))

type Props = {
  loading: boolean
  baseGraph: Graph | undefined | null
  graph: Graph | undefined | null
  error: any
  fromNode: GraphNode | undefined | null
  toNode: GraphNode | undefined | null
  changes: ReadonlyArray<Change>
  showChanges: boolean
  pinned: ReadonlyArray<GraphNodeID>
  page: string
  onAddChange: (a: Change) => any
  onFromNodeSelect: (a: GraphNodeID) => any
  onToNodeSelect: (a: GraphNodeID) => any
  onNodesSelectionReset: () => any
  onChangesUpdate: (a: ReadonlyArray<Change>) => any
  onFileDrop: (files: File[], rejectedFiles: File[]) => any
  onShowChangesToggle: () => any
  onPinnedToggle: (a: GraphNodeID) => any
  onNavigate: (p: string) => void
}

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

function AppUI({
  loading,
  baseGraph,
  graph,
  error,
  fromNode,
  toNode,
  changes,
  showChanges,
  pinned,
  page,
  onAddChange,
  onFromNodeSelect,
  onToNodeSelect,
  onNodesSelectionReset,
  onChangesUpdate,
  onFileDrop,
  onShowChangesToggle,
  onPinnedToggle,
  onNavigate,
}: Props) {
  const dropzone = createRef<any>()
  const classes = useStyles()

  // const [loadingState, ] = usePromiseTracking()

  const pageElement =
    graph && page === "tree" ? (
      <TreePage
        className={classes.container}
        graph={graph}
        toNode={toNode}
        pinned={pinned}
        onToNodeSelect={onToNodeSelect}
        onAddChange={onAddChange}
        onPinnedToggle={onPinnedToggle}
        trackLoading={() => {}}
      />
    ) : graph && page === "chains" ? (
      <ChainsPage
        className={classes.container}
        baseGraph={baseGraph}
        graph={graph}
        fromNode={fromNode}
        toNode={toNode}
        pinned={pinned}
        onFromNodeSelect={onFromNodeSelect}
        onToNodeSelect={onToNodeSelect}
        onAddChange={onAddChange}
        onPinnedToggle={onPinnedToggle}
      />
    ) : null

  return (
    <Dropzone
      multiple={false}
      activeClassName=""
      rejectClassName=""
      accept=".json"
      onDrop={onFileDrop}
      className={classes.dropzone}
      disableClick
      ref={dropzone}
    >
      <div className={classes.root}>
        <CssBaseline />
        <LoadingBoundary
          fallback={<LinearProgress className={classes.progress} />}
        >
          <AppBar position="static">
            <Toolbar variant="regular" className={classes.container}>
              {!loading && (
                <Button
                  color="inherit"
                  onClick={() => dropzone.current!.open()}
                >
                  Open stats
                </Button>
              )}
              {graph && (
                <Button color="inherit" onClick={onShowChangesToggle}>
                  See changes
                  {changes.length ? ` (${changes.length})` : null}
                </Button>
              )}
              {fromNode && (
                <Button color="inherit" onClick={onNodesSelectionReset}>
                  Choose root node
                </Button>
              )}
              <Typography
                variant="h6"
                color="inherit"
                className={classes.title}
              >
                Webpack Chop Shop
              </Typography>
            </Toolbar>
          </AppBar>
          {loading && <LinearProgress className={classes.progress} />}
          {graph && graph.errors.length > 0 && (
            <WarningBar>
              There where {graph.errors.length} errors found. Check the console
              for more
            </WarningBar>
          )}
          {error && <ErrorBar>{String(error)}</ErrorBar>}
          {pageElement}
          {!graph && !loading && (
            <div
              onClick={() => dropzone.current!.open()}
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
              onClose={onShowChangesToggle}
            >
              <div className={classes.container}>
                <ChangesView
                  graph={graph}
                  changes={changes}
                  pinned={pinned}
                  onChangesUpdate={onChangesUpdate}
                />
              </div>
            </Drawer>
          )}
        </LoadingBoundary>
      </div>
    </Dropzone>
  )
}

export default AppUI
