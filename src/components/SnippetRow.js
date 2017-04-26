import React from 'react'

class SnippetRow extends React.Component {
  render() {
    return (
      <div
        className="snippet-row"
        onClick={this.props.handleClick}
      >
        {this.props.name}
      </div>
    )
  }
}

export default SnippetRow
