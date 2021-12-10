import { PaletteColor } from "@mui/material"
import { AppTheme } from "../ui/theme"
import { GraphNode } from "./graph"
import { ConditionalKeys } from "type-fest"

type GroupTestFn = (node: GraphNode) => boolean

export type GroupInfo = {
  test: RegExp | GroupTestFn
  name: string
  colorName: ConditionalKeys<AppTheme["palette"], PaletteColor>
  priority: number
}
type GroupsSpec = GroupInfo[]

const groupsSpec: GroupsSpec = [
  {
    test: /\/node_modules\//,
    name: "Vendors",
    colorName: "groupVendors",
    priority: 1,
  },
  {
    test: /\.(m?jsx?|tsx?)$/,
    name: "JS",
    colorName: "groupCode",
    priority: 30,
  },
  {
    test: /\.(css|scss|sass)$/,
    name: "CSS",
    colorName: "groupStyles",
    priority: 12,
  },
  {
    test: /\.(jpe?g|png|gif|webm)$/,
    name: "Images",
    colorName: "groupImages",
    priority: 11,
  },
  {
    test: /\.(graphql)$/,
    name: "GraphQL",
    colorName: "groupOther",
    priority: 10,
  },
  {
    test: /.*/,
    name: "Other",
    colorName: "groupOther",
    priority: 5,
  },
]

export function getNodeGroup(node: GraphNode): GroupInfo {
  for (const group of groupsSpec) {
    if (typeof group.test === "function" && !group.test(node)) continue
    if (
      group.test instanceof RegExp &&
      !group.test.test(node.file || "<unknown>")
    )
      continue
    return group
  }
  throw new Error(`No group matched node ${node.id}`)
}
