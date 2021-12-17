import type { Graph, GraphNode, GraphNodeID } from "../../analysis/graph"

import * as React from "react"
import classNames from "classnames"
import { difference } from "lodash"
import { List, AutoSizer } from "react-virtualized"
import { Icon } from "@mui/material";

import withStyles from '@mui/styles/withStyles';

import ChainItem from "./ChainItem"
import EmptyBox from "../EmptyBox"

type Props = {
  graph: Graph
  fromNode: GraphNode
  toNode: GraphNode
  chains: ReadonlyArray<ReadonlyArray<GraphNodeID>>
  selectedChain: ReadonlyArray<GraphNodeID>
  onChainSelect: (nodes: ReadonlyArray<GraphNodeID>) => void
  classes: any
  className?: string
}

const styles = (theme) => ({
  root: {
    position: "relative",
  },
  list: {
    outline: 0,
  },
})

function ChainsList(props: Props) {
  const {
    classes,
    className,
    graph,
    chains,
    fromNode,
    toNode,
    selectedChain,
    onChainSelect,
  } = props
  const usedIds = [fromNode.id, toNode.id]
  const finalChains = chains.map((chain) => {
    const through = difference(chain, usedIds)
    usedIds.push(...through)
    return { through, chain }
  })

  return (
    <div className={classNames(className, classes.root)}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            className={classes.list}
            width={width}
            height={height}
            rowCount={finalChains.length}
            rowHeight={54}
            rowRenderer={({ index, style }) => {
              const { chain, through } = finalChains[index]
              return (
                <ChainItem
                  key={index}
                  graph={graph}
                  chain={chain}
                  through={through}
                  onClick={() => onChainSelect(chain)}
                  style={style}
                  checked={selectedChain.every(
                    (id, index) => chain[index] === id
                  )}
                />
              )
            }}
            noRowsRenderer={() => (
              <EmptyBox icon={<Icon>link_off</Icon>}>
                There is no connection between these nodes
              </EmptyBox>
            )}
          />
        )}
      </AutoSizer>
    </div>
  )
}

// @ts-expect-error mui
export default withStyles(styles)(ChainsList)
