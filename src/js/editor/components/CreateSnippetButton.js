import React from 'react'
import Button from '@material-ui/core/Button'

const CreateSnippetButton = props => (
  <Button
    varient="contained"
    color="primary"
    className="create"
    onClick={() => props.createSnippet('New Snippet')}
  >
    Create Snippet
  </Button>
)

export default CreateSnippetButton
