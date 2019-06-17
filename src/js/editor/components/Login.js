import React from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { pages, CREATE_ACCESS_TOKEN_URL } from "../constants";
import { actions as settingsActions } from "../actions/settings";
import { loadSnippets } from "../actions/snippets";

class Login extends React.Component {
  state = {
    accessTokenInput: ""
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  UNSAFE_componentWillReceiveProps({ settingsAccessToken: nextAccessToken }) {
    const { gistId, settingsAccessToken } = this.props;
    if (nextAccessToken && nextAccessToken !== settingsAccessToken) {
      if (gistId) {
        this.props.loadSnippets();
        this.props.history.push(pages.MAIN);
      } else {
        this.props.history.push(pages.SELECT_GIST);
      }
    }
  }

  render() {
    return (
      <div style={{ maxWidth: 600, margin: "10vh auto", textAlign: "center" }}>
        <h1>Authenticate with Github</h1>
        <p>
          In order to store snippets in a Github Gist, you'll need to provide a
          Github access token. It must have the "gist" scope.
        </p>
        <div style={{ marginBottom: "20px" }}>
          <a
            href={CREATE_ACCESS_TOKEN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here to make an access token
          </a>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <TextField
            label="Enter access token"
            value={this.state.accessTokenInput}
            onChange={this.handleChange("accessTokenInput")}
            style={{ marginRight: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.props.accessToken(this.state.accessTokenInput)}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  settings: { gistId, accessToken: settingsAccessToken }
}) => ({
  gistId,
  settingsAccessToken
});

const mapDispatchToProps = {
  accessToken: settingsActions.accessToken,
  loadSnippets
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
