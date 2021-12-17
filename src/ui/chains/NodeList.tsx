import numeral from "numeral"

import * as React from "react"
import Fuse from "fuse.js"
import { groupBy, orderBy, map, sortBy, sumBy } from "lodash"

import { List, AutoSizer } from "react-virtualized"
import {
  Input,
  InputAdornment,
  IconButton,
  Icon,
  ListItem,
  ListItemText,
  LinearProgress,
} from "@mui/material"
import withStyles from "@mui/styles/withStyles"
import classNames from "classnames"
import { createSelector } from "reselect"

import type { GraphNode, Graph, GraphNodeID } from "../../analysis/graph"
import { flattenTreeToRows, toggleTreeRowState, isTreeExpanded } from "../tree"
import { getPackageName } from "../../analysis/info"

export type Props = {
  baseGraph: Graph
  graph: Graph
  nodes: ReadonlyArray<GraphNode>
  renderItem: (a: any) => React.ReactNode
  renderEmpty: (a: any) => React.ReactNode
  search?: string
  selected?: GraphNode | null
  pinned: ReadonlyArray<GraphNodeID>
  groupNodesBy?: "" | "package"
  orderNodesBy?: [any[], string[]]
  orderGroupsBy?: [any[], string[]]
  loading?: boolean
  classes: any
  className?: string
}

type State = {
  search: string
  expanded: ReadonlyArray<any>
}

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
  },
  search: {},
  listContainer: {
    flexGrow: 1,
    position: "relative",
  },
  list: {
    outline: 0,
  },
})

const treeOptions = { getKey: (group) => group.name }

class NodeList extends React.Component<Props, State> {
  state = {
    search: "",
    expanded: [],
  }
  fuseSelector = createSelector(
    (_, p) => p.nodes,
    (nodes: ReadonlyArray<GraphNode>) => {
      return new Fuse(nodes, {
        keys: ["name", "id", "kind"],
      })
    }
  )
  searchSelector = createSelector(
    this.fuseSelector,
    (s) => s.search,
    (_, p) => p.orderNodesBy,
    (fuse, search, orderNodesBy) => {
      // @ts-expect-error Fuse
      const nodes = search ? fuse.search(search) : fuse.list
      if (orderNodesBy && !search) {
        return orderBy(nodes, ...orderNodesBy)
      }
      return nodes
    }
  )
  pinnedSelector = createSelector(
    this.searchSelector,
    (_, p) => p.pinned,
    (nodes, pinned) => {
      return nodes.filter((node) => pinned.indexOf(node.id) >= 0)
    }
  )
  groupSelector = createSelector(
    this.searchSelector,
    this.pinnedSelector,
    (_, p) => p.groupNodesBy,
    (_, p) => p.orderGroupsBy,
    (nodes, pinned, groupNodesBy, orderGroupsBy) => {
      let rows
      if (groupNodesBy === "package") {
        const groups = groupBy(nodes, (node) => {
          if (node.kind === "module") {
            return getPackageName(node) || "(root modules)"
          }
          return `(${node.kind}s)`
        })
        rows = map(groups, (children, name) => ({
          name,
          children: sortBy(children, "file"),
          size: sumBy(children, "size"),
          group: true,
        }))
        rows = orderBy(rows, ...orderGroupsBy)
      } else {
        rows = nodes.slice()
      }
      rows.unshift(...pinned)
      return rows
    }
  )
  nodesSelector = createSelector(
    this.groupSelector,
    (s) => s.expanded,
    (tree, expanded) => {
      return flattenTreeToRows(tree, { expanded }, treeOptions)
    }
  )

  renderList() {
    const { classes, baseGraph, graph, groupNodesBy, renderItem, renderEmpty } =
      this.props
    const nodes = this.state.search
      ? // $FlowFixMe
        this.searchSelector(this.state, this.props)
      : this.nodesSelector(this.state, this.props)

    return (
      <div className={classes.listContainer}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              className={classes.list}
              width={width}
              height={height}
              rowCount={nodes.length}
              rowHeight={54}
              rowRenderer={({ index, style }) => {
                const node = nodes[index]
                if (node.group) {
                  return (
                    <ListItem
                      dense
                      // @ts-expect-error mui
                      ContainerComponent="div"
                      onClick={() =>
                        this.setState(toggleTreeRowState(node, treeOptions))
                      }
                      disableGutters
                      style={style}
                      key={index}
                      divider
                    >
                      <ListItemText
                        primary={node.name}
                        secondary={`${numeral(node.size).format("0.0b")} in ${
                          node.children.length
                        }`}
                      />
                      <Icon>
                        {isTreeExpanded(this.state, node, treeOptions)
                          ? "expand_less"
                          : "expand_more"}
                      </Icon>
                    </ListItem>
                  )
                }
                return renderItem({
                  node,
                  key: index,
                  baseGraph,
                  graph,
                  hidePackage: Boolean(groupNodesBy),
                  style,
                })
              }}
              noRowsRenderer={renderEmpty}
            />
          )}
        </AutoSizer>
      </div>
    )
  }

  render() {
    const { classes, className, loading } = this.props
    const { search } = this.state
    return (
      <div className={classNames(className, classes.root)}>
        <Input
          className={classes.search}
          type="text"
          value={search}
          onChange={(el) => this.setState({ search: el.target.value })}
          endAdornment={
            search && (
              <InputAdornment position="end">
                <IconButton
                  color="inherit"
                  aria-label="Clear search"
                  onClick={() => this.setState({ search: "" })}
                  size="large"
                >
                  <Icon color="inherit">clear</Icon>
                </IconButton>
              </InputAdornment>
            )
          }
          placeholder="Search"
        />
        {loading ? (
          <LinearProgress className={classes.listProgress} />
        ) : (
          this.renderList()
        )}
      </div>
    )
  }
}
//scrollToIndex={scrollToIndex >= 0 ? scrollToIndex : null}
// @ts-expect-error mui
export default withStyles(styles)(NodeList)
