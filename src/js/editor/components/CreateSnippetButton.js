import React from 'react'
import Button from 'material-ui/Button'

class CreateSnippetButton extends React.Component {
  render() {
    return (
      <Button
        raised
        color="primary"
        className="create"
        onClick={() => this.props.createSnippet('New Snippet')}
      >
        Create Snippet
      </Button>
    )
  }
}

export default CreateSnippetButton
