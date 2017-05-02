import React from 'react'

class DeleteSnippetButton extends React.Component {
  constructor() {
    super()

    this.state = {
      isConfirming: false
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    if (!this.state.isConfirming) {
      this.setState({
        isConfirming: true
      })
    } else {
      this.props.deleteSnippet()
      this.setState({
        isConfirming: false
      })
    }
  }

  render() {
    let text;

    if (this.state.isConfirming) {
      text = 'Are you sure?'
    } else {
      text = 'Delete Snippet'
    }

    return (
      <button
        className="delete"
        onClick={this.handleClick}
      >
        {text}
      </button>
    )
  }
}

export default DeleteSnippetButton
