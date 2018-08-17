// @flow

import numeral from 'numeral'

import * as React from 'react'
import Fuse from 'fuse.js'
import {groupBy, map, sortBy, sumBy} from 'lodash'

import {List, AutoSizer} from 'react-virtualized'
import {
  withStyles,
  Input,
  InputAdornment,
  IconButton,
  Icon,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@material-ui/core'
import classNames from 'classnames'
import {createSelector} from 'reselect'

import type {Node, Graph, NodeID} from '../../analysis/graph'
import {flattenTreeToRows, toggleTreeRowState, isTreeExpanded} from '../tree'
import {getPackageName} from '../../analysis/info'

type Props = {|
  baseGraph: Graph,
  graph: Graph,
  nodes: $ReadOnlyArray<Node>,
  renderItem: any => React.Node,
  renderEmpty: any => React.Node,
  search?: string,
  selected?: ?Node,
  pinned: $ReadOnlyArray<NodeID>,
  sortGroupsBySize?: boolean,
  loading?: boolean,
  classes: Object,
  className?: string,
|}

type State = {
  search: string,
  expanded: $ReadOnlyArray<any>,
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
  },
  search: {},
  listContainer: {
    flexGrow: 1,
    position: 'relative',
  },
  list: {
    outline: 0,
  },
})

const treeOptions = {getKey: group => group.name}

class NodeList extends React.PureComponent<Props, State> {
  state = {
    search: '',
    expanded: [],
  }
  fuseSelector = createSelector(
    (_, p) => p.nodes,
    nodes => {
      return new Fuse(nodes, {
        keys: ['name', 'id', 'kind'],
      })
    },
  )
  searchSelector = createSelector(
    this.fuseSelector,
    s => s.search,
    (fuse, search) => {
      return search ? fuse.search(search) : fuse.list
    },
  )
  pinnedSelector = createSelector(
    this.searchSelector,
    (_, p) => p.pinned,
    (nodes, pinned) => {
      return nodes.filter(node => pinned.indexOf(node.id) >= 0)
    },
  )
  groupSelector = createSelector(
    this.searchSelector,
    this.pinnedSelector,
    (_, p) => p.sortGroupsBySize,
    (nodes, pinned, sortGroupsBySize) => {
      const groups = groupBy(nodes, node => {
        if (node.kind === 'module') {
          return getPackageName(node) || '(root modules)'
        }
        return `(${node.kind}s)`
      })
      const rows = sortBy(
        map(groups, (children, name) => ({
          name,
          children: sortBy(children, 'file'),
          size: sumBy(children, 'size'),
          group: true,
        })),
        sortGroupsBySize ? group => -group.size : 'name',
      )
      rows.unshift(...pinned)
      return rows
    },
  )
  nodesSelector = createSelector(
    this.groupSelector,
    s => s.expanded,
    (tree, expanded) => {
      return flattenTreeToRows(tree, {expanded}, treeOptions)
    },
  )

  renderList() {
    const {classes, baseGraph, graph, renderItem, renderEmpty} = this.props
    const nodes = this.nodesSelector(this.state, this.props)

    return (
      <div className={classes.listContainer}>
        <AutoSizer>
          {({width, height}) => (
            <List
              className={classes.list}
              width={width}
              height={height}
              rowCount={nodes.length}
              rowHeight={54}
              rowRenderer={({index, style}) => {
                const node = nodes[index]
                if (node.group) {
                  return (
                    <ListItem
                      dense
                      ContainerComponent="div"
                      button
                      onClick={() => this.setState(toggleTreeRowState(node, treeOptions))}
                      disableGutters
                      style={style}
                      key={index}
                      divider
                    >
                      <ListItemText
                        primary={node.name}
                        secondary={`${numeral(node.size).format('0.0b')} in ${
                          node.children.length
                        }`}
                      />
                      <Icon>
                        {isTreeExpanded(this.state, node, treeOptions)
                          ? 'expand_less'
                          : 'expand_more'}
                      </Icon>
                    </ListItem>
                  )
                }
                return renderItem({node, key: node.id, baseGraph, graph, style})
              }}
              noRowsRenderer={renderEmpty}
            />
          )}
        </AutoSizer>
      </div>
    )
  }

  render() {
    const {classes, className, loading} = this.props
    const {search} = this.state
    return (
      <div className={classNames(className, classes.root)}>
        <Input
          className={classes.search}
          id="adornment-password"
          type="text"
          value={search}
          onChange={el => this.setState({search: el.target.value})}
          endAdornment={
            search && (
              <InputAdornment position="end">
                <IconButton
                  color="inherit"
                  aria-label="Clear search"
                  onClick={() => this.setState({search: ''})}
                >
                  <Icon color="inherit">clear</Icon>
                </IconButton>
              </InputAdornment>
            )
          }
          placeholder="Search"
        />
        {loading ? <LinearProgress className={classes.listProgress} /> : this.renderList()}
      </div>
    )
  }
}
//scrollToIndex={scrollToIndex >= 0 ? scrollToIndex : null}
export default withStyles(styles)(NodeList)
