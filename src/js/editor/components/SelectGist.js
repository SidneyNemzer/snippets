import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { pages } from "../constants";
import { actions as settingsActions } from "../actions/settings";
import { loadSnippets } from "../actions/snippets";

const usersGists = "https://gist.github.com/";

class SelectGist extends React.Component {
  state = {
    gistIdInput: ""
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  UNSAFE_componentWillReceiveProps({ settingsGistId: nextGistId }) {
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
      <div style={{ maxWidth: 700, margin: "10vh auto", textAlign: "center" }}>
        <h1>Choose a Gist to store Snippets</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <TextField
            label="Enter Gist ID"
            placeholder="example: 1c5f2cf34939336ecb79b97bb89d9da6"
            value={this.state.gistIdInput}
            onChange={this.handleChange("gistIdInput")}
            style={{ marginRight: "15px", width: "290px" }}
          />
          <Button color="primary" onClick={this.loadGist}>
            Save
          </Button>
        </div>
        <p>
          <a href={usersGists} target="_blank" rel="noopener noreferrer">
            Click here to open GitHub Gists
          </a>
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accessToken: state.settings.accessToken,
  settingsGistId: state.settings.gistId
});

const mapDispatchToProps = {
  gistId: settingsActions.gistId,
  loadSnippets
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectGist);
