import React from "react";
import { connect } from "react-redux";
import { MemoryRouter, Route, Redirect, Switch } from "react-router-dom";

import { pages } from "../constants";
import { loadSnippets } from "../actions/snippets";
import Main from "./Main";
import Settings from "./Settings";
import Login from "./Login";
import SelectGist from "./SelectGist";
import Welcome from "./Welcome";

import "typeface-roboto";
import "../main.css";
import "../settings.css";

const previousSnippetName = (snippet, snippets) => {
  const sorted = Object.keys(snippets)
    .concat([snippet])
    .sort();
  return sorted[sorted.indexOf(snippet) - 1];
};

const checkSelectedSnippet = (
  selectedSnippetName,
  nextSnippets,
  currentSnippets
) => {
  // Select the first snippet on the first load
  if (!selectedSnippetName && !currentSnippets && nextSnippets) {
    return { selectedSnippetName: Object.keys(nextSnippets)[0] };
  }

  if (!selectedSnippetName) {
    return null;
  }

  // If there are no snippets, remove the selection
  if (!nextSnippets) {
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
      )
    };
  }

  // If the selected snippet was renamed, select the new name
  // TODO this assumes a save just occurred, updating redux with the new
  // name. It's possible another snippet already existed with the new
  // name, but we can't tell the difference at this point. Should use
  // IDs for snippets instead of their name in the future.
  if (
    currentSnippets[selectedSnippetName].renamed &&
    nextSnippets[currentSnippets[selectedSnippetName].renamed]
  ) {
    return {
      selectedSnippetName: currentSnippets[selectedSnippetName].renamed
    };
  }

  return null;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSnippetName: null,
      // Store snippets in state to access from getDerivedStateFromProps
      snippets: props.snippets
    };

    this.setSelectedSnippet = this.setSelectedSnippet.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.snippets === props.snippets) {
      return null;
    }

    return {
      ...checkSelectedSnippet(
        state.selectedSnippetName,
        props.snippets && props.snippets.data,
        state.snippets && state.snippets.data
      ),
      snippets: props.snippets
    };
  }

  setSelectedSnippet(name) {
    this.setState({ selectedSnippetName: name });
  }

  componentDidMount() {
    const {
      settings: { accessToken, gistId },
      snippets: { data }
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
        <Switch>
          <Route path={pages.WELCOME} component={Welcome} />
          <Route path={pages.LOGIN} component={Login} />
          <Route path={pages.SELECT_GIST} component={SelectGist} />
          <Route
            path={pages.MAIN}
            render={props => (
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
        </Switch>
      </MemoryRouter>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings,
  snippets: state.snippets
});

const mapDispatchToProps = { loadSnippets };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
