import Logger from 'logger'

import React from 'react'

class SnippetRow extends React.Component {
  constructor(props) {
    super(props)

    this.logger = new Logger('SnippetRow')

    this.state = {
      isRenaming: false,
      startingRename: false
    }

    this.startRename = this.startRename.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
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
          // Allow a row to be selected if it isn't already
          onClick={!this.props.selected ? this.props.selectSelf : null}
          // Allow the name to be edited if the row is selected
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

    // If we need to display the name...

    // Add an astrisk if it's unsaved
    let name = ''
    if (this.props.unsaved) {
      name = '*'
    }
    name += this.props.name
    return (
      <div
        className={classes}
        onClick={!this.props.selected ? this.props.selectSelf : null}
        onDoubleClick={this.props.selected ? this.startRename : null}
      >
        {name}
      </div>
    )
  }
}

export default SnippetRow
