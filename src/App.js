// @flow

import type {NodeID, Graph} from './analysis/graph'
import type {Change} from './analysis/changes'

import * as React from 'react'
import classNames from 'classnames'
import {hot} from 'react-hot-loader'
import LinearProgress from '@material-ui/core/LinearProgress'
import Dropzone from 'react-dropzone'
import {
  AppBar,
  Typography,
  Toolbar,
  CssBaseline,
  withStyles,
  Button,
  Drawer,
  Icon,
} from '@material-ui/core'

import {readWebpackStats} from './analysis/webpack'
import {getNode, cloneGraph, resolveNode, abortGraph} from './analysis/graph'
import ChainsExplorer from './ui/graph/ChainsExplorer'
import {applyChanges, addChange} from './analysis/changes'
import WarningBar from './ui/WarningBar'
import ErrorBar from './ui/ErrorBar'
import GraphExplorer from './ui/graph/GraphExplorer'
import Dot from './ui/Dot'
import NodeName from './ui/graph/NodeName'
import ChangesView from './ui/graph/ChangesView'
import EmptyBox from './ui/EmptyBox'

type Props = {|
  classes: Object,
  theme: Object,
|}

type State = {|
  loading: boolean,
  baseGraph: ?Graph,
  graph: ?Graph,
  error: any,

  fromNodeId: ?NodeID,
  toNodeId: ?NodeID,
  changes: $ReadOnlyArray<Change>,
  showChanges: boolean,
|}

const styles = {
  root: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    'flex-direction': 'column',
    'justify-content': 'stretch',
    'font-family': ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
  },
  container: {
    maxWidth: 2000,
    minWidth: 1200,
    width: '100vw',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  panes: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: '24px 24px 0 24px',
  },
  parentsExplorer: {
    width: 250,
    flexShrink: 0,
    flexGrow: 0.2,
    marginRight: 48,
  },
  pathsExplorer: {
    flexShrink: 1,
    flexGrow: 1,
    marginRight: 48,
  },
  childrenExplorer: {
    width: 250,
    flexShrink: 0,
    flexGrow: 0.2,
  },
  title: {
    marginLeft: 'auto',
    textTransform: 'uppercase',
  },
  search: {
    color: '#fff',
    borderBottom: '2px solid #fff',
    width: 300,
  },
  dropzone: {},
  openButton: {},
  openFileMessage: {
    textAlign: 'center',
    width: '30em',
    alignSelf: 'center',
    margin: 'auto',
    cursor: 'pointer',
  },
}

class App extends React.Component<Props, State> {
  state = {
    loading: false,
    error: null,
    baseGraph: null,
    graph: null,
    fromNodeId: null,
    toNodeId: null,
    changes: [],
    showChanges: false,
  }

  dropzone: any

