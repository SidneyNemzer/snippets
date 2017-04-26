import Logger from 'logger'

import React from 'react'

class SnippetRow extends React.Component {
  constructor(props) {
    super(props)

    this.logger = new Logger('SnippetRow ' + this.props.key)
  }
  render() {
    let classes = 'snippet-row'
    if (this.props.selected) {
      classes += ' selected'
    }

    this.logger.debug('Selected: ' + this.props.selected)
    this.logger.debug('Classes: ' + classes)

    return (
      <div
        className={classes}
      >
        {this.props.name}
      </div>
    )
  }
}

export default SnippetRow
