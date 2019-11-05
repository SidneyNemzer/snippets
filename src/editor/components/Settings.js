import React from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import RefreshIcon from "@material-ui/icons/Refresh";
import PublishIcon from "@material-ui/icons/Publish";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";

import { pages } from "../constants";
import { actions } from "../actions/settings.js";
import SettingsGroup from "./SettingsGroup";
import { loadSnippets, loadLegacySnippets } from "../actions/snippets.js";

import logo from "../../../images/logo-transparent.png";

// TODO Move these to ../constants
const themes = {
  github: "Github",
  tomorrow_night: "Tomorrow Night"
};

const tabTypes = {
  true: "Spaces",
  false: "Tabs"
};

const menus = {
  THEME: "THEME",
  TAB_CHAR: "TAB_CHAR"
};

// This variable is injected by webpack
// eslint-disable-next-line no-undef
const VERSION = SNIPPETS_VERSION;

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuAnchor: null,
      menu: null,
      selectedThemeIndex: 0
    };

    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  handleMenuClose() {
    this.setState({
      menu: null
    });
  }

  handleMenuItemClick(event, newValue) {
    switch (this.state.menu) {
      case menus.THEME:
        this.props.theme(newValue);
        break;
      case menus.TAB_CHAR:
        this.props.softTabs(newValue);
        break;
      default:
        throw new Error("Unknown menu");
    }
    this.setState({
      menu: null
    });
  }

  renderMenuContent() {
    switch (this.state.menu) {
      case menus.THEME:
        return Object.keys(themes).map((option, index) => (
          <MenuItem
            key={option}
            selected={option === this.props.settings.theme}
            onClick={event => this.handleMenuItemClick(event, option)}
          >
            {themes[option]}
          </MenuItem>
        ));
      case menus.TAB_CHAR:
        return Object.keys(tabTypes).map((tabType, index) => (
          <MenuItem
            key={tabType}
            selected={tabType === this.props.settings.softTabs}
            onClick={event => this.handleMenuItemClick(event, tabType)}
          >
            {tabTypes[tabType]}
          </MenuItem>
        ));
      default:
    }
  }

  renderMenu() {
    return (
      <Menu
        id="menu"
        anchorEl={this.state.menuAnchor}
        open={this.state.menu !== null}
        onRequestClose={this.handleMenuClose}
      >
        {this.renderMenuContent()}
      </Menu>
    );
  }

  render() {
    return (
      <div className="settings">
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={() => this.props.history.push(pages.MAIN)}>
              <ArrowBackIcon />
            </IconButton>
            <h1 className="title">Snippets Settings</h1>
          </Toolbar>
        </AppBar>
        <main>
          <SettingsGroup label="About" className="about">
            <img className="logo" src={logo} />
            <p className="version">{VERSION}</p>
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
                <ListItemText
                  primary="Github Access Token"
                  secondary="Token is hidden for security"
                />
                <ListItemSecondaryAction>
                  <Button
                    onClick={() => {
                      this.props.accessToken(false);
                      this.props.history.push(pages.LOGIN);
                    }}
                  >
                    Reset
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Github Gist ID" />
                <ListItemSecondaryAction>
                  <TextField
                    className="settings-input gist-id-input"
                    value={this.props.settings.gistId}
                    onChange={event => this.props.gistId(event.target.value)}
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
                    onChange={event => {
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
                    onChange={event => {
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
                    onChange={event => {
                      const inputInt = parseInt(event.target.value);
                      if (!Number.isNaN(inputInt)) {
                        this.props.fontSize(inputInt);
                      }
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={event =>
                  this.setState({
                    menu: menus.TAB_CHAR,
                    menuAnchor: event.currentTarget
                  })
                }
              >
                <ListItemText
                  primary="Tab Character"
                  secondary={tabTypes[this.props.settings.softTabs]}
                />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={event =>
                  this.setState({
                    menu: menus.THEME,
                    menuAnchor: event.currentTarget
                  })
                }
              >
                <ListItemText
                  primary="Theme"
                  secondary={themes[this.props.settings.theme]}
                />
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
            {this.renderMenu()}
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

const mapStateToProps = (state, props) => ({
  settings: state.settings
});

const mapDispatchToProps = {
  loadSnippets,
  loadLegacySnippets,
  ...actions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