  async componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      this.openFile(async () => {
        console.time('loading')
        const result = await fetch('./stats/build-stats.json')
        console.timeEnd('loading')
        console.time('parsing')
        const json = await result.json()
        console.timeEnd('parsing')
        return json
      })
    }
  }

  openFile = async callback => {
    this.setState({
      loading: true,
      error: null,
      baseGraph: null,
      graph: null,
      fromNodeId: null,
      toNodeId: null,
      changes: [],
    })
    try {
      const json = await callback()
      if (json === null) {
        this.setState({loading: false})
        return
      }
      console.time('conversion')
      const graph = await readWebpackStats(json)
      console.timeEnd('conversion')
      console.log('Graph: ', graph)
      console.warn('Errors found: ', graph.errors)
      this.setState({loading: false, graph, baseGraph: graph})
    } catch (error) {
      console.error(error)
      this.setState({loading: false, error})
    }
  }

  handleDrop = ([file], [rejected]) => {
    if (rejected) {
      this.setState({error: 'Only webpack build stats in json format are accepted!'})
      return
    }
    this.openFile(
      () =>
        new Promise((resolve, reject) => {
          console.time('loading')
          const reader = new FileReader()
          reader.onload = () => {
            console.timeEnd('loading')
            console.time('parsing')
            const json = JSON.parse((reader.result: any))
            console.timeEnd('parsing')
            resolve(json)
          }
          reader.onerror = () => {
            console.timeEnd('loading')

            reject('Could not read the file')
          }
          reader.readAsBinaryString(file)
        }),
    )
  }

  toggleShowChanges = () => {
    this.setState({showChanges: !this.state.showChanges})
  }

  updateChanges = changes => {
    const {baseGraph, graph} = this.state
    if (!graph || !baseGraph) throw new Error('No graph available now')
    const newGraph = cloneGraph(baseGraph)
    // discard old graph
    if (graph !== baseGraph) {
      abortGraph(graph)
    }
    applyChanges(newGraph, changes)
    this.setState({graph: newGraph, changes: changes})
  }

  addChange = (change: Change) => {
    const {graph, changes} = this.state
    if (!graph) throw new Error('No graph available now')
    this.updateChanges(addChange(graph, changes, change))
  }

  resetNodesSelection = () => {
    this.setState({fromNodeId: null, toNodeId: null})
  }

  selectFromNode = (fromNodeId: NodeID) => {
    const {graph} = this.state
    if (graph) console.log('Selected FROM node', getNode(graph, fromNodeId))
    this.setState({fromNodeId})
  }

  selectToNode = (toNodeId: NodeID) => {
    const {graph} = this.state
    if (graph) console.log('Selected TO node', getNode(graph, toNodeId))
    this.setState({toNodeId})
  }

  renderGraph() {
    const {baseGraph, graph, fromNodeId, toNodeId} = this.state
    const {classes} = this.props
    if (!graph || !baseGraph) return null
    const fromNode = resolveNode(graph, fromNodeId)
    const toNode = resolveNode(graph, toNodeId)
    return (
      <div className={classNames(classes.container, classes.panes)}>
        <GraphExplorer
          className={classes.parentsExplorer}
          header={
            <>
              <Typography variant="headline">
                {fromNode ? (
                  <>Parents</>
                ) : (
                  <>
                    First node <Dot>1</Dot>
                  </>
                )}
              </Typography>
              <Typography variant="subheading" gutterBottom>
                {toNode ? (
                  <>
                    Move up to one of the parents of <NodeName node={toNode} />
                  </>
                ) : (
                  'Select node to start analysis from'
                )}
              </Typography>
            </>
          }
          baseGraph={baseGraph}
          graph={graph}
          walkParents
          onNodeSelect={this.selectFromNode}
          node={toNode}
          selected={fromNode}
          emptyMessage="No parents found"
        />
        {fromNode && toNode ? (
          <ChainsExplorer
            className={classes.pathsExplorer}
            baseGraph={baseGraph}
            graph={graph}
            fromNode={fromNode}
            toNode={toNode}
            onSelectFromNode={this.selectFromNode}
            onSelectToNode={this.selectToNode}
            onAddChange={this.addChange}
          />
        ) : null}
        {fromNode ? (
          <GraphExplorer
            className={classes.childrenExplorer}
            header={
              <>
                <Typography variant="headline">
                  {toNodeId ? (
                    <>Children</>
                  ) : (
                    <>
                      Children <Dot>2</Dot>
                    </>
                  )}
                </Typography>
                <Typography variant="subheading" gutterBottom>
                  Move down to the children of <NodeName node={fromNode} />
                </Typography>
              </>
            }
            baseGraph={baseGraph}
            graph={graph}
            onNodeSelect={this.selectToNode}
            node={fromNode}
            selected={toNode}
            emptyMessage="No children found"
          />
        ) : null}
      </div>
    )
  }

  render() {
    const {loading, error, graph, showChanges, changes, fromNodeId} = this.state
    const {classes} = this.props
    return (
      <Dropzone
        multiple={false}
        activeClassName=""
        rejectClassName=""
        accept=".json"
        onDrop={this.handleDrop}
        className={classes.dropzone}
        disableClick
        ref={node => {
          this.dropzone = node
        }}
      >
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="static">
            <Toolbar variant="regular" className={classes.container}>
              {!loading && (
                <Button color="inherit" onClick={() => this.dropzone.open()}>
                  Open stats
                </Button>
              )}
              {graph && (
                <Button color="inherit" onClick={this.toggleShowChanges}>
                  See changes
                  {changes.length ? ` (${changes.length})` : null}
                </Button>
              )}
              {fromNodeId && (
                <Button color="inherit" onClick={this.resetNodesSelection}>
                  Choose root node
                </Button>
              )}
              <Typography variant="title" color="inherit" className={classes.title}>
                Webpack Chop Shop
              </Typography>
            </Toolbar>
          </AppBar>
          {loading && <LinearProgress className={classes.progress} />}
          {graph &&
            graph.errors.length > 0 && (
              <WarningBar>
                There where {graph.errors.length} errors found. Check the console for more
              </WarningBar>
            )}
          {error && <ErrorBar>{String(error)}</ErrorBar>}
          {this.renderGraph()}
          {!graph &&
            !loading && (
              <div onClick={() => this.dropzone.open()} className={classes.openFileMessage}>
                <EmptyBox
                  icon={
                    <Icon color="inherit" fontSize="default">
                      open_in_browser
                    </Icon>
                  }
                >
                  First,{' '}
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
            <Drawer anchor="top" open={showChanges} onClose={this.toggleShowChanges}>
              <div className={classes.container}>
                <ChangesView graph={graph} changes={changes} onUpdateChanges={this.updateChanges} />
              </div>
            </Drawer>
          )}
        </div>
      </Dropzone>
    )
  }
}

export default hot(module)(withStyles(styles, {withTheme: true})(App))
