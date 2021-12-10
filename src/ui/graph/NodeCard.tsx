// @flow

import type {Graph, Node, Edge} from '../../analysis/graph'

import * as React from 'react'
import classNames from 'classnames'
import {
  withStyles,
  Typography,
  IconButton,
  Icon,
  Card,
  CardContent,
  Collapse,
  CardActions,
} from '@material-ui/core'

import NodeSize from './NodeSize'
import NodeName from './NodeName'

type Props = {|
  baseGraph: Graph,
  graph: Graph,
  node: Node,
  retainerRootNode?: ?Node,
  edge?: ?Edge,
  actions?: React.Node,
  classes: Object,
  className?: string,
|}

const styles = theme => ({
  root: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    flexShrink: 0,
    flexGrow: 0,
    justifyContent: 'stretch',
  },
  card: {
    marginBottom: 24,
    position: 'relative',
  },
  edgeButton: {
    position: 'absolute',
    left: -32,
    top: 12,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
})

type State = {
  expanded: boolean,
}

class NodeCard extends React.PureComponent<Props, State> {
  state = {
    expanded: false,
  }
  render() {
    const {classes, className, baseGraph, graph, node, retainerRootNode, edge, actions} = this.props
    const {expanded} = this.state

    return (
      <div className={classNames(className, classes.root)}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" noWrap>
              <NodeName node={node} hidePackage tooltip />
            </Typography>
            <Typography variant="subheading">
              <NodeName node={node} onlyPackage />
            </Typography>
            <Typography color="textSecondary">
              <NodeSize
                baseGraph={baseGraph}
                graph={graph}
                node={node}
                retainerRootNode={retainerRootNode}
              />
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            {actions}
            <IconButton
              className={classNames(classes.expand, expanded && classes.expandOpen)}
              onClick={() => this.setState({expanded: !expanded})}
            >
              <Icon>expand_more</Icon>
            </IconButton>
          </CardActions>
          <Collapse in={expanded}>
            <CardContent>
              <Typography variant="caption" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body2" gutterBottom>
                {node.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Kind
              </Typography>
              <Typography variant="body2" gutterBottom>
                {String(node.kind)}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                ID
              </Typography>
              <Typography variant="body2" gutterBottom>
                {String(node.originalId)}
              </Typography>
              {edge && (
                <>
                  <Typography variant="caption" color="textSecondary">
                    Edge type
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {edge.kind}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Edge name
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {edge.name || ''}
                  </Typography>
                </>
              )}
            </CardContent>
          </Collapse>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(NodeCard)
