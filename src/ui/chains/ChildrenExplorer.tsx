import type { GraphNode, GraphNodeID, Graph } from "../../analysis/graph"

import * as React from "react"
import classNames from "classnames"
import { without } from "lodash"
import { createSelector } from "reselect"
import { withStyles } from "@material-ui/core"

import { getNodes, getAllNodes } from "../../analysis/graph"
import GraphExplorer, { Mode } from "./GraphExplorer"
import NodeName from "./NodeName"
import {
  keepOnlyLeafModules,
  getDeepNodeChildren,
  getRetainedNodes,
} from "../../analysis/dependencies"
import { calculateRetainedTreeSize } from "../../analysis/size"

type Props = {
  baseGraph: Graph
  graph: Graph
  pinned: ReadonlyArray<GraphNodeID>
  fromNode: GraphNode | undefined | null
  toNode: GraphNode | undefined | null
  onNodeSelect: (a: GraphNodeID) => void
  className?: string
  classes: any
}

const styles = {
  root: {},
}

class ChildrenExplorer extends React.Component<Props> {
  allNodesSelector = createSelector(
    (_, p) => p.graph,
    (graph) => getAllNodes(graph)
  )
  getAllNodes = () => this.allNodesSelector(this.state, this.props)

  leafNodesSelector = createSelector(
    (_, p) => p.graph,
    (graph) => keepOnlyLeafModules(graph, getAllNodes(graph))
  )
  getLeafNodes = () => this.leafNodesSelector(this.state, this.props)

  directChildrenNodesSelector = createSelector(
    (_, p) => p.graph,
    (_, p) => p.fromNode,
    (_, p) => p.toNode,
    async (graph, fromNode, toNode) => {
      if (!fromNode || !toNode) return []
      let nodes = await getNodes(graph, toNode.children)
      nodes = await Promise.all(
        nodes.map(async (node) => ({
          ...node,
          treeSize: await calculateRetainedTreeSize(graph, fromNode, node),
        }))
      )
      return nodes
    }
  )
  getDirectChildrenNodes = () =>
    this.directChildrenNodesSelector(this.state, this.props)

  retainedChildrenNodesSelector = createSelector(
    (_, p) => p.graph,
    (_, p) => p.fromNode,
    (_, p) => p.toNode,
    (graph, fromNode, toNode) => {
      if (!fromNode || !toNode) return []
      if (fromNode === toNode) return this.getChildrenNodes()
      return getRetainedNodes(graph, fromNode, toNode).then((ids) =>
        getNodes(graph, without(ids, toNode.id))
      )
    }
  )
  getRetainedChildrenNodes = () =>
    this.retainedChildrenNodesSelector(this.state, this.props)

  childrenNodesSelector = createSelector(
    (_, p) => p.graph,
    (_, p) => p.fromNode,
    (graph, fromNode) => {
      if (!fromNode) return []
      return getDeepNodeChildren(graph, fromNode).then((ids) =>
        getNodes(graph, ids)
      )
    }
  )
  getChildrenNodes = () => this.childrenNodesSelector(this.state, this.props)

  childLeafNodesSelector = createSelector(
    (_, p) => p.graph,
    this.childrenNodesSelector,
    async (graph, nodes) => {
      return keepOnlyLeafModules(graph, await nodes)
    }
  )
  getChildLeafNodes = () => this.childLeafNodesSelector(this.state, this.props)

  modes: { [key: string]: Mode } = {
    all: {
      getNodes: this.getAllNodes,
      renderTitle: () => "All Nodes",
      renderInfo: () => "Select node to start from",
      renderEmpty: () => "Nothing found",
    },
    children: {
      getNodes: this.getChildrenNodes,
      renderTitle: () => "All Children",
      renderInfo: () => {
        const { fromNode } = this.props
        if (!fromNode) return null
        return (
          <>
            Move down to children of <NodeName node={fromNode} />
          </>
        )
      },
      renderEmpty: () => "No children found",
    },
    retainedChildren: {
      getNodes: this.getRetainedChildrenNodes,
      renderTitle: () => "Retained Children",
      renderInfo: () => {
        const { toNode } = this.props
        if (!toNode) return null
        return (
          <>
            Move down to children retained by <NodeName node={toNode} />
          </>
        )
      },
      renderEmpty: () => "No children found",
    },
    directChildren: {
      getNodes: this.getDirectChildrenNodes,
      renderTitle: () => "Direct Children",
      renderInfo: () => {
        const { toNode } = this.props
        if (!toNode) return null
        return (
          <>
            Move down to direct children of <NodeName node={toNode} />
          </>
        )
      },
      renderEmpty: () => "No children found",
      listProps: () => ({
        groupNodesBy: "",
        orderNodesBy: [["treeSize"], ["desc"]],
      }),
    },
    childLeafs: {
      getNodes: this.getChildLeafNodes,
      renderTitle: () => "Child Leaf Modules",
      renderInfo: () => {
        const { fromNode } = this.props
        if (!fromNode) return null
        return (
          <>
            Move down to child leaf modules of <NodeName node={fromNode} />
          </>
        )
      },
      renderEmpty: () => "No modules found",
    },
    leafs: {
      getNodes: this.getLeafNodes,
      renderTitle: () => "Leaf Modules",
      renderInfo: () => "Select leaf module to finish at",
      renderEmpty: () => "No modules found",
    },
  }

  render() {
    const {
      classes,
      className,
      fromNode,
      toNode,
      baseGraph,
      graph,
      pinned,
      onNodeSelect,
    } = this.props

    return (
      <GraphExplorer
        className={classNames(classes.root, className)}
        modes={this.modes}
        defaultMode={"children"}
        baseGraph={baseGraph}
        graph={graph}
        pinned={pinned}
        onNodeSelect={onNodeSelect}
        selected={toNode}
        retainerRootNode={fromNode}
      />
    )
  }
}

export default withStyles(styles)(ChildrenExplorer)