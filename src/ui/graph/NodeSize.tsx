// @flow
import type {Graph, Node} from '../../analysis/graph'

import * as React from 'react'
import numeral from 'numeral'
import Async from 'react-promise'
import {withStyles, Tooltip} from '@material-ui/core'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'

import {calculateTreeSize, calculateRetainedTreeSize} from '../../analysis/size'

type Props = {|
  baseGraph: Graph,
  graph: Graph,
  retainerRootNode?: ?Node,
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

function NodeSize({baseGraph, graph, node, retainerRootNode, classes}: Props) {
  const treeSizeCalculator = retainerRootNode
    ? g => calculateRetainedTreeSize(g, retainerRootNode, node)
    : g => calculateTreeSize(g, node)
  return (
    <Async
      promise={Promise.all([
        baseGraph ? treeSizeCalculator(baseGraph) : undefined,
        treeSizeCalculator(graph),
      ])}
      then={([baseTreeSize, treeSize]) => (
        <>
          {!retainerRootNode || treeSize > 0 ? (
            <>
              <Tooltip title="Node size" enterDelay={500}>
                <span>{numeral(node.size).format('0[.]0b')}</span>
              </Tooltip>
              {' + '}
              <Tooltip
                title={retainerRootNode ? 'Size of retained dependencies ' : 'Size of dependencies'}
                enterDelay={500}
              >
                <span>{numeral(treeSize - node.size).format('0[.]0b')}</span>
              </Tooltip>
            </>
          ) : (
            'unrelated'
          )}
          {baseTreeSize != null && treeSize !== baseTreeSize ? (
            <Tooltip title="Difference without changes" enterDelay={500}>
              <span className={treeSize > baseTreeSize ? classes.bigger : classes.smaller}>
                {' ('}
                {treeSize > baseTreeSize ? '+' : '-'}
                {numeral(Math.abs(treeSize - baseTreeSize)).format('0[.]0b')}
                {')'}
              </span>
            </Tooltip>
          ) : null}
        </>
      )}
      pending={'...'}
    />
  )
}
export default withStyles(styles)(NodeSize)
