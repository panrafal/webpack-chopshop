export type TreeState = {
  expanded: ReadonlyArray<any>
}

export type TreeOptions<T> = {
  getChildren?: (a: any) => ReadonlyArray<T>
  getKey?: (a: any) => any
}

const defaultGetChildren = (row) => row.children
const defaultGetKey = (row) => row

export function isTreeExpanded(
  state: TreeState,
  row: any,
  options: TreeOptions<any> = {}
): boolean {
  const { getKey = defaultGetKey } = options
  return state.expanded.indexOf(getKey(row)) >= 0
}

// Flattens a tree of items into a flat set of rows, which can be then used in any list rendering lib
export function flattenTreeToRows<T>(
  tree: ReadonlyArray<T>,
  state: TreeState,
  options: TreeOptions<T> = {}
): ReadonlyArray<T> {
  const result = []
  const { getChildren = defaultGetChildren } = options
  for (const row of tree) {
    result.push(row)
    if (isTreeExpanded(state, row, options)) {
      const children = getChildren(row)
      result.push(...flattenTreeToRows(children, state, options))
    }
  }
  return result
}

export function toggleTreeRow(
  state: TreeState,
  row: any,
  options: TreeOptions<any> = {},
  expand?: boolean
): TreeState {
  const current = isTreeExpanded(state, row, options)
  if (expand == null) {
    expand = !current
  }
  if (expand === current) return state
  const { getKey = defaultGetKey } = options
  const key = getKey(row)
  if (expand) {
    return { ...state, expanded: [...state.expanded, key] }
  } else {
    return { ...state, expanded: state.expanded.filter((e) => e !== key) }
  }
}

export const toggleTreeRowState =
  (row: any, options: TreeOptions<any> = {}) =>
  (state: TreeState) =>
    toggleTreeRow(state, row, options)
