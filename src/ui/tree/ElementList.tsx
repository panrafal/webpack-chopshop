import ScaleIcon from "@mui/icons-material/Scale"
import ClearIcon from "@mui/icons-material/Clear"
import {
  IconButton,
  Input,
  InputAdornment,
  LinearProgress,
  Tooltip,
} from "@mui/material"
import { groupBy, map, orderBy, sortBy, sumBy, uniq, without } from "lodash"
import {
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { useVirtual } from "react-virtual"
import { currentGraphFilter } from "../../analysis/filters"
import { getNode, Graph, GraphNode, GraphNodeID } from "../../analysis/graph"
import { getPackageName } from "../../analysis/info"
import { searchItems } from "../../analysis/search"
import { GraphWorkerClient } from "../../analysis/worker/GraphWorkerClient"
import ErrorBox from "../ErrorBox"
import { useStablePromise } from "../hooks/promises"
import { makeStyles } from "../makeStyles"
import {
  flattenTreeToRows,
  isTreeExpanded,
  toggleTreeRowState,
  TreeState,
} from "../tree"
import ElementListGroup from "./ElementListGroup"

export type RenderItemProps<T> = {
  item: T
  key: string
  hidePackage: boolean
  style: React.CSSProperties
}

export type GroupElement = {
  name: string
  children: ReadonlyArray<any>
  size: number
  group: true
}

export type OrderBySpec = [
  ReadonlyArray<string | ((d: any) => any)>,
  ReadonlyArray<boolean | "asc" | "desc">
]

export type ElementListProps<T> = {
  graph: Graph
  graphWorker: GraphWorkerClient
  items: ReadonlyArray<T>
  stickyItems?: ReadonlyArray<T>
  itemSize?: number
  getNode?: (graph: Graph, item: T) => GraphNode
  renderItem: (p: RenderItemProps<T>) => ReactElement<any>
  renderEmpty: () => React.ReactNode
  search?: string
  pinned: ReadonlyArray<GraphNodeID>
  groupItemsBy?: "" | "package"
  orderItemsBy?: OrderBySpec
  orderGroupsBy?: OrderBySpec
  className?: string
  listClassName?: string
  children?: ReactNode
  loading?: boolean
  error?: any
}

function isGroup(item: any): item is GroupElement {
  return "group" in item && item.group === true
}

const useStyles = makeStyles({ name: "ElementList" })((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "stretch" as const,
  },
  search: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  listContainer: {
    flexGrow: 1,
    position: "relative" as const,
    overflow: "auto",
  },
  list: {
    width: "100%",
    position: "relative" as const,
  },
}))

type Group<T> = {
  name: string
  children: ReadonlyArray<T>
  size: number
  group: true
}

const treeOptions = { getKey: (group) => isGroup(group) && group.name }

function getNodeFromElement(graph: Graph, element: any): GraphNode {
  if ("toId" in element) {
    return getNode(graph, element.toId)
  }
  if ("id" in element && "parents" in element) {
    return element
  }
  throw new Error("Unknown element type")
}

