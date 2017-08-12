import React from 'react'

class CreateSnippetButton extends React.Component {
  render() {
    return (
      <button
        className="create"
        onClick={() => this.props.createSnippet('New Snippet')}
      >
        Create Snippet
      </button>
    )
  }
}

export default CreateSnippetButton
