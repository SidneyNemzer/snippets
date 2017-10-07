import React from 'react'

import List from 'material-ui/List'
import SnippetSelector from './SnippetSelector'

const SnippetList = props => (
  <List>
    {
      Object.entries(props.snippets)
        .map(([snippetId, snippet]) => (
          <SnippetSelector
            key={snippetId}
            selectSnippet={() => props.selectSnippet(snippetId)}
            selected={props.selectSnippet === snippetId}
            updateName={newName => props.renameSnippet(snippetId, newName)}
            name={snippet.name}
            deleteSnippet={() => props.deleteSnippet(snippetId)}
            runSnippet={() => props.runSnippet(snippet.body)}
          />
        ))
    }
  </List>
)

export default SnippetList
