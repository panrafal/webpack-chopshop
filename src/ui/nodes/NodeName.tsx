import type { GraphNode } from "../../analysis/graph"

import * as React from "react"
import classNames from "classnames"
import { Tooltip } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import { getModuleInfo } from "../../analysis/info"

type Props = {
  node: GraphNode
  hidePackage?: boolean
  onlyPackage?: boolean
  tooltip?: boolean | string
  children?: React.ReactNode
  className?: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
    display: "inline-flex",
    flexDirection: "row",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  packageName: {
    textOverflow: "ellipsis",
    flexShrink: 10,
    overflow: "hidden",
  },
  path: {
    textOverflow: "ellipsis",
    flexShrink: 1000,
    overflow: "hidden",
    minWidth: 10,
  },
  name: {
    textOverflow: "ellipsis",
    flexShrink: 1,
    overflow: "hidden",
  },
  extension: {
    flexShrink: 0,
  },
  children: {},
}))

export default function NodeName({
  node,
  hidePackage,
  onlyPackage,
  tooltip,
  children,
  className,
}: Props) {
  const classes = useStyles()
  // {selectFromNode && <a onClick={() => selectFromNode(node.id)}>From</a>}
  // {selectToNode && <a onClick={() => selectToNode(node.id)}>To</a>}

  const info = getModuleInfo(node)

  const packageName = hidePackage ? "" : info.packageName
  const path = onlyPackage ? "" : (info.path || "").replace(/^\/|\/$/g, "")
  const name = onlyPackage ? "" : (info.name || "") + (info.extension || "")

  const text = (
    <span className={classNames(className, classes.root)}>
      {packageName && (
        <span className={classes.packageName}>{packageName}</span>
      )}
      {packageName && path ? "/" : ""}
      {path && <span className={classes.path}>{path}</span>}
      {(packageName || path) && name ? "/" : ""}
      {name && <span className={classes.name}>{name}</span>}
      {(packageName || name) && children ? <span>,&nbsp;</span> : ""}
      {children && <span className={classes.children}>{children}</span>}
    </span>
  )

  if (tooltip) {
    return (
      <Tooltip
        title={
          typeof tooltip === "boolean"
            ? `${node.kind}: ${node.name || ""} (${String(node.originalId)})`
            : tooltip
        }
        placement="top"
        enterDelay={100}
        disableFocusListener
      >
        {text}
      </Tooltip>
    )
  }

  return text
}
