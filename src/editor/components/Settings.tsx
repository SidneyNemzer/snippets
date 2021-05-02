import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PublishIcon from "@material-ui/icons/Publish";
import RefreshIcon from "@material-ui/icons/Refresh";
import VisibilityIcon from "@material-ui/icons/Visibility";
import React from "react";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router-dom";

import logo from "../../../images/logo-transparent.png";
import { actions } from "../actions/settings";
import { loadSnippets, loadLegacySnippets } from "../actions/snippets";
import { pages } from "../constants";
import { RootState } from "../reducers";
import { SettingsState } from "../reducers/settings";
import SettingsGroup from "./SettingsGroup";

// TODO Move these to ../constants
const themes = {
  github: "Github",
  tomorrow_night: "Tomorrow Night",
};

const tabTypes = {
  true: "Spaces",
  false: "Tabs",
};

type Props = {
  settings: SettingsState;
  accessToken: (token: string) => void;
  loadSnippets: () => void;
  gistId: (id: string) => void;
  autosaveTimer: (timer: number) => void;
  fontSize: (fontSize: number) => void;
  softTabs: (softTabs: boolean) => void;
  theme: (theme: string) => void;
  autoComplete: (autoComplete: boolean) => void;
  lineWrap: (lineWrap: boolean) => void;
  linter: (linter: boolean) => void;
  loadLegacySnippets: () => void;
};

type State = {
  showAccessToken: boolean;
  initialAccessToken: string | false;
};

class Settings extends React.Component<Props & RouteComponentProps, State> {
  constructor(props: Props) {
    // @ts-expect-error TS is mad that props is not compatible with RouteComponentProps
    super(props);

    this.state = {
      showAccessToken: false,
      initialAccessToken: props.settings.accessToken,
    };
  }

  handleBackButton = () => {
    if (this.state.initialAccessToken !== this.props.settings.accessToken) {
      this.props.loadSnippets();
    }
    this.props.history.push(pages.MAIN);
  };

  handleToggleAccessToken = () => {
    this.setState({ showAccessToken: !this.state.showAccessToken });
  };

  render() {
    return (
      <div className="settings">
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={this.handleBackButton}>
              <ArrowBackIcon />
            </IconButton>
            <h1 className="title">Snippets Settings</h1>
          </Toolbar>
        </AppBar>
        <main>
          <SettingsGroup label="About" className="about">
            <img className="logo" src={logo} />
            <p className="version">{process.env.SNIPPETS_VERSION}</p>
            <p className="author">By Sidney Nemzer</p>
            <a
              href="https://github.com/SidneyNemzer/snippets"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="repo">Github Repo</Button>
            </a>
          </SettingsGroup>
          <SettingsGroup label="Sync">
            <List>
              <ListItem>
                <ListItemText primary="Github Access Token" />
                <ListItemSecondaryAction>
                  <IconButton
                    className="toggle-access-token-button"
                    onClick={this.handleToggleAccessToken}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <TextField
                    className={
                      this.state.showAccessToken
                        ? "settings-input access-token-input-large"
                        : "settings-input access-token-input-small"
                    }
                    value={this.props.settings.accessToken}
                    onChange={(event) =>
                      this.props.accessToken(event.target.value)
                    }
                    type={this.state.showAccessToken ? "text" : "password"}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Github Gist ID" />
                <ListItemSecondaryAction>
                  <TextField
                    className="settings-input gist-id-input"
                    value={this.props.settings.gistId}
                    onChange={(event) => this.props.gistId(event.target.value)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Reload Snippets"
                  secondary="Reload Snippets from Github"
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      this.props.history.push(pages.MAIN);
                      this.props.loadSnippets();
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Autosave Frequency (seconds)"
                  secondary="Saves automatically after you stop typing for this many seconds. Set to 0 to disable."
                />
                <ListItemSecondaryAction>
                  <TextField
                    className="settings-input small-number-input"
                    type="number"
                    value={this.props.settings.autosaveTimer}
                    onChange={(event) => {
                      const inputInt = parseInt(event.target.value);
                      if (!Number.isNaN(inputInt)) {
                        this.props.autosaveTimer(inputInt);
                      }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </SettingsGroup>
          <SettingsGroup label="Editor">
            <List>
              <ListItem>
                <ListItemText primary="Tab Size" />
                <ListItemSecondaryAction>
                  <TextField
                    className="settings-input small-number-input"
                    type="number"
                    value={this.props.settings.tabSize}
                    onChange={(event) => {
                      const inputInt = parseInt(event.target.value);
                      if (!Number.isNaN(inputInt)) {
                        this.props.autosaveTimer(inputInt);
                      }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Font Size" />
                <ListItemSecondaryAction>
                  <TextField
                    className="settings-input small-number-input"
                    type="number"
                    value={this.props.settings.fontSize}
                    onChange={(event) => {
                      const inputInt = parseInt(event.target.value);
                      if (!Number.isNaN(inputInt)) {
                        this.props.fontSize(inputInt);
                      }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Tab Character" />
                <ListItemSecondaryAction>
                  <Select
                    value={this.props.settings.softTabs}
                    onChange={(event) =>
                      this.props.softTabs(event.target.value === "true")
                    }
                    className="settings-input"
                  >
                    {Object.keys(tabTypes).map((tabType) => (
                      <MenuItem key={tabType} value={tabType}>
                        {(tabTypes as any)[tabType]}
                      </MenuItem>
                    ))}
                  </Select>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Theme" />
                <ListItemSecondaryAction>
                  <Select
                    value={this.props.settings.theme}
                    onChange={(event) => this.props.theme(event.target.value)}
                    className="settings-input"
                  >
                    {Object.keys(themes).map((theme) => (
                      <MenuItem key={theme} value={theme}>
                        {(themes as any)[theme]}
                      </MenuItem>
                    ))}
                  </Select>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Autocomplete" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.props.settings.autoComplete}
                    onChange={() =>
                      this.props.autoComplete(!this.props.settings.autoComplete)
                    }
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Line Wrap" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.props.settings.lineWrap}
                    onChange={() =>
                      this.props.lineWrap(!this.props.settings.lineWrap)
                    }
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Linter" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.props.settings.linter}
                    onChange={() =>
                      this.props.linter(!this.props.settings.linter)
                    }
                    color="primary"
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </SettingsGroup>
          <SettingsGroup label="Legacy">
            <List>
              <ListItem>
                <ListItemText
                  primary="Recover Legacy Snippets"
                  secondary="Check Chrome sync storage for snippets and move them to Gist storage"
                />
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      this.props.loadLegacySnippets();
                      this.props.history.push(pages.MAIN);
                    }}
                  >
                    <PublishIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </SettingsGroup>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  settings: state.settings,
});

const mapDispatchToProps = {
  loadSnippets,
  loadLegacySnippets,
  ...actions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