function ElementList<T>({
  className,
  listClassName,
  renderItem,
  renderEmpty,
  items,
  itemSize = 64,
  stickyItems = [],
  getNode = getNodeFromElement,
  graph,
  graphWorker,
  pinned,
  orderItemsBy,
  groupItemsBy,
  orderGroupsBy,
  loading,
  error,
  children,
}: ElementListProps<T>) {
  const { classes, cx } = useStyles()
  const [search, setSearch] = useState("")
  const [treeState, setTreeState] = useState<TreeState>({ expanded: [] })
  const [useTreeSize, setUseTreeSize] = useState(false)

  const isSearching = !!search
  const isGrouping = !isSearching && groupItemsBy

  const {
    value: preppedItems = items,
    loading: prepLoading,
    error: prepError,
  } = useStablePromise(
    useMemo(() => {
      // update `treeSize` in nodes, so items can be properly sorted when searching
      if (useTreeSize) {
        return Promise.all(
          items.map(async (item) => {
            const node = getNode(graph, item)
            node.treeSize = await graphWorker.calculateTreeSizeRetainedByNode(
              graph.root,
              node,
              currentGraphFilter
            )
            return item
          })
        )
      }
      return items
    }, [getNode, graph, graphWorker, useTreeSize, items])
  )

  const filteredItems = useMemo<ReadonlyArray<T>>(() => {
    const searchedItems = search
      ? searchItems(graph, preppedItems, search, getNode)
      : preppedItems
    if (useTreeSize && !isGrouping) {
      return orderBy(searchedItems, (item) => getNode(graph, item).treeSize, [
        "desc",
      ])
    }
    if (orderItemsBy && !search) {
      return orderBy(searchedItems, ...orderItemsBy)
    }
    return searchedItems
  }, [
    search,
    graph,
    preppedItems,
    getNode,
    useTreeSize,
    isGrouping,
    orderItemsBy,
  ])

  const pinnedItems = useMemo<ReadonlyArray<T>>(
    () =>
      filteredItems.filter((item) => pinned.includes(getNode(graph, item).id)),
    [filteredItems, pinned, getNode, graph]
  )

  const listItems = useMemo(() => {
    let rows: Array<Group<T> | T>
    if (isGrouping && groupItemsBy === "package") {
      const groups = groupBy(filteredItems, (item) => {
        const node = getNode(graph, item)
        if (node.kind === "module") {
          return getPackageName(node) || "(root modules)"
        }
        return `(${node.kind}s)`
      })
      rows = map(groups, (children, name) => ({
        name,
        children: sortBy(children, (item) => getNode(graph, item).file),
        size: sumBy(
          children,
          (item) =>
            (useTreeSize
              ? getNode(graph, item).treeSize
              : getNode(graph, item).size) || 0
        ),
        group: true,
      }))
      rows = orderBy(rows, ...orderGroupsBy)
    } else {
      rows = without(filteredItems, ...pinnedItems)
    }
    rows.unshift(...pinnedItems)
    return flattenTreeToRows(rows, treeState, treeOptions)
  }, [
    isGrouping,
    groupItemsBy,
    pinnedItems,
    treeState,
    filteredItems,
    orderGroupsBy,
    getNode,
    graph,
    useTreeSize,
  ])

  const stickyGroupHeaders = useMemo(() => {
    if (!groupItemsBy) return []
    let stickyGroupHeaders = []
    for (const item of listItems) {
      if (isGroup(item) && isTreeExpanded(treeState, item, treeOptions)) {
        stickyGroupHeaders.push(item)
      }
    }
    return stickyGroupHeaders
  }, [groupItemsBy, listItems, treeState])

  const stickyIndexes = uniq([...stickyItems, ...stickyGroupHeaders])
    .map((item) => listItems.indexOf(item))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)

  const renderIndex = ({ index, style }) => {
    if (stickyIndexes.includes(index) && style.position !== "sticky")
      return null
    const item = listItems[index]
    if (isGroup(item)) {
      return (
        <ElementListGroup
          group={item}
          expanded={isTreeExpanded(treeState, item, treeOptions)}
          onClick={() => setTreeState(toggleTreeRowState(item, treeOptions))}
          // drop `bottom` for sticky group headers
          style={style as any}
          key={index}
        />
      )
    } else {
      return renderItem({
        item: item as Exclude<T, Group<T>>,
        key: String(index),
        hidePackage: isGrouping && index >= pinnedItems.length,
        style,
      })
    }
  }

  const stickyElements = stickyIndexes.map((index, sticked) => {
    const lastIndex = (stickyIndexes[sticked - 1] ?? -1) + 1
    return (
      <Fragment key={String(index)}>
        <div style={{ height: (index - lastIndex) * itemSize }} />
        {renderIndex({
          index,
          style: {
            top: Math.min(3, sticked) * itemSize,
            bottom: Math.min(3, stickyIndexes.length - sticked - 1) * itemSize,
            left: 0,
            width: "100%",
            height: itemSize,
            position: "sticky",
            zIndex: 1,
          },
        })}
      </Fragment>
    )
  })

  const estimateSize = useCallback(() => itemSize ?? 64, [itemSize])
  const parentRef = useRef()
  const { virtualItems, totalSize } = useVirtual({
    size: listItems.length,
    parentRef,
    estimateSize,
  })

  return (
    <div className={cx(className, classes.root)}>
      <Input
        className={classes.search}
        type="text"
        value={search}
        onChange={(el) => setSearch(el.target.value)}
        endAdornment={
          <InputAdornment position="end">
            {search && (
              <IconButton
                color="inherit"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                size="small"
              >
                <ClearIcon fontSize="small" color="inherit" />
              </IconButton>
            )}
            <Tooltip title="Sort by retained size">
              <IconButton
                size="small"
                onClick={() => setUseTreeSize(!useTreeSize)}
              >
                <ScaleIcon
                  fontSize="small"
                  color={useTreeSize ? "primary" : "disabled"}
                />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
        placeholder="Search"
      />
      <LinearProgress
        sx={{
          visibility: loading || prepLoading ? "visible" : "hidden",
          width: "100%",
        }}
      />
      {error || (prepError && <ErrorBox error={error || prepError} />)}

      <div className={cx(classes.listContainer, listClassName)} ref={parentRef}>
        <div style={{ height: 0 }}>
          <div className={cx(classes.list)} style={{ height: totalSize }}>
            {virtualItems.map((row) =>
              renderIndex({
                index: row.index,
                style: {
                  position: "absolute",
                  left: 0,
                  width: "100%",
                  top: row.start,
                  height: itemSize,
                },
              })
            )}
            {listItems.length === 0 ? renderEmpty() : null}
            {children}
            {stickyElements}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElementList
