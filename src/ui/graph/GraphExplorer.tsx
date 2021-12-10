import type { Graph, Node, NodeID } from "../../analysis/graph";
import type { Props as NodeListProps } from "./NodeList";
import type { Props as NodeItemProps } from "./NodeItem";

import * as React from "react";
import classNames from "classnames";
import { map } from "lodash";
import { createSelector } from "reselect";
import Async from "react-promise";
import {
  withStyles,
  Icon,
  Typography,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";

import EmptyBox from "../EmptyBox";
import NodeItem from "./NodeItem";
import NodeList from "./NodeList";

export type Mode = {
  getNodes: () => ReadonlyArray<Node> | Promise<ReadonlyArray<Node>>;
  renderTitle: () => React.ReactNode;
  renderInfo: () => React.ReactNode;
  renderEmpty: () => string;
  listProps?: () => Partial<NodeListProps>;
  itemProps?: (a: any) => Partial<NodeItemProps>;
};

export type Modes = {
  [x: string]: Mode;
}

export type Props = {
  baseGraph: Graph;
  graph: Graph;
  pinned: ReadonlyArray<NodeID>;
  selected: Node | undefined | null;
  retainerRootNode?: Node | null;
  modes: Modes;
  defaultMode: string;
  onNodeSelect: (a: NodeID) => void;
  classes: any;
  className?: string;
};

type State = {
  modeId: string | undefined | null;
  modeMenuAnchor: any;
};

const styles = (theme) => ({
  root: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "stretch",
  },
  list: {
    flexGrow: 1,
  },
  listProgress: {
    marginTop: 16,
  },
  modeMenuItem: {
    width: 300,
  },
});

class GraphExplorer extends React.Component<Props, State> {
  state = { modeId: null, modeMenuAnchor: null };

  modeSelector = (s, p) => p.modes[s.modeId || ""] || p.modes[p.defaultMode];
  nodesSelector = (s, p) => this.modeSelector(s, p).getNodes();

  nodesPromiseSelector = createSelector(
    this.nodesSelector,
    // Needed so we don't recreate the promise on every render
    (nodes) => Promise.resolve(nodes)
  );

  static getDerivedStateFromProps({ modes = {} }, state: State) {
    if (!modes[state.modeId]) {
      // If selected mode is not available anymore, switch to default
      return { modeId: null };
    }
    return null;
  }

  handleModeMenuOpen = (event) => {
    this.setState({ modeMenuAnchor: event.currentTarget });
  };
  handleModeMenuClose = () => {
    this.setState({ modeMenuAnchor: null });
  };

  renderList(nodes) {
    const {
      classes,
      baseGraph,
      graph,
      retainerRootNode,
      selected,
      pinned,
      onNodeSelect,
    } = this.props;
    const mode = this.modeSelector(this.state, this.props);
    const listProps = mode.listProps ? mode.listProps() : {};
    return (
      <NodeList
        className={classes.list}
        nodes={nodes || []}
        loading={nodes == null}
        baseGraph={baseGraph}
        graph={graph}
        pinned={pinned}
        selected={selected}
        groupNodesBy="package"
        orderNodesBy={undefined}
        orderGroupsBy={[["size"], ["desc"]]}
        renderItem={(itemProps) => (
          <NodeItem
            {...itemProps}
            retainerRootNode={retainerRootNode}
            onClick={() => onNodeSelect(itemProps.node.id)}
            checked={selected ? selected.id === itemProps.node.id : false}
            {...(mode.itemProps && mode.itemProps(itemProps))}
          >
            {pinned.indexOf(itemProps.node.id) >= 0 ? (
              <ListItemSecondaryAction>
                <Icon color="disabled" fontSize="inherit">
                  star
                </Icon>
              </ListItemSecondaryAction>
            ) : null}
          </NodeItem>
        )}
        renderEmpty={() => (
          <EmptyBox icon={<Icon>block</Icon>}>{mode.renderEmpty()}</EmptyBox>
        )}
        {...listProps}
      />
    );
  }

  renderModeMenu() {
    const { classes, modes, defaultMode } = this.props;
    const { modeMenuAnchor, modeId } = this.state;
    const currentModeId = modeId || defaultMode;
    return (
      <Menu
        id="lock-menu"
        anchorEl={modeMenuAnchor}
        open={Boolean(modeMenuAnchor)}
        onClose={this.handleModeMenuClose}
      >
        {map(modes, (mode: Mode, id) => (
          <MenuItem
            className={classes.modeMenuItem}
            key={id}
            selected={id === currentModeId}
            onClick={() => this.setState({ modeId: id, modeMenuAnchor: null })}
          >
            {mode.renderTitle()}
          </MenuItem>
        ))}
      </Menu>
    );
  }

  render() {
    const { className, classes } = this.props;

    const mode = this.modeSelector(this.state, this.props);
    const nodesPromise = this.nodesPromiseSelector(this.state, this.props);

    return (
      <div className={classNames(className, classes.root)}>
        <ListItem
          button
          disableGutters
          className={classes.header}
          onClick={this.handleModeMenuOpen}
        >
          <ListItemText>
            <Typography variant="headline">{mode.renderTitle()}</Typography>
            <Typography variant="subheading" gutterBottom>
              {mode.renderInfo()}
            </Typography>
          </ListItemText>
          <Icon color="action" className={classes.headerMore}>
            more_vert
          </Icon>
        </ListItem>
        {this.renderModeMenu()}
        <Async
          promise={nodesPromise}
          then={(nodes) => this.renderList(nodes)}
          pending={() => this.renderList(null)}
        />
      </div>
    );
  }
}

// @ts-expect-error mui
export default withStyles(styles)(GraphExplorer);
