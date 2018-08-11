// @flow

import type {Graph, Node, NodeID} from '../../analysis/graph'

import * as React from 'react'
import classNames from 'classnames'
import {createSelector} from 'reselect'
import Async from 'react-promise'
import {withStyles, Icon} from '@material-ui/core'

import {getDeepNodeChildren, getDeepNodeParents} from '../../analysis/dependencies'
import {getNodes} from '../../analysis/graph'
import EmptyBox from '../EmptyBox'
import NodeItem from './NodeItem'
import NodeList from './NodeList'

export type Props = {|
  baseGraph: Graph,
  graph: Graph,
  header: React.Node,
  node: ?Node,
  selected: ?Node,
  walkParents?: boolean,
  emptyMessage?: string,
  onNodeSelect: NodeID => void,
  classes: Object,
  className?: string,
|}

const styles = theme => ({
  root: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'stretch',
  },
  list: {
    flexGrow: 1,
  },
  listProgress: {
    marginTop: 16,
  },
})

class GraphExplorer extends React.PureComponent<Props> {
  nodesSelector = createSelector(
    (_, p) => p.graph,
    (_, p) => p.node,
    (_, p) => p.walkParents,
    (graph, node, walkParents) => {
      if (!node) {
        return Promise.resolve(Object.values(graph.nodes))
      }
      const promise = walkParents
        ? getDeepNodeParents(graph, node)
        : getDeepNodeChildren(graph, node)
      return promise.then(ids => getNodes(graph, ids))
    },
  )

  renderList(nodes) {
    const {
      classes,
      baseGraph,
      graph,
      selected,
      emptyMessage = 'No nodes found',
      onNodeSelect,
    } = this.props
    return (
      <NodeList
        className={classes.list}
        nodes={nodes || []}
        loading={nodes == null}
        baseGraph={baseGraph}
        graph={graph}
        selected={selected}
        sortGroupsBySize
        renderItem={itemProps => (
          <NodeItem
            {...itemProps}
            onClick={() => onNodeSelect(itemProps.node.id)}
            checked={selected ? selected.id === itemProps.node.id : false}
          />
        )}
        renderEmpty={() => <EmptyBox icon={<Icon>block</Icon>}>{emptyMessage}</EmptyBox>}
      />
    )
  }

  render() {
    const {header, className, classes} = this.props

    const dependenciesPromise = this.nodesSelector(null, this.props)

    return (
      <div className={classNames(className, classes.root)}>
        {header}
        <Async
          promise={dependenciesPromise}
          then={nodes => this.renderList(nodes)}
          pending={() => this.renderList(null)}
        />
      </div>
    )
  }
}

export default withStyles(styles)(GraphExplorer)
