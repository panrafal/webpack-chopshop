import type { GraphEdge } from "../../analysis/graph"

import * as React from "react"
import classNames from "classnames"
import { withStyles, Icon, IconButton, Tooltip } from "@material-ui/core"

type Props = {
  edge: GraphEdge
  onClick: React.MouseEventHandler<HTMLButtonElement>
  classes: any
  className?: string
}

const styles = (theme) => ({
  root: {},
})

class EdgeLinkButton extends React.Component<Props> {
  render() {
    const { classes, className, edge, onClick } = this.props

    return (
      <Tooltip
        title={`${edge.enabled ? "Unlink" : "Link"} this node with above one`}
        disableFocusListener
        placement="top"
        enterDelay={500}
      >
        <IconButton
          className={classNames(className, classes.root)}
          aria-label="Unlink"
          color={edge.enabled ? "secondary" : "default"}
          onClick={onClick}
        >
          <Icon>{edge.enabled ? "link_off" : "link"}</Icon>
        </IconButton>
      </Tooltip>
    )
  }
}

export default withStyles(styles)(EdgeLinkButton)
