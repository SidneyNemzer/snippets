import React from "react";
import { connect } from "react-redux";
import { MemoryRouter, Route, Redirect } from "react-router-dom";
import { AnimatedSwitch } from "react-router-transition";

import { loadSnippets } from "../actions/snippets";
import { pages } from "../constants";
import { RootState } from "../reducers";
import { SettingsState } from "../reducers/settings";
import { Snippet, SnippetsState } from "../reducers/snippets";
import Login from "./Login";
import Main from "./Main";
import SelectGist from "./SelectGist";
import Settings from "./Settings";
import Welcome from "./Welcome";

import "typeface-roboto";
import "../main.css";
import "../settings.css";

const previousSnippetName = (
  name: string,
  snippets: { [name: string]: Snippet }
) => {
  const sorted = Array.from(
    new Set(Object.keys(snippets).concat([name]))
  ).sort();
  const index = sorted.indexOf(name);

  // Assumes there will be at least one remaining snippet
  if (index > 0) {
    return sorted[index - 1];
  }

  // sorted[0] === name, select the next snippet
  return sorted[1];
};

const checkSelectedSnippet = (
  selectedSnippetName: string | null,
  nextSnippets: { [name: string]: Snippet } | null,
  currentSnippets: { [name: string]: Snippet } | null
) => {
  // Select the first snippet on the first load
  if (
    !selectedSnippetName &&
    !currentSnippets &&
    nextSnippets &&
    Object.values(nextSnippets).length
  ) {
    return { selectedSnippetName: Object.keys(nextSnippets)[0] };
  }

  if (!selectedSnippetName) {
    return null;
  }

  // If there are no snippets, remove the selection
  if (
    !nextSnippets ||
    !Object.values(nextSnippets).length ||
    !Object.values(nextSnippets).find((s) => !s.deleted)
  ) {
    return { selectedSnippetName: null };
  }

  // If the selected snippet was deleted or missing for some other reason,
  // select the previous snippet
  if (
    (nextSnippets[selectedSnippetName] &&
      nextSnippets[selectedSnippetName].deleted) ||
    !nextSnippets[selectedSnippetName]
  ) {
    return {
      selectedSnippetName: previousSnippetName(
        selectedSnippetName,
        nextSnippets
      ),
    };
  }

  if (!currentSnippets || !nextSnippets) {
    return null;
  }

  // If the selected snippet was renamed, select the new name
  // TODO this assumes a save just occurred, updating redux with the new
  // name. It's possible another snippet already existed with the new
  // name, but we can't tell the difference at this point. Should use
  // IDs for snippets instead of their name in the future.
  const newName = currentSnippets[selectedSnippetName].renamed;
  if (newName && nextSnippets[newName]) {
    return {
      selectedSnippetName: newName,
    };
  }

  return null;
};

type Props = {
  editorId: string;
  snippets: SnippetsState;
  settings: SettingsState;
  loadSnippets: () => void;
  runInInspectedWindow: (code: string) => void;
};

type State = {
  selectedSnippetName: string | null;
  snippets: SnippetsState;
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedSnippetName: null,
      // Store snippets in state to access from getDerivedStateFromProps
      snippets: props.snippets,
    };

    this.setSelectedSnippet = this.setSelectedSnippet.bind(this);
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.snippets === props.snippets) {
      return null;
    }

    return {
      ...checkSelectedSnippet(
        state.selectedSnippetName,
        props.snippets && props.snippets.data,
        state.snippets && state.snippets.data
      ),
      snippets: props.snippets,
    };
  }

  setSelectedSnippet(name: string) {
    this.setState({ selectedSnippetName: name });
  }

  componentDidMount() {
    const {
      settings: { accessToken, gistId },
      snippets: { data },
    } = this.props;
    if (!data && accessToken && gistId) {
      this.props.loadSnippets();
    }
  }

  // Choose a page based whether or not a Gist ID and token have
  // been entered
  choosePage() {
    const { accessToken, gistId } = this.props.settings;
    if (!accessToken && !gistId) {
      return pages.WELCOME;
    } else if (!accessToken) {
      return pages.LOGIN;
    } else if (!gistId) {
      return pages.SELECT_GIST;
    } else {
      return pages.MAIN;
    }
  }

  render() {
    return (
      <MemoryRouter>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className="switch-wrapper"
        >
          <Route path={pages.WELCOME} component={Welcome} />
          <Route path={pages.LOGIN} component={Login} />
          <Route path={pages.SELECT_GIST} component={SelectGist} />
          <Route
            path={pages.MAIN}
            render={(props) => (
              <Main
                runInInspectedWindow={this.props.runInInspectedWindow}
                editorId={this.props.editorId}
                selectedSnippetName={this.state.selectedSnippetName}
                setSelectedSnippet={this.setSelectedSnippet}
                {...props}
              />
            )}
          />
          <Route path={pages.SETTINGS} component={Settings} />
          <Redirect from="/" to={this.choosePage()} exact />
        </AnimatedSwitch>
      </MemoryRouter>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  settings: state.settings,
  snippets: state.snippets,
});

export default connect(mapStateToProps, { loadSnippets })(App);
