import { FormControlLabel, RadioGroup } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import { Octokit } from "@octokit/rest";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import { actions as settingsActions } from "../actions/settings";
import { loadSnippets } from "../actions/snippets";
import {
  OCTOKIT_USER_AGENT,
  pages,
  WELCOME_SNIPPET_CONTENT,
} from "../constants";
import { RootState } from "../reducers";

const usersGists = "https://gist.github.com/";

type Props = {
  accessToken: string | false;
  settingsGistId: string | false;
  loadSnippets: () => void;
  gistId: (gistId: string) => void;
};

type State = {
  gistType: "new" | "custom";
  gistIdInput: string;
  creatingGist: boolean;
  createGistError: Error | undefined;
};

class SelectGist extends React.Component<Props & RouteComponentProps, State> {
  state = {
    gistType: "new",
    gistIdInput: "",
    creatingGist: false,
    createGistError: undefined,
  } as State;

  handleGistInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      gistIdInput: event.target.value,
    });
  };

  handleGistType = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      gistType: event.target.value as State["gistType"],
    });
  };

  handleCreateGist = () => {
    this.setState({ creatingGist: true, createGistError: undefined });

    const octokit = new Octokit({
      userAgent: OCTOKIT_USER_AGENT,
      auth: this.props.accessToken,
    });

    octokit.gists
      .create({
        description: "Snippets",
        files: { Welcome: { content: WELCOME_SNIPPET_CONTENT } },
        public: false,
      })
      .then(({ data: gist }) => {
        if (!gist.id) {
          throw new Error("Invalid response from GitHub");
        }
        this.props.gistId(gist.id);
      })
      .catch((error) => {
        this.setState({ createGistError: error });
      })
      .finally(() => {
        this.setState({ creatingGist: false });
      });
  };

  UNSAFE_componentWillReceiveProps({ settingsGistId: nextGistId }: Props) {
    const { accessToken, settingsGistId } = this.props;
    if (nextGistId && nextGistId !== settingsGistId) {
      if (accessToken) {
        this.props.loadSnippets();
        this.props.history.push(pages.MAIN);
      } else {
        this.props.history.push(pages.LOGIN);
      }
    }
  }

  loadGist = () => {
    this.props.gistId(this.state.gistIdInput);
  };

  render() {
    return (
      <div style={{ maxWidth: 600, margin: "10vh auto", textAlign: "center" }}>
        <h1>Choose a Gist to store Snippets</h1>
        <p>
          <a href={usersGists} target="_blank" rel="noopener noreferrer">
            Click here to open GitHub Gists
          </a>
        </p>
        <RadioGroup
          value={this.state.gistType}
          onChange={this.handleGistType as any}
        >
          <FormControlLabel
            value="new"
            control={<Radio color="primary" />}
            label="Create new secret Gist"
          />
          <FormControlLabel
            value="custom"
            control={<Radio color="primary" />}
            label="Use an existing Gist"
          />
        </RadioGroup>
        {this.state.gistType === "new" && (
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleCreateGist}
            disabled={this.state.creatingGist}
          >
            Continue
            {this.state.creatingGist && (
              <CircularProgress style={{ marginLeft: 10 }} size={20} />
            )}
          </Button>
        )}
        {this.state.gistType === "custom" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextField
              label="Enter Gist ID"
              placeholder="example: 1c5f2cf34939336ecb79b97bb89d9da6"
              value={this.state.gistIdInput}
              onChange={this.handleGistInput}
              style={{ marginRight: "15px", width: "290px" }}
            />
            <Button color="primary" onClick={this.loadGist}>
              Continue
            </Button>
          </div>
        )}
        {this.state.createGistError && (
          <pre>{this.state.createGistError.message}</pre>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  accessToken: state.settings.accessToken,
  settingsGistId: state.settings.gistId,
});

const mapDispatchToProps = {
  gistId: settingsActions.gistId,
  loadSnippets,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectGist);
