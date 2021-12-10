// @flow

import type {Graph, Node, NodeID} from '../../analysis/graph'
import type {Change} from '../../analysis/changes'
import classNames from 'classnames'

import * as React from 'react'
import {createSelector} from 'reselect'
import Async from 'react-promise'
import {withStyles, Typography, LinearProgress, IconButton, Icon, Tooltip} from '@material-ui/core'

import {findChains, findAllChains} from '../../analysis/chains'
import ErrorBox from '../ErrorBox'
import NodeCard from './NodeCard'
import {getNodes, resolveEdgeForNodes} from '../../analysis/graph'
import EdgeLinkButton from './EdgeLinkButton'
import ChainsList from './ChainsList'

type Props = {|
  baseGraph: Graph,
  graph: Graph,
  fromNode: ?Node,
  toNode: ?Node,
  pinned: $ReadOnlyArray<NodeID>,
  onPinnedToggle: NodeID => any,
  onAddChange: Change => any,
  onFromNodeSelect: NodeID => any,
  onToNodeSelect: NodeID => any,
  classes: Object,
  className?: string,
|}

type State = {
  selectedChain: ?$ReadOnlyArray<NodeID>,
}

const styles = theme => ({
  root: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'stretch',
  },

  chains: {
    width: 300,
    flexGrow: 0.2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    marginRight: 24,
  },
  chainsList: {
    flexGrow: 1,
  },
  selectedChain: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    position: 'relative',
    width: 300,
  },
  selectedChainScroll: {
    overflowY: 'auto',
    padding: '0 8px 0 8px',
  },
  listProgress: {
    marginTop: 16,
  },
})

class ChainsExplorer extends React.PureComponent<Props, State> {
  state = {
    selectedChain: null,
  }

  chainsPromiseSelector = createSelector(
    p => p.graph,
    p => p.fromNode,
    p => p.toNode,
    (graph, fromNode, toNode) => {
      if (!fromNode || !toNode) return null
      return findChains(graph, fromNode, toNode)
    },
  )

  componentDidMount() {
    this.componentDidUpdate({})
  }

  _waitingForChainsPromise: any
  async componentDidUpdate(prevProps) {
    const baseGraphChanged = this.props.baseGraph !== prevProps.baseGraph
    const {fromNode: currentFrom, toNode: currentTo} = this.props
    const {fromNode: prevFrom, toNode: prevTo} = prevProps
    const fromToIdChanged =
      (currentFrom && currentFrom.id) !== (prevFrom && prevFrom.id) ||
      (currentTo && currentTo.id) !== (prevTo && prevTo.id)
    if (baseGraphChanged || fromToIdChanged) {
      // Select the first chain whenever nodes or base graph changes,
      // but keep it if user edits the graph
      const chainsPromise = this.chainsPromiseSelector(this.props)
      this.setState({
        selectedChain: null,
      })
      this._waitingForChainsPromise = chainsPromise
      if (currentFrom && currentTo && chainsPromise) {
        let chains = await chainsPromise
        if (chains.length === 0) {
          // if no chains are found, search for chains with disabled edges
          chains = await findAllChains(this.props.graph, currentFrom, currentTo)
        }
        if (this._waitingForChainsPromise !== chainsPromise) return
        this.setState({selectedChain: chains[0] || [currentFrom.id, currentTo.id]})
      }
    }
  }

  renderSelectedChain = () => {
    const {
      baseGraph,
      graph,
      pinned,
      fromNode,
      onAddChange,
      onFromNodeSelect,
      onToNodeSelect,
      onPinnedToggle,
    } = this.props
    const {selectedChain} = this.state
    if (!selectedChain) return null
    const nodes = getNodes(graph, selectedChain)

    return nodes.map((node: Node, index) => {
      const isFirst = index === 0
      const isLast = index === nodes.length - 1
      if (isFirst) return null
      const prevNode = nodes[index - 1]
      const edge = resolveEdgeForNodes(graph, prevNode.id, node.id) || {
        from: prevNode.id,
        to: node.id,
        kind: '',
        enabled: false,
      }

      return (
        <>
          <NodeCard
            baseGraph={baseGraph}
            graph={graph}
            node={node}
            retainerRootNode={fromNode}
            edge={edge}
            actions={
              <>
                <EdgeLinkButton
                  edge={edge}
                  onClick={() =>
                    onAddChange({
                      change: 'edge',
                      from: edge.from,
                      to: edge.to,
                      enabled: !edge.enabled,
                    })
                  }
                />
                <Tooltip
                  title="Set as the first node"
                  disableFocusListener
                  enterDelay={500}
                  placement="top"
                >
                  <IconButton onClick={() => onFromNodeSelect(node.id)}>
                    <Icon>vertical_align_top</Icon>
                  </IconButton>
                </Tooltip>
                {!isLast && (
                  <Tooltip
                    title="Set as the last node"
                    disableFocusListener
                    enterDelay={500}
                    placement="top"
                  >
                    <IconButton onClick={() => onToNodeSelect(node.id)}>
                      <Icon>vertical_align_bottom</Icon>
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton onClick={() => onPinnedToggle(node.id)}>
                  <Icon>{pinned.indexOf(node.id) >= 0 ? 'star' : 'star_border'}</Icon>
                </IconButton>
              </>
            }
          />
        </>
      )
    })
  }

  renderChains = chains => {
    const {graph, fromNode, toNode, classes} = this.props
    const {selectedChain} = this.state
    if (!selectedChain || !fromNode || !toNode) return null
    return (
      <ChainsList
        className={classes.chainsList}
        graph={graph}
        fromNode={fromNode}
        toNode={toNode}
        chains={chains}
        selectedChain={selectedChain}
        onChainSelect={chain => this.setState({selectedChain: chain})}
      />
    )
  }

  render() {
    const {
      className,
      classes,
      baseGraph,
      graph,
      fromNode,
      toNode,
      pinned,
      onPinnedToggle,
      onToNodeSelect,
    } = this.props
    const chainsPromise = this.chainsPromiseSelector(this.props)

    return (
      <div className={classNames(className, classes.root)}>
        <div className={classes.chains}>
          <Typography variant="headline">Dependency chains</Typography>
          <Typography variant="subheading" gutterBottom>
            Select one of the dependency chains between these two nodes. Try breaking the links
            between them to see the impact of your changes.
          </Typography>
          <Async
            promise={chainsPromise}
            then={chains => this.renderChains(chains)}
            catch={error => <ErrorBox>{error}</ErrorBox>}
            pending={<LinearProgress className={classes.listProgress} />}
          />
        </div>
        <div className={classes.selectedChain}>
          {fromNode && (
            <NodeCard
              baseGraph={baseGraph}
              graph={graph}
              node={fromNode}
              actions={
                <>
                  {fromNode !== toNode && (
                    <Tooltip
                      title="Set as the last node"
                      disableFocusListener
                      enterDelay={500}
                      placement="top"
                    >
                      <IconButton onClick={() => onToNodeSelect(fromNode.id)}>
                        <Icon>vertical_align_bottom</Icon>
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton onClick={() => onPinnedToggle(fromNode.id)}>
                    <Icon>{pinned.indexOf(fromNode.id) >= 0 ? 'star' : 'star_border'}</Icon>
                  </IconButton>
                </>
              }
            />
          )}
          <div className={classes.selectedChainScroll}>{this.renderSelectedChain()}</div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ChainsExplorer)
