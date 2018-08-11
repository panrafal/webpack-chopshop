// @flow
import type {Graph, Node} from '../../analysis/graph'

import * as React from 'react'
import numeral from 'numeral'
import Async from 'react-promise'
import {withStyles} from '@material-ui/core'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'

import {calculateTreeSize} from '../../analysis/size'
import {getNode} from '../../analysis/graph'

type Props = {|
  baseGraph: Graph,
  graph: Graph,
  node: Node,
  classes: Object,
|}

const styles = theme => ({
  bigger: {
    color: red.A700,
  },
  smaller: {
    color: green.A700,
  },
})

function NodeSize({baseGraph, graph, node, classes}: Props) {
  return (
    <Async
      promise={Promise.all([
        baseGraph && calculateTreeSize(baseGraph, getNode(baseGraph, node.id)),
        calculateTreeSize(graph, node),
      ])}
      then={([baseTreeSize, treeSize]) => (
        <>
          {numeral(node.size).format('0[.]0b')}
          {' + '}
          {numeral(treeSize - node.size).format('0[.]0b')}
          {baseTreeSize != null && treeSize !== baseTreeSize ? (
            <span className={treeSize > baseTreeSize ? classes.bigger : classes.smaller}>
              {' ('}
              {treeSize > baseTreeSize ? '+' : '-'}
              {numeral(Math.abs(treeSize - baseTreeSize)).format('0[.]0b')}
              {')'}
            </span>
          ) : null}
        </>
      )}
      pending={'...'}
    />
  )
}
export default withStyles(styles)(NodeSize)
