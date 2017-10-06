import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  tabSize,
  autoComplete,
  softTabs,
  theme,
  lineWrap,
  linter
} from '../actions/settings.js'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import ArrowBackIcon from 'material-ui-icons/ArrowBack'
import Button from 'material-ui/Button'
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Menu, { MenuItem } from 'material-ui/Menu'
import TextField from 'material-ui/TextField'

import SettingsGroup from './SettingsGroup'
import Switch from 'material-ui/Switch'

import logo from '../../../../images/logo-transparent.png'

const themes = {
  github: 'Github',
  tomorrow_night: 'Tomorrow Night'
}

const tabTypes = {
  true: 'Spaces',
  false: 'Tabs'
}

const menus = {
  THEME: 'THEME',
  TAB_CHAR: 'TAB_CHAR'
}

// This variable is injected by webpack
/* eslint-disable no-undef */
const VERSION = SNIPPETS_VERSION

class Settings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuAnchor: null,
      menu: null,
      selectedThemeIndex: 0
    }

    this.handleMenuClose = this.handleMenuClose.bind(this)
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this)
  }

  handleMenuClose() {
    this.setState({
      menu: null
    })
  }

  handleMenuItemClick(event, newValue) {
    switch (this.state.menu) {
      case menus.THEME:
        this.props.theme(newValue)
        break
      case menus.TAB_CHAR:
        this.props.softTabs(newValue)
        break
      default:
        throw new Error('Unknown menu')
    }
    this.setState({
      menu: null
    })
  }

  renderMenuContent() {
    switch (this.state.menu) {
      case menus.THEME:
        return Object.keys(themes).map((option, index) =>
          <MenuItem
            key={option}
            selected={option === this.props.settings.theme}
            onClick={event => this.handleMenuItemClick(event, option)}
          >
            {themes[option]}
          </MenuItem>
        )
      case menus.TAB_CHAR:
        return Object.keys(tabTypes).map((tabType, index) =>
          <MenuItem
            key={tabType}
            selected={tabType === this.props.settings.softTabs}
            onClick={event => this.handleMenuItemClick(event, tabType)}
          >
            {tabTypes[tabType]}
          </MenuItem>
        )
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
    )
  }

  render() {
    return (
      <div className="settings">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              onClick={this.props.handleCloseSettings}
            >
              <ArrowBackIcon />
            </IconButton>
            <h1 className="title">
              Snippets Settings
            </h1>
          </Toolbar>
        </AppBar>
        <main>
          <SettingsGroup
            label="About"
            className="about"
          >
            <img
              className="logo"
              src={logo}
            />
            <p className="version">
              {VERSION}
            </p>
            <p className="author">
              By Sidney Nemzer
            </p>
            <a
              href="https://github.com/SidneyNemzer/snippets"
              target="_blank"
            >
              <Button className="repo">
                Github Repo
              </Button>
            </a>
          </SettingsGroup>
          <SettingsGroup
            label="Sync"
          >
            <p className="sync-description">
              Your snippets are being synced to your Google account
              (if you&apos;re signed into Chrome)
            </p>
          </SettingsGroup>
          <SettingsGroup
            label="Editor"
          >
            <List>
              <ListItem>
                <ListItemText primary="Tab Size" />
                <ListItemSecondaryAction>
                  <TextField
                    className="tab-size-input"
                    type="number"
                    value={this.props.settings.tabSize}
                    onChange={event => this.props.tabSize(parseInt(event.target.value))}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={event => this.setState({menu: menus.TAB_CHAR, menuAnchor: event.currentTarget})}
              >
                <ListItemText
                  primary="Tab Character"
                  secondary={tabTypes[this.props.settings.softTabs]}
                />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={event => this.setState({menu: menus.THEME, menuAnchor: event.currentTarget})}
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
                    onChange={() => this.props.autoComplete(!this.props.settings.autoComplete)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Line Wrap" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.props.settings.lineWrap}
                    onChange={() => this.props.lineWrap(!this.props.settings.lineWrap)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Linter" />
                <ListItemSecondaryAction>
                  <Switch
                    checked={this.props.settings.linter}
                    onChange={() => this.props.linter(!this.props.settings.linter)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
            {this.renderMenu()}
          </SettingsGroup>
        </main>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  settings: state.settings,
  saved: state.saved
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    tabSize,
    autoComplete,
    softTabs,
    theme,
    lineWrap,
    linter
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
