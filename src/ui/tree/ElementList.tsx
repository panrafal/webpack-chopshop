import ClearIcon from "@mui/icons-material/Clear"
import { IconButton, Input, InputAdornment } from "@mui/material"
import Fuse from "fuse.js"
import { groupBy, map, omit, orderBy, sortBy, sumBy, uniq } from "lodash"
import {
  createContext,
  forwardRef,
  Fragment,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import AutoSizer from "react-virtualized-auto-sizer"
import { FixedSizeList } from "react-window"
import {
  getNode,
  Graph,
  GraphEdge,
  GraphNode,
  GraphNodeID,
} from "../../analysis/graph"
import { getPackageName } from "../../analysis/info"
import { makeStyles } from "../makeStyles"
import {
  flattenTreeToRows,
  isTreeExpanded,
  toggleTreeRowState,
  TreeState,
} from "../tree"
import ElementListGroup from "./ElementListGroup"
import { useVirtual } from "react-virtual"
import { searchItems } from "../../analysis/search"

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

type Group = {
  name: string
  children: ReadonlyArray<GraphNode | GraphEdge>
  size: number
  group: true
}

const treeOptions = { getKey: (group) => group.name }

function getNodeFromElement(
  graph: Graph,
  element: GraphNode | GraphEdge
): GraphNode {
  return "toId" in element ? getNode(graph, element.toId) : element
}

const ListContext = createContext<{ listChildren?: ReactNode }>(null)
const InnerList = forwardRef(({ children, ...rest }, ref) => {
  const { listChildren } = useContext(ListContext)
  return (
    <div ref={ref as any} {...rest}>
      {children}
      {listChildren}
    </div>
  )
})

function ElementList<T extends GraphNode | GraphEdge>({
  className,
  listClassName,
  renderItem,
  renderEmpty,
  items,
  itemSize,
  stickyItems = [],
  getNode = getNodeFromElement,
  graph,
  pinned,
  orderItemsBy,
  groupItemsBy,
  orderGroupsBy,
  children,
}: ElementListProps<T>) {
  const { classes, cx } = useStyles()
  const [search, setSearch] = useState("")
  const [treeState, setTreeState] = useState<TreeState>({ expanded: [] })

  const filteredItems = useMemo<ReadonlyArray<T>>(() => {
    const searchedItems = search ? searchItems(graph, items, search) : items
    if (orderItemsBy && !search) {
      return orderBy(searchedItems, ...orderItemsBy)
    }
    return searchedItems
  }, [graph, items, search, orderItemsBy])

  const pinnedItems = useMemo(
    () =>
      filteredItems.filter((item) => pinned.includes(getNode(graph, item).id)),
    [pinned, filteredItems, getNode]
  )

  const listItems = useMemo(() => {
    let rows: Array<Group | GraphEdge | GraphNode>
    if (!search && groupItemsBy === "package") {
      const groups = groupBy(filteredItems, (item) => {
        const node = getNode(graph, item)
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
      rows = filteredItems.slice()
    }
    rows.unshift(...pinnedItems)
    return flattenTreeToRows(rows, treeState, treeOptions)
  }, [
    getNode,
    filteredItems,
    pinnedItems,
    groupItemsBy,
    orderGroupsBy,
    treeState,
    search,
  ])

  const stickyIndexes = uniq(stickyItems)
    .map((item) => listItems.indexOf(item))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)

  const renderIndex = ({ index, style }) => {
    if (stickyIndexes.includes(index) && style.position !== "sticky")
      return null
    const item = listItems[index]
    if ("group" in item && item.group) {
      return (
        <ElementListGroup
          group={item}
          expanded={isTreeExpanded(treeState, item, treeOptions)}
          onClick={() => setTreeState(toggleTreeRowState(item, treeOptions))}
          // drop `bottom` for sticky group headers
          style={omit(style, ["bottom"]) as any}
          key={index}
        />
      )
    } else {
      return renderItem({
        item: item as Exclude<T, Group>,
        key: String(index),
        hidePackage: Boolean(groupItemsBy),
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
          search && (
            <InputAdornment position="end">
              <IconButton
                color="inherit"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                size="large"
              >
                <ClearIcon color="inherit" />
              </IconButton>
            </InputAdornment>
          )
        }
        placeholder="Search"
      />
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
