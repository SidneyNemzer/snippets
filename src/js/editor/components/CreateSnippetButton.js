import React from 'react'
import Button from 'material-ui/Button'

const CreateSnippetButton = props => (
  <Button
    raised
    color="primary"
    className="create"
    onClick={() => props.createSnippet('New Snippet')}
  >
    Create Snippet
  </Button>
)

export default CreateSnippetButton
