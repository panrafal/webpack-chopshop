import BlockIcon from "@mui/icons-material/Block"
import {
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material"
import { MouseEvent, useMemo, useState } from "react"
import { Graph, GraphNode } from "../../analysis/graph"
import EmptyBox from "../EmptyBox"
import ErrorBox from "../ErrorBox"
import { useStablePromise } from "../hooks/promises"
import { makeStyles } from "../makeStyles"
import ElementList, { ElementListProps, RenderItemProps } from "./ElementList"
import NodeNavigatorItem, { NodeNavigatorItemProps } from "./NodeNavigatorItem"
import { useTreeContext } from "./TreeContext"

export type NavigatorMode<T> = {
  getItems: () => ReadonlyArray<T> | Promise<ReadonlyArray<T>>
  getItemNode?: (graph: Graph, item: T) => GraphNode
  activateItem?: (item: T, event: MouseEvent<any>) => void
  renderTitle: () => React.ReactNode
  renderEmpty: () => string
  listProps?: () => Partial<ElementListProps<T>>
  itemProps?: (a: RenderItemProps<T>) => Partial<NodeNavigatorItemProps>
}

export type NavigatorModes = Record<string, NavigatorMode<any>>

type Props = {
  className?: string
  modes: NavigatorModes
}

const useStyles = makeStyles({ name: "NodeNavigator" })((theme) => ({
  NodeNavigator: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "stretch",
  },
  list: {
    flexGrow: 1,
  },
  listProgress: {
    marginTop: 16,
  },
}))

export default function NodeNavigator({ className, modes }: Props) {
  const { classes, cx } = useStyles()
  const [modeId, setModeId] = useState(null)
  const defaultModeId = Object.keys(modes)[0]
  const mode = modes[modeId] || modes[defaultModeId]

  const { graph, pinned, togglePinned, setActiveNodeId, openNodeChain } =
    useTreeContext()

  const nodesPromise = useMemo(() => mode.getItems(), [mode])

  const { value: nodes, loading, error } = useStablePromise(nodesPromise)
  // mode that was defined for the last returned items (so that getItemNode operates on correct set of nodes)
  const nodesMode = useMemo(() => mode, [nodes])
  const { getItemNode = (_, item) => item } = nodesMode

  return (
    <div className={cx(className, classes.NodeNavigator)}>
      <FormControl fullWidth>
        <InputLabel id="NodeNavigator-mode-label">Display</InputLabel>
        <Select
          labelId="NodeNavigator-mode-label"
          value={modes[modeId] ? modeId : defaultModeId}
          label="Display"
          onChange={() => {}}
        >
          {Object.entries(modes).map(([id, mode]) => (
            <MenuItem
              key={id}
              value={id}
              onClick={() => {
                setModeId(id)
              }}
            >
              {mode.renderTitle()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {
        <LinearProgress
          style={{ visibility: loading ? "visible" : "hidden" }}
        />
      }
      {error && <ErrorBox error={error} />}
      {nodes && (
        <ElementList
          className={classes.list}
          items={nodes}
          getNode={getItemNode}
          graph={graph}
          pinned={pinned}
          groupItemsBy="package"
          orderItemsBy={undefined}
          orderGroupsBy={[["size"], ["desc"]]}
          renderItem={({ item, ...itemProps }) => {
            const node = getItemNode(graph, item)
            return (
              <NodeNavigatorItem
                {...itemProps}
                node={node}
                retainerRootNode={graph.root}
                onClick={(event) => {
                  if (nodesMode.activateItem)
                    nodesMode.activateItem(item, event)
                  else {
                    if (event.shiftKey) setActiveNodeId(node.id)
                    openNodeChain([node])
                  }
                }}
                {...(nodesMode.itemProps &&
                  nodesMode.itemProps({ item, ...itemProps }))}
              ></NodeNavigatorItem>
            )
          }}
          renderEmpty={() => (
            <EmptyBox icon={<BlockIcon />}>{mode.renderEmpty()}</EmptyBox>
          )}
        />
      )}
    </div>
  )
}
