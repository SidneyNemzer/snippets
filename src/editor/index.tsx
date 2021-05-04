import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Button,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Store } from "webext-redux";

import App from "./components/App";

type State = {
  caughtError: Error | null;
};

class ErrorBoundry extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = { caughtError: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { caughtError: error };
  }

  render() {
    if (this.state.caughtError) {
      return (
        <div
          style={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <ErrorIcon style={{ color: "#ececec", fontSize: 150 }} />
          <h1 style={{ margin: "0 0 20px" }}>An error occured</h1>
          <ExpansionPanel
            style={{
              maxWidth: 600,
              width: "100%",
              textAlign: "left",
              margin: "0 auto 20px",
            }}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              Error Details
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ overflow: "auto" }}>
              <pre>{this.state.caughtError.stack}</pre>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <div style={{ marginBottom: 20 }}>
            Please report it{" "}
            <a
              href="https://github.com/SidneyNemzer/snippets/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              on GitHub
            </a>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

const chromeReduxStore = () =>
  new Store({
    portName: "SNIPPETS",
  });

export default (
  runInInspectedWindow: (code: string) => void,
  editorId: string,
  store = chromeReduxStore()
) => {
  // Ignore the first event; the store will be empty
  const unsubscribe = store.subscribe(() => {
    unsubscribe();
    const root = document.querySelector(".root");
    ReactDOM.render(
      <ErrorBoundry>
        <Provider store={store}>
          <App
            runInInspectedWindow={runInInspectedWindow}
            editorId={editorId}
          />
        </Provider>
      </ErrorBoundry>,
      root
    );
  });
};
