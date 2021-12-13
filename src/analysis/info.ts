import type { Node, NodeID } from "./graph"

export type EdgePath = NodeID[]

// https://regex101.com/r/yU5wqf/2
// 1 - path to packages dir (null if no package)
// 2 - package name (null if no package)
// 3 - directory in package
// 4 - filename
// 5 - extension
const FILENAME_RE =
  /^(?:(.*\/(?:node_modules|web_modules|packages|~)\/)((?:@[^/]+?\/)?[^/]+))?(.*?\/)?([^/]+)?(\.[^./]+)?$/

type ModuleInfo = {
  pathToPackage?: string
  packageName?: string
  path?: string
  name?: string
  extension?: string
}

export function getModuleInfo({ file, name, id }: Node): ModuleInfo {
  if (!file) {
    return { name: name || String(id) || "(unknown)" }
  }
  const found = file.match(FILENAME_RE)
  if (!found) {
    return { path: file }
  }
  return {
    pathToPackage: found[1],
    packageName: found[2],
    path: found[3],
    name: found[4],
    extension: found[5],
  }
}

export function getPackageName({ file }: Node): string {
  if (!file) return ""
  const found = file.match(FILENAME_RE)
  return found ? found[2] : ""
}

export function getPackageRelativeFilePath(node: Node): string {
  const { file } = node
  if (!file) return ""
  const pkg = getPackageName(node)
  if (!pkg) return ""
  return file.slice(file.indexOf(pkg) + pkg.length + 1)
}

export function isExternal({ file }: Node): boolean {
  if (!file) return false
  return file.indexOf("/node_modules/") >= 0
}

export function getFileExtension({ file }: Node): string {
  if (!file) return ""
  const dot = file.lastIndexOf(".")
  if (dot <= 0) return ""
  return file.slice(dot + 1)
}
