import React from 'react'

import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import MoreVert from 'material-ui-icons/MoreVert'
import Edit from 'material-ui-icons/Edit'
import PlayArrow from 'material-ui-icons/PlayArrow'
import Check from 'material-ui-icons/Check'
import Delete from 'material-ui-icons/Delete'

class SnippetSelector extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isRenaming: false,
      startingRename: false,
      menuAnchor: null,
      menuOpen: false
    }

    this.startRename = this.startRename.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleMenuOpen = this.handleMenuOpen.bind(this)
    this.handleMenuClose = this.handleMenuClose.bind(this)
  }

  startRename() {
    this.setState({
      isRenaming: true,
      startingRename: true,
      currentInput: this.props.name
    })
  }

  handleChange(event) {
    this.setState({
      currentInput: event.target.value,
      startingRename: false
    })
  }

  handleBlur() {
    this.props.updateName(this.state.currentInput)
    this.setState({
      isRenaming: false
    })
  }

  handleKeyPress(event) {
    // End the rename when 'enter' is hit
    if (event.key === 'Enter') {
      this.nameInput.blur()
    }
  }

  handleMenuOpen(event) {
    this.setState({
      menuAnchor: event.currentTarget,
      menuOpen: true
    })
  }

  handleMenuClose() {
    this.setState({
      menuOpen: false
    })
  }

  componentDidUpdate() {
    // If we just added the <input>...
    if (this.state.isRenaming && this.state.startingRename) {
      // Select and focus it
      this.nameInput.select()
      this.nameInput.focus()
    }
  }

  render() {
    // Figure out what classes the container div needs
    let classes = 'snippet-row'
    if (this.props.selected) {
      classes += ' selected'
    }

    // If we need to display the <input>
    // to change the name...
    if (this.state.isRenaming) {
      return (
        <div
          className={classes}
          onClick={!this.props.selected ? this.props.selectSelf : null}
          onDoubleClick={this.props.selected ? this.startRename : null}
        >
          <input
            ref={input => this.nameInput = input}
            value={this.state.currentInput}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onKeyPress={this.handleKeyPress}
          />
        </div>
      )
    }

    const { selected, name } = this.props

    return (
      <ListItem
        button={true}
        onClick={selected ? () => {} : () => this.props.selectSnippet()}
        className={selected ? 'selected' : ''}
      >
        <ListItemText
          primary={name}
        />
        <ListItemSecondaryAction>
          <IconButton
            className="menu-icon"
          >
            <MoreVert
              onClick={this.handleMenuOpen}
            />
          </IconButton>
          <Menu
            anchorEl={this.state.menuAnchor}
            open={this.state.menuOpen}
            onRequestClose={this.handleMenuClose}
          >
            <MenuItem><Edit /> Rename</MenuItem>
            <MenuItem><PlayArrow /> Run</MenuItem>
            <MenuItem><Check /> Sandbox</MenuItem>
            <MenuItem
              onClick={this.props.deleteSnippet}
            >
              <Delete />
              Delete
            </MenuItem>
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

export default SnippetSelector
