import { withStyles } from "@material-ui/core"
import { Change } from "../../analysis/changes"
import { Graph, NodeID } from "../../analysis/graph"

type Props = {
  baseGraph: Graph
  graph: Graph
  toNode: Node | undefined | null
  pinned: ReadonlyArray<NodeID>
  onPinnedToggle: (a: NodeID) => any
  onAddChange: (a: Change) => any
  onToNodeSelect: (a: NodeID) => any
  classes: any
  className?: string
}

const styles = (theme) => ({})

function TreeExplorer(props: Props) {
  return <div></div>
}

export default withStyles(styles)(TreeExplorer)
