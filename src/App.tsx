import type { NodeID, Graph } from "./analysis/graph";
import type { Change } from "./analysis/changes";

import * as React from "react";
import { hot } from "react-hot-loader";
import { isEqual, pick } from "lodash";

import { readWebpackStats } from "./analysis/webpack";
import { getNode, cloneGraph, abortGraph, resolveNode } from "./analysis/graph";
import { applyChanges, addChange } from "./analysis/changes";
import AppUI from "./AppUI";
import { decodeUrlStateHash, encodeUrlStateHash } from "./history";

export type AppState = {
  loading: boolean;
  baseGraph: Graph | undefined | null;
  graph: Graph | undefined | null;
  error: any;
  fromNodeId: NodeID | undefined | null;
  toNodeId: NodeID | undefined | null;
  changes: ReadonlyArray<Change>;
  showChanges: boolean;
  pinned: ReadonlyArray<NodeID>;
  page: string;
};

class App extends React.Component<{}, AppState> {
  state = {
    loading: false,
    error: null,
    baseGraph: null,
    graph: null,
    fromNodeId: null,
    toNodeId: null,
    changes: [],
    showChanges: false,
    pinned: [],
    page: 'chains'
  };

  async componentDidMount() {
    this.initLocalStorage();
    this.initHistory();
    if (process.env.REACT_APP_STATS) {
      this.openFile(async () => {
        console.time("loading");
        const result = await fetch(process.env.PUBLIC_URL + `/stats/${process.env.REACT_APP_STATS || ""}`);
        console.timeEnd("loading");
        console.time("parsing");
        const json = await result.json();
        console.timeEnd("parsing");
        return json;
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const hasNewBaseGraph = prevState.baseGraph !== this.state.baseGraph;
    const hasNewChanges = !isEqual(prevState.changes, this.state.changes);
    if (hasNewBaseGraph || hasNewChanges) {
      this.applyChanges();
    }
  }

  initLocalStorage() {
    try {
      const pinned = JSON.parse(window.localStorage.getItem("pinned") || "[]");
      const changes = JSON.parse(
        window.localStorage.getItem("changes") || "[]"
      );
      this.setState({ pinned, changes });
      window.addEventListener("storage", this.handleStorageEvent);
    } catch (error) {
      console.error("Local storage failed to initialize", error);
    }
  }

  handleStorageEvent = (event: StorageEvent) => {
    if (event.key === "pinned" && event.newValue) {
      const pinned = JSON.parse(event.newValue);
      if (pinned !== this.state.pinned) {
        this.setState({ pinned });
      }
    }
  };

  initHistory() {
    try {
      window.addEventListener("popstate", this.handleHistoryChange);
      this.handleHistoryChange();
    } catch (error) {
      console.error("History failed to initialize", error);
    }
  }

  handleHistoryChange = () => {
    const hash = (window.location.hash || "#").slice(1);
    if (!hash) return;
    const hashState = decodeUrlStateHash(hash);
    this.setState(
      pick(hashState, ["fromNodeId", "toNodeId", "changes", "pinned"])
    );
  };

  pushHistory = () => {
    const { fromNodeId, toNodeId } = this.state;
    const encodedState = encodeUrlStateHash({ fromNodeId, toNodeId });
    window.history.pushState(null, null, `#${encodedState}`);
  };

  openFile = async (callback) => {
    this.setState({
      loading: true,
      error: null,
      baseGraph: null,
      graph: null,
    });
    try {
      const json = await callback();
      if (json === null) {
        this.setState({ loading: false });
        return;
      }
      console.time("conversion");
      const graph = await readWebpackStats(json);
      console.timeEnd("conversion");
      console.log("Graph: ", graph);
      console.warn("Errors found: ", graph.errors);
      this.setState({ loading: false, graph, baseGraph: graph });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false, error });
    }
  };

  handleDrop = ([file], [rejected]) => {
    if (rejected) {
      this.setState({
        error: "Only webpack build stats in json format are accepted!",
      });
      return;
    }
    this.openFile(
      () =>
        new Promise((resolve, reject) => {
          console.time("loading");
          const reader = new FileReader();
          reader.onload = () => {
            console.timeEnd("loading");
            console.time("parsing");
            const json = JSON.parse(reader.result as any);
            console.timeEnd("parsing");
            resolve(json);
          };
          reader.onerror = () => {
            console.timeEnd("loading");

            reject("Could not read the file");
          };
          reader.readAsBinaryString(file);
        })
    );
  };

  toggleShowChanges = () => {
    this.setState({ showChanges: !this.state.showChanges });
  };

  applyChanges = () => {
    const { baseGraph, graph, changes } = this.state;
    if (!graph || !baseGraph) return;
    const newGraph = cloneGraph(baseGraph);
    // discard old graph
    if (graph !== baseGraph) {
      abortGraph(graph);
    }
    applyChanges(newGraph, changes);
    this.setState({ graph: newGraph });
  };

  updateChanges = (changes) => {
    this.setState({ changes });
    window.localStorage.setItem("changes", JSON.stringify(changes));
  };

  addChange = (change: Change) => {
    const { graph, changes } = this.state;
    if (!graph) throw new Error("No graph available now");
    this.updateChanges(addChange(graph, changes, change));
  };

  setNodesSelection = (
    fromNodeId?: NodeID | null,
    toNodeId?: NodeID | null
  ) => {
    this.setState({ fromNodeId, toNodeId }, this.pushHistory);
  };

  resetNodesSelection = () => {
    this.setNodesSelection(null, null);
  };

  selectFromNode = (fromNodeId: NodeID) => {
    const { graph, toNodeId } = this.state;
    if (graph) console.log("Selected FROM node", getNode(graph, fromNodeId));
    this.setNodesSelection(fromNodeId, toNodeId || fromNodeId);
  };

  selectToNode = (toNodeId: NodeID) => {
    const { graph, fromNodeId } = this.state;
    if (graph) console.log("Selected TO node", getNode(graph, toNodeId));
    this.setNodesSelection(fromNodeId || toNodeId, toNodeId);
  };

  togglePinned = (id: NodeID) => {
    let { pinned } = this.state;
    const wasPinned = pinned.indexOf(id) >= 0;
    pinned = pinned.filter((pin) => pin !== id);
    if (!wasPinned) {
      pinned = [id, ...pinned];
    }
    this.setState({ pinned });
    window.localStorage.setItem("pinned", JSON.stringify(pinned));
  };

  navigate = (page: string) => {
    this.setState({page})
  }

  render() {
    const {
      graph,
      baseGraph,
      loading,
      error,
      fromNodeId,
      toNodeId,
      changes,
      showChanges,
      pinned,
      page,
    } = this.state;
    return (
      // @ts-expect-error TODO: WTF?
      <AppUI
        baseGraph={baseGraph}
        graph={graph}
        loading={loading}
        error={error}
        fromNode={graph && resolveNode(graph, fromNodeId)}
        toNode={graph && resolveNode(graph, toNodeId)}
        changes={changes}
        showChanges={showChanges}
        pinned={pinned}
        page={page}
        onAddChange={this.addChange}
        onFromNodeSelect={this.selectFromNode}
        onToNodeSelect={this.selectToNode}
        onNodesSelectionReset={this.resetNodesSelection}
        onChangesUpdate={this.updateChanges}
        onFileDrop={this.handleDrop}
        onShowChangesToggle={this.toggleShowChanges}
        onPinnedToggle={this.togglePinned}
        onNavigate={this.navigate}
      />
    );
  }
}

export default hot(module)(App);
