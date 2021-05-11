import React from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps } from "react-router-dom";

import logo from "../../../images/logo-transparent.png";
import { actions as settingsActions } from "../actions/settings";
import {
  createSnippet,
  renameSnippet,
  updateSnippet,
  deleteSnippet,
  saveSnippets,
  loadSnippets,
} from "../actions/snippets";
import { pages, SNIPPETS_ISSUES_URL } from "../constants";
import { RootState } from "../reducers";
import { SettingsState } from "../reducers/settings";
import { Snippet, SnippetsState } from "../reducers/snippets";
import Editor from "./Editor";
import ErrorPage from "./ErrorPage";
import Loading from "./Loading";
import Sidepane from "./Sidepane";

enum SaveStatus {
  Saving = "SAVING",
  Saved = "SAVED",
  Unsaved = "UNSAVED",
}

type Props = {
  editorId: string;
  snippets: {
    loading: boolean;
    error: Error | null;
    data: { [name: string]: Snippet } | null;
  };
  selectedSnippetName: string | null;
  saveStatus: SaveStatus;
  settings: SettingsState;
  runInInspectedWindow: (code: string) => void;
  saveSnippets: () => void;
  loadSnippets: () => void;
  setSelectedSnippet: (name: string) => void;
  updateSnippet: (name: string, value: string, editorId: string) => void;
  renameSnippet: (oldName: string, newName: string) => void;
  createSnippet: (name: string) => void;
  deleteSnippet: (name: string) => void;
  accessToken: (token: string | false) => void;
  gistId: (gistId: string | false) => void;
};

class Main extends React.Component<Props & RouteComponentProps> {
  constructor(props: Props) {
    super(props as any);

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.runSnippet = this.runSnippet.bind(this);
  }

  runSnippet(snippetBody: string) {
    const code = `
      try {
        ${snippetBody}
      } catch (e) {
        console.error(e)
      }
    `;

    this.props.runInInspectedWindow(code);
  }

  handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      const { selectedSnippetName } = this.props;
      const { snippets } = this.props;
      const snippet =
        selectedSnippetName &&
        snippets.data &&
        snippets.data[selectedSnippetName];
      if (snippet) {
        this.runSnippet(snippet.content.local);
      }
    }
  }

  handleEditorChange(newValue: string) {
    if (!this.props.selectedSnippetName) {
      return;
    }

    this.props.updateSnippet(
      this.props.selectedSnippetName,
      newValue,
      this.props.editorId
    );
  }

  renderEditor(snippets: { [name: string]: Snippet }) {
    const { selectedSnippetName: snippetId } = this.props;

    if (snippetId !== null) {
      const snippet = snippets[snippetId];
      return (
        <Editor
          key={snippetId}
          value={snippet.content.local}
          onChange={this.handleEditorChange}
          editorId={this.props.editorId}
          lastUpdatedBy={snippet.lastUpdatedBy}
        />
      );
    } else {
      return (
        <div className="none-selected">
          <img src={logo} />
          <p>Nothing Selected</p>
        </div>
      );
    }
  }

  renderSaveMessage() {
    const {
      snippets: { error },
    } = this.props;
    if (error) {
      return (
        <span style={{ cursor: "pointer" }} onClick={this.props.saveSnippets}>
          {(error as any).context
            ? "Failed to " + (error as any).context
            : "Error"}
          : {error.message} -- click to retry
        </span>
      );
    }
    switch (this.props.saveStatus) {
      case SaveStatus.Saved:
        return <span>Saved</span>;
      case SaveStatus.Saving:
        return <span>Saving...</span>;
      case SaveStatus.Unsaved:
        return (
          <span style={{ cursor: "pointer" }} onClick={this.props.saveSnippets}>
            You have unsaved changes
          </span>
        );
      default:
        throw new Error("Unexpected save status:" + this.props.saveStatus);
    }
  }

  renderMain(snippets: { [name: string]: Snippet }) {
    return (
      <div className="home" onKeyDown={this.handleKeyPress}>
        <Sidepane
          snippets={snippets}
          selectedSnippet={this.props.selectedSnippetName}
          selectSnippet={this.props.setSelectedSnippet}
          renameSnippet={this.props.renameSnippet}
          createSnippet={this.props.createSnippet}
          deleteSnippet={this.props.deleteSnippet}
          runSnippet={this.runSnippet}
          handleOpenSettings={() => this.props.history.push(pages.SETTINGS)}
        />
        <div className="editor-container">
          <header>{this.renderSaveMessage()}</header>
          {this.renderEditor(snippets)}
        </div>
      </div>
    );
  }

  renderError(error: Error) {
    switch ((error as any).status) {
      case 401: // Unauthorized
        return (
          <ErrorPage
            context={(error as any).context}
            message="Github didn't accept the access token"
            actionButton="Reset access token"
            onActionButtonClick={() => {
              this.props.accessToken(false);
              this.props.history.push(pages.LOGIN);
            }}
          />
        );

      case 404: // Not found
        return (
          <ErrorPage
            context={(error as any).context}
            message={`The gist ID '${this.props.settings.gistId}' doesn't seem to exist`}
            actionButton="Reset Gist ID"
            onActionButtonClick={() => {
              this.props.gistId(false);
              this.props.history.push(pages.SELECT_GIST);
            }}
          />
        );

      default:
        return (
          <ErrorPage
            context={(error as any).context}
            error={error}
            message="Maybe you can fix this by changing a setting? Open an issue if this happens again."
            actionButton="Open Settings"
            onActionButtonClick={() => this.props.history.push(pages.SETTINGS)}
            link={SNIPPETS_ISSUES_URL}
          />
        );
    }
  }

  render() {
    const { snippets: snippetsState } = this.props;
    if (snippetsState.loading) {
      return <Loading />;
    } else if (snippetsState.error && !snippetsState.data) {
      return this.renderError(snippetsState.error);
    } else if (!snippetsState.data) {
      if (!this.props.settings.accessToken) {
        return <Redirect to={pages.LOGIN} />;
      }
      if (!this.props.settings.gistId) {
        return <Redirect to={pages.SELECT_GIST} />;
      }
      return (
        <ErrorPage
          title="No snippets are loaded"
          message="Maybe you changed your Gist ID or access token? In that case, you'll need to reload the Gist"
          actionButton="Reload"
          onActionButtonClick={this.props.loadSnippets}
        />
      );
    } else {
      return this.renderMain(snippetsState.data);
    }
  }
}

const isSnippetUnsaved = (snippet: Snippet) => {
  return (
    snippet.content.local !== snippet.content.remote ||
    snippet.deleted ||
    snippet.renamed
  );
};

const getSaveStatus = (state: SnippetsState) => {
  if (state.saving) {
    return SaveStatus.Saving;
  }

  if (!state.data) {
    return SaveStatus.Saved;
  }

  const unsaved = Object.entries(state.data).find(([name, snippet]) =>
    isSnippetUnsaved(snippet)
  );
  if (unsaved) {
    return SaveStatus.Unsaved;
  }

  return SaveStatus.Saved;
};

const mapStateToProps = (state: RootState) => ({
  settings: state.settings,
  snippets: {
    loading: state.snippets.loading,
    error: state.snippets.error,
    data: state.snippets.data
      ? Object.entries(state.snippets.data).reduce(
          (snippets, [name, snippet]) => {
            if (!snippet.deleted) {
              snippets[name] = snippet;
            }
            return snippets;
          },
          {} as { [name: string]: Snippet }
        )
      : state.snippets.data,
  },
  saveStatus: getSaveStatus(state.snippets),
});

const mapDispatchToProps = {
  createSnippet,
  renameSnippet,
  updateSnippet,
  deleteSnippet,
  saveSnippets,
  loadSnippets,
  accessToken: settingsActions.accessToken,
  gistId: settingsActions.gistId,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
