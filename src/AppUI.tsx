import type { NodeID, Node, Graph } from "./analysis/graph"
import type { Change } from "./analysis/changes"

import * as React from "react"
import classNames from "classnames"
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
} from "@material-ui/core"

import WarningBar from "./ui/WarningBar"
import ErrorBar from "./ui/ErrorBar"
import EmptyBox from "./ui/EmptyBox"
import ParentsExplorer from "./ui/chains/ParentsExplorer"
import ChildrenExplorer from "./ui/chains/ChildrenExplorer"
import ChainsPage from "./ui/chains/ChainsPage"

const ChainsExplorer = React.lazy(() => import("./ui/chains/ChainsExplorer"))
const ChangesView = React.lazy(() => import("./ui/chains/ChangesView"))

type Props = {
  loading: boolean
  baseGraph: Graph | undefined | null
  graph: Graph | undefined | null
  error: any
  fromNode: Node | undefined | null
  toNode: Node | undefined | null
  changes: ReadonlyArray<Change>
  showChanges: boolean
  pinned: ReadonlyArray<NodeID>
  page: string
  onAddChange: (a: Change) => any
  onFromNodeSelect: (a: NodeID) => any
  onToNodeSelect: (a: NodeID) => any
  onNodesSelectionReset: () => any
  onChangesUpdate: (a: ReadonlyArray<Change>) => any
  onFileDrop: (files: File[], rejectedFiles: File[]) => any
  onShowChangesToggle: () => any
  onPinnedToggle: (a: NodeID) => any
  onNavigate: (p: string) => void
  classes: any
}

const styles = (theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    minWidth: 1200,
    flexDirection: "column",
    justifyContent: "stretch",
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
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
  openFileMessage: {
    textAlign: "center",
    width: "30em",
    alignSelf: "center",
    margin: "auto",
    cursor: "pointer",
  },
})

class AppUI extends React.Component<Props> {
  dropzone: any

  renderGraph() {
    const {
      baseGraph,
      graph,
      fromNode,
      toNode,
      pinned,
      classes,
      onFromNodeSelect,
      onToNodeSelect,
      onAddChange,
      onPinnedToggle,
    } = this.props
    if (!graph || !baseGraph) return null
    return (
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
    )
  }

  render() {
    const {
      loading,
      error,
      graph,
      showChanges,
      changes,
      pinned,
      fromNode,
      classes,
      onNodesSelectionReset,
      onChangesUpdate,
      onFileDrop,
      onShowChangesToggle,
    } = this.props
    return (
      <Dropzone
        multiple={false}
        activeClassName=""
        rejectClassName=""
        accept=".json"
        onDrop={onFileDrop}
        className={classes.dropzone}
        disableClick
        ref={(node) => {
          this.dropzone = node
        }}
      >
        <div className={classes.root}>
          <CssBaseline />
          <React.Suspense
            fallback={<LinearProgress className={classes.progress} />}
          >
            <AppBar position="static">
              <Toolbar variant="regular" className={classes.container}>
                {!loading && (
                  <Button color="inherit" onClick={() => this.dropzone.open()}>
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
                There where {graph.errors.length} errors found. Check the
                console for more
              </WarningBar>
            )}
            {error && <ErrorBar>{String(error)}</ErrorBar>}
            {this.renderGraph()}
            {!graph && !loading && (
              <div
                onClick={() => this.dropzone.open()}
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
          </React.Suspense>
        </div>
      </Dropzone>
    )
  }
}

// @ts-expect-error mui
export default withStyles(styles)(AppUI)
