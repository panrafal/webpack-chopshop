import type { Graph, GraphNodeID } from "../../analysis/graph"
import type { Change } from "../../analysis/changes"

import * as React from "react"
import { without } from "lodash"
import { CopyToClipboard } from "react-copy-to-clipboard"
import {
  IconButton,
  Icon,
  List,
  Toolbar,
  Button,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material"
import { resolveEdgeForNodes, getNode } from "../../analysis/graph"
import EmptyBox from "../EmptyBox"
import { encodeUrlStateHash, decodeUrlStateHash } from "../../history"
import { makeStyles } from "../makeStyles"

type Props = {
  graph: Graph
  changes: ReadonlyArray<Change>
  pinned: ReadonlyArray<GraphNodeID>
  onChangesUpdate: (a: ReadonlyArray<Change>) => void
}

const useStyles = makeStyles({ name: "ChangesPage" })((theme) => ({
  root: {},
  list: {
    maxHeight: "70vh",
    overflowY: "auto",
  },
  delete: {},
}))

export default function ChangesPage({
  graph,
  changes,
  pinned,
  onChangesUpdate,
}: Props) {
  const { classes } = useStyles()
  const textsToCopy = []
  // Generate new url with pins and most current changes
  const { origin, pathname, hash } = window.location
  const currentUrlState = decodeUrlStateHash(hash.slice(1))
  const shareUrl = `${origin}${pathname}#${encodeUrlStateHash({
    ...currentUrlState,
    changes,
    pinned,
  })}`
  textsToCopy.push(shareUrl)
  return (
    <div>
      <List className={classes.list}>
        {changes
          .map((change, index) => {
            const edge = resolveEdgeForNodes(graph, change.from, change.to)
            if (!edge) return null
            const fromNode = edge.from
            const toNode = edge.to
            const fromName = fromNode.file || fromNode.name || fromNode.id
            const toName = edge.name || toNode.name || toNode.id
            textsToCopy.push(
              edge.enabled
                ? `In "${fromName}" add "${toName}"`
                : `In "${fromName}" remove "${toName}"`
            )
            return (
              <ListItem key={index}>
                <IconButton
                  aria-label="Delete"
                  className={classes.delete}
                  onClick={() => onChangesUpdate(without(changes, change))}
                  size="large"
                >
                  <Icon>delete</Icon>
                </IconButton>
                <ListItemText
                  primary={
                    edge.enabled ? (
                      <>
                        In "<b>{fromName}</b>" add "<b>{toName}</b>"
                      </>
                    ) : (
                      <>
                        In "<b>{fromName}</b>" remove "<b>{toName}</b>"
                      </>
                    )
                  }
                />
                <ListItemSecondaryAction />
              </ListItem>
            )
          })
          .reverse()}
        {changes.length === 0 && (
          <EmptyBox icon={<Icon>block</Icon>}>
            No changes applied. Try breaking links between dependencies
          </EmptyBox>
        )}
      </List>
      <Toolbar>
        <Button onClick={() => onChangesUpdate([])}>Reset changes</Button>
        {textsToCopy.length > 0 ? (
          <CopyToClipboard text={textsToCopy.join("\n\n")}>
            <Button>Copy changes to clipboard</Button>
          </CopyToClipboard>
        ) : null}
        <CopyToClipboard text={shareUrl}>
          <Button>Copy URL to clipboard</Button>
        </CopyToClipboard>
      </Toolbar>
    </div>
  )
}
