// @flow

import type {NodeID, Graph} from './analysis/graph'
import type {Change} from './analysis/changes'

import * as React from 'react'
import {hot} from 'react-hot-loader'

import {readWebpackStats} from './analysis/webpack'
import {getNode, cloneGraph, abortGraph, resolveNode} from './analysis/graph'
import {applyChanges, addChange} from './analysis/changes'
import AppUI from './AppUI'

export type AppState = {|
  loading: boolean,
  baseGraph: ?Graph,
  graph: ?Graph,
  error: any,

  fromNodeId: ?NodeID,
  toNodeId: ?NodeID,
  changes: $ReadOnlyArray<Change>,
  showChanges: boolean,
  pinned: $ReadOnlyArray<NodeID>,
|}

class App extends React.Component<{}, AppState> {
  state = {
    loading: false,
    error: null,
    baseGraph: null,
    graph: null,
    fromNodeId: null,
    toNodeId: null,
    changes: [],
    showChanges: false,
    pinned: [],
  }

  async componentDidMount() {
    this.initLocalStorage()
    this.initHistory()
    if (process.env.REACT_APP_STATS) {
      this.openFile(async () => {
        console.time('loading')
        const result = await fetch(`./${process.env.REACT_APP_STATS || ''}`)
        console.timeEnd('loading')
        console.time('parsing')
        const json = await result.json()
        console.timeEnd('parsing')
        return json
      })
    }
  }

  initLocalStorage() {
    try {
      const pinned = JSON.parse(window.localStorage.getItem('pinned') || '[]')
      const changes = JSON.parse(window.localStorage.getItem('changes') || '[]')
      this.setState({pinned, changes})
      window.addEventListener('storage', this.handleStorageEvent)
    } catch (error) {
      console.error('Local storage failed to initialize', error)
    }
  }

  handleStorageEvent = (event: StorageEvent) => {
    if (event.key === 'pinned' && event.newValue) {
      const pinned = JSON.parse(event.newValue)
      if (pinned !== this.state.pinned) {
        this.setState({pinned})
      }
    }
  }

  initHistory() {
    try {
      window.addEventListener('popstate', this.handleHistoryChange)
      this.handleHistoryChange()
    } catch (error) {
      console.error('History failed to initialize', error)
    }
  }

  handleHistoryChange = () => {
    const {fromNodeId = null, toNodeId = null} = JSON.parse(
      atob((window.location.hash || '#').slice(1)) || '{}',
    )
    this.setState({
      fromNodeId,
      toNodeId,
    })
  }

  pushHistory = () => {
    const {fromNodeId, toNodeId} = this.state
    window.history.pushState(null, null, `/#${btoa(JSON.stringify({fromNodeId, toNodeId}))}`)
  }

  openFile = async callback => {
    this.setState({
      loading: true,
      error: null,
      baseGraph: null,
      graph: null,
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
    window.localStorage.setItem('changes', JSON.stringify(changes))
  }

  addChange = (change: Change) => {
    const {graph, changes} = this.state
    if (!graph) throw new Error('No graph available now')
    this.updateChanges(addChange(graph, changes, change))
  }

  setNodesSelection = (fromNodeId: ?NodeID, toNodeId: ?NodeID) => {
    this.setState({fromNodeId, toNodeId}, this.pushHistory)
  }

  resetNodesSelection = () => {
    this.setNodesSelection(null, null)
  }

  selectFromNode = (fromNodeId: NodeID) => {
    const {graph, toNodeId} = this.state
    if (graph) console.log('Selected FROM node', getNode(graph, fromNodeId))
    this.setNodesSelection(fromNodeId, toNodeId || fromNodeId)
  }

  selectToNode = (toNodeId: NodeID) => {
    const {graph, fromNodeId} = this.state
    if (graph) console.log('Selected TO node', getNode(graph, toNodeId))
    this.setNodesSelection(fromNodeId || toNodeId, toNodeId)
  }

  render() {
    const {
      graph,
      baseGraph,
      loading,
      error,
      fromNodeId,
      toNodeId,
      changes,
      showChanges,
      pinned,
    } = this.state
    return (
      <AppUI
        baseGraph={baseGraph}
        graph={graph}
        loading={loading}
        error={error}
        fromNode={graph && resolveNode(graph, fromNodeId)}
        toNode={graph && resolveNode(graph, toNodeId)}
        changes={changes}
        showChanges={showChanges}
        pinned={pinned}
        onAddChange={this.addChange}
        onFromNodeSelect={this.selectFromNode}
        onToNodeSelect={this.selectToNode}
        onNodesSelectionReset={this.resetNodesSelection}
        onChangesUpdate={this.updateChanges}
        onFileDrop={this.handleDrop}
        onShowChangesToggle={this.toggleShowChanges}
      />
    )
  }
}

export default hot(module)(App)
