import { withStyles } from "@material-ui/core"
import classNames from "classnames"
import { Change } from "../../analysis/changes"
import { Graph, GraphNode, GraphNodeID } from "../../analysis/graph"
import ChainsExplorer from "./ChainsExplorer"
import ChildrenExplorer from "./ChildrenExplorer"
import ParentsExplorer from "./ParentsExplorer"

type Props = {
  baseGraph: Graph
  graph: Graph
  fromNode: GraphNode | undefined | null
  toNode: GraphNode | undefined | null
  pinned: ReadonlyArray<GraphNodeID>
  onPinnedToggle: (a: GraphNodeID) => any
  onAddChange: (a: Change) => any
  onFromNodeSelect: (a: GraphNodeID) => any
  onToNodeSelect: (a: GraphNodeID) => any
  classes: any
  className?: string
}

const styles = (theme) => ({
  panes: {
    display: "flex",
    flexDirection: "row" as const,
    flexGrow: 1,
    justifyContent: "space-between",
    padding: "24px 24px 0 24px",
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
})

function ChainsPage({
  baseGraph,
  graph,
  fromNode,
  toNode,
  pinned,
  onPinnedToggle,
  onAddChange,
  onFromNodeSelect,
  onToNodeSelect,
  classes,
  className,
}: Props) {
  return (
    <div className={classNames(className, classes.panes)}>
      <ParentsExplorer
        className={classes.parentsExplorer}
        baseGraph={baseGraph}
        graph={graph}
        pinned={pinned}
        toNode={toNode}
        fromNode={fromNode}
        onNodeSelect={onFromNodeSelect}
      />
      {fromNode && toNode ? (
        <ChainsExplorer
          className={classes.pathsExplorer}
          baseGraph={baseGraph}
          graph={graph}
          pinned={pinned}
          fromNode={fromNode}
          toNode={toNode}
          onFromNodeSelect={onFromNodeSelect}
          onToNodeSelect={onToNodeSelect}
          onAddChange={onAddChange}
          onPinnedToggle={onPinnedToggle}
        />
      ) : null}
      {fromNode ? (
        <ChildrenExplorer
          className={classes.childrenExplorer}
          baseGraph={baseGraph}
          graph={graph}
          pinned={pinned}
          toNode={toNode}
          fromNode={fromNode}
          onNodeSelect={onToNodeSelect}
        />
      ) : null}
    </div>
  )
}

export default withStyles(styles)(ChainsPage)
