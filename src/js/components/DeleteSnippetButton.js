import React from 'react'

class DeleteSnippetButton extends React.Component {
  // handleClick() {
  //   if (!this.state.isConfirming) {
  //     this.setState({
  //       isConfirming: true
  //     })
  //   } else {
  //     this.props.deleteSnippet()
  //     this.setState({
  //       isConfirming: false
  //     })
  //   }
  // }

  render() {
    let text;
    if (this.props.isConfirming) {
      text = 'Are you sure?'
    } else {
      text = 'Delete Snippet'
    }

    return (
      <button
        className="delete"
        onClick={this.props.handleClick}
      >
        {text}
      </button>
    )
  }
}

export default DeleteSnippetButton
