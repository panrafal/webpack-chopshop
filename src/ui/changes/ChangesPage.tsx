import Delete from "@mui/icons-material/Delete"
import {
  Button,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Toolbar,
} from "@mui/material"
import { omit } from "lodash"
import * as React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { Changes, hasChanges, resetEdgeToggles } from "../../analysis/changes"
import { getNode, Graph, GraphNodeID, resolveEdge } from "../../analysis/graph"
import { UpdateChangesFn } from "../../logic/useGraphState"
import {
  decodeUrlStateHash,
  encodeUrlStateHash,
} from "../../logic/useHistoryState"
import EmptyBox from "../EmptyBox"
import { makeStyles } from "../makeStyles"

type Props = {
  graph: Graph
  changes: Changes
  pinned: ReadonlyArray<GraphNodeID>
  updateChanges: UpdateChangesFn
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
  updateChanges,
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
        {Object.entries(changes.edgeToggles || {})
          .map(([edgeId, enabled]) => {
            // ignore enabled async edges
            if (enabled) return null
            const edge = resolveEdge(graph, edgeId)
            if (!edge) return null
            const fromNode = getNode(graph, edge.fromId)
            const toNode = getNode(graph, edge.toId)
            const fromName = fromNode.file || fromNode.name || fromNode.id
            const toName = edge.name || toNode.name || toNode.id
            textsToCopy.push(
              edge.enabled
                ? `In "${fromName}" add "${toName}"`
                : `In "${fromName}" remove "${toName}"`
            )
            return (
              <ListItem key={edgeId}>
                <IconButton
                  aria-label="Delete"
                  className={classes.delete}
                  onClick={() =>
                    updateChanges((changes) => ({
                      ...changes,
                      edgeToggles: omit(changes.edgeToggles, [edgeId]),
                    }))
                  }
                  size="large"
                >
                  <Delete />
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
        {!hasChanges(changes) && (
          <EmptyBox icon={<Icon>block</Icon>}>
            No changes applied. Try breaking links between dependencies
          </EmptyBox>
        )}
      </List>
      <Toolbar>
        <Button
          onClick={() =>
            updateChanges((changes) => resetEdgeToggles(changes, false))
          }
        >
          Reset changes
        </Button>
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
