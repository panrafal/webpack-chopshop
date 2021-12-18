import numeral from "numeral"

import Fuse from "fuse.js"
import { groupBy, orderBy, map, sortBy, sumBy } from "lodash"

import { FixedSizeList } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import {
  Input,
  InputAdornment,
  IconButton,
  Icon,
  ListItem,
  ListItemText,
} from "@mui/material"

import type {
  GraphNode,
  Graph,
  GraphNodeID,
  GraphEdge,
} from "../../analysis/graph"
import {
  flattenTreeToRows,
  toggleTreeRowState,
  isTreeExpanded,
  TreeState,
} from "../tree"
import { getPackageName } from "../../analysis/info"
import { useMemo, useState } from "react"
import { makeStyles } from "../makeStyles"

export type RenderItemProps<T> = {
  item: T
  key: string
  hidePackage: boolean
  style: React.CSSProperties
}

export type ElementListProps<T> = {
  graph: Graph
  items: ReadonlyArray<T>
  getNode?: (item: T) => GraphNode
  renderItem: (p: RenderItemProps<T>) => React.ReactNode
  renderEmpty: () => React.ReactNode
  search?: string
  pinned: ReadonlyArray<GraphNodeID>
  groupItemsBy?: "" | "package"
  orderItemsBy?: [string[], (boolean | "asc" | "desc")[]]
  orderGroupsBy?: [string[], (boolean | "asc" | "desc")[]]
  className?: string
}

const useStyles = makeStyles({ name: "NodeNavigator" })((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "stretch" as const,
  },
  search: {},
  listContainer: {
    flexGrow: 1,
    position: "relative" as const,
  },
  list: {
    outline: 0,
  },
}))

type Group = {
  name: string
  children: ReadonlyArray<GraphNode | GraphEdge>
  size: number
  group: true
}

const treeOptions = { getKey: (group) => group.name }

function getNodeFromElement(element: GraphNode | GraphEdge): GraphNode {
  return "to" in element ? element.to : element
}

function ElementList<T extends GraphNode | GraphEdge>({
  className,
  renderItem,
  renderEmpty,
  items,
  getNode = getNodeFromElement,
  graph,
  pinned,
  orderItemsBy,
  groupItemsBy,
  orderGroupsBy,
}: ElementListProps<T>) {
  const { classes, cx } = useStyles()
  const [search, setSearch] = useState("")
  const [treeState, setTreeState] = useState<TreeState>({ expanded: [] })

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: ["name", "id", "kind", "to.name", "to.id"],
      }),
    [items]
  )

  const filteredItems = useMemo(() => {
    const searchedItems = search
      ? fuse.search(search).map(({ item }) => item)
      : items
    if (orderItemsBy && !search) {
      return orderBy(searchedItems, ...orderItemsBy)
    }
    return searchedItems
  }, [fuse, items, search, orderItemsBy])

  const pinnedItems = useMemo(
    () => filteredItems.filter((item) => pinned.includes(getNode(item).id)),
    [pinned, filteredItems, getNode]
  )

  const listItems = useMemo(() => {
    let rows: Array<Group | GraphEdge | GraphNode>
    if (!search && groupItemsBy === "package") {
      const groups = groupBy(filteredItems, (item) => {
        const node = getNode(item)
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
                <Icon color="inherit">clear</Icon>
              </IconButton>
            </InputAdornment>
          )
        }
        placeholder="Search"
      />

      <div className={classes.listContainer}>
        <AutoSizer>
          {({ width, height }) =>
            listItems.length === 0 ? (
              renderEmpty()
            ) : (
              <FixedSizeList
                className={classes.list}
                width={width}
                height={height}
                itemCount={listItems.length}
                itemSize={60}
              >
                {({ index, style }) => {
                  const item = listItems[index]
                  if ("group" in item && item.group) {
                    return (
                      <ListItem
                        dense
                        // @ts-expect-error mui
                        ContainerComponent="div"
                        onClick={() =>
                          setTreeState(toggleTreeRowState(item, treeOptions))
                        }
                        disableGutters
                        style={style}
                        key={index}
                        divider
                      >
                        <ListItemText
                          primary={item.name}
                          secondary={`${numeral(item.size).format("0.0b")} in ${
                            item.children.length
                          }`}
                        />
                        <Icon>
                          {isTreeExpanded(treeState, item, treeOptions)
                            ? "expand_less"
                            : "expand_more"}
                        </Icon>
                      </ListItem>
                    )
                  } else {
                    return renderItem({
                      item: item as Exclude<T, Group>,
                      key: index,
                      hidePackage: Boolean(groupItemsBy),
                      style,
                    })
                  }
                }}
              </FixedSizeList>
            )
          }
        </AutoSizer>
      </div>
    </div>
  )
}

export default ElementList
