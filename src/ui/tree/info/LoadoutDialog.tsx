import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material"
import { addEdgeToggleChange } from "../../../analysis/changes"
import { useTreeContext } from "../TreeContext"
import SyntaxHighlighter from "react-syntax-highlighter"
import syntaxStyle from "react-syntax-highlighter/dist/esm/styles/hljs/hybrid"
import { useState } from "react"
import ContentCopy from "@mui/icons-material/ContentCopy"

type Props = {
  open: boolean
  onClose: () => void
}

const snippet = `copy(Object.entries(window).filter(([k,v]) => k.startsWith('webpackChunk')).flatMap(([k,v]) => v.flatMap(([id]) => id)))`

export default function LoadoutDialog({ open, onClose }: Props) {
  const { graph, updateChanges } = useTreeContext()
  const [loadInfo, setLoadInfo] = useState("")

  let loadIds = []
  let invalidLoadIds = false
  try {
    loadIds = JSON.parse("[" + loadInfo + "]").flat()
  } catch (e) {
    console.error(e)
    invalidLoadIds = true
  }

  // @ts-ignore
  const onSubmit = () => {
    const enableEdges = Object.values(graph.edges).filter(
      (edge) =>
        edge.async &&
        edge.asyncIds &&
        edge.asyncIds.some((id) => loadIds.includes(id))
    )
    console.log("Matched edges", enableEdges)
    if (enableEdges.length) {
      updateChanges((changes) =>
        enableEdges.reduce(
          (changes, edge) => addEdgeToggleChange(graph, changes, edge, true),
          changes
        )
      )
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Pick loaded split points from a running application
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Load the application, open it's console, run below code snippet and
          paste the loaded chunk IDs below
          <Stack direction="row" alignItems="center" gap={1}>
            <SyntaxHighlighter language="javascript" style={syntaxStyle}>
              {snippet}
            </SyntaxHighlighter>
            <IconButton onClick={() => navigator.clipboard.writeText(snippet)}>
              <ContentCopy />
            </IconButton>
          </Stack>
        </DialogContentText>
        <TextField
          autoFocus
          multiline
          margin="dense"
          label="Loaded Chunk IDs"
          error={invalidLoadIds}
          fullWidth
          maxRows={5}
          variant="standard"
          value={loadInfo}
          onChange={(e) => setLoadInfo(e.target.value)}
        />
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={onSubmit}
            disabled={invalidLoadIds || loadIds.length === 0}
          >
            Load
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
