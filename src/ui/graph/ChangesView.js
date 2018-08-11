// @flow

import type {Graph} from '../../analysis/graph'
import type {Change} from '../../analysis/changes'

import * as React from 'react'
import {without} from 'lodash'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import {
  withStyles,
  IconButton,
  Icon,
  List,
  Toolbar,
  Button,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core'
import {resolveEdgeForNodes, getNode} from '../../analysis/graph'
import EmptyBox from '../EmptyBox'

type Props = {|
  graph: Graph,
  changes: $ReadOnlyArray<Change>,
  onUpdateChanges: ($ReadOnlyArray<Change>) => void,
  classes: Object,
|}

const styles = theme => ({
  root: {},
  list: {
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  delete: {},
})

class ChangesView extends React.PureComponent<Props> {
  render() {
    const {classes, graph, changes, onUpdateChanges} = this.props
    const textsToCopy = []
    return (
      <div>
        <List className={classes.list}>
          {changes.map((change, index) => {
            const edge = resolveEdgeForNodes(graph, change.from, change.to)
            if (!edge) return null
            const fromNode = getNode(graph, edge.from)
            const toNode = getNode(graph, edge.to)
            const fromName = fromNode.file || fromNode.name || fromNode.id
            const toName = edge.name || toNode.name || toNode.id
            textsToCopy.push(`Remove "${toName}" from "${fromName}"`)
            return (
              <ListItem key={index} graph={graph} change={change}>
                <IconButton
                  aria-label="Delete"
                  className={classes.delete}
                  onClick={() => onUpdateChanges(without(changes, change))}
                >
                  <Icon>delete</Icon>
                </IconButton>
                <ListItemText
                  primary={
                    <>
                      Remove "<b>{toName}</b>" from "<b>{fromName}</b>"
                    </>
                  }
                />
                <ListItemSecondaryAction />
              </ListItem>
            )
          })}
          {changes.length === 0 && (
            <EmptyBox icon={<Icon>block</Icon>}>
              No changes applied. Try breaking links between dependencies
            </EmptyBox>
          )}
        </List>
        <Toolbar>
          <Button onClick={() => onUpdateChanges([])}>Reset changes</Button>
          {textsToCopy.length > 0 ? (
            <CopyToClipboard text={textsToCopy.join('\n\n')}>
              <Button>Copy to clipboard</Button>
            </CopyToClipboard>
          ) : null}
        </Toolbar>
      </div>
    )
  }
}

export default withStyles(styles)(ChangesView)
