import React from 'react'

import List from 'material-ui/List'
import SnippetSelector from './SnippetSelector'

const SnippetList = props => (
  <List>
    {
      Object.entries(props.snippets)
        .map(([name, snippet]) => (
          <SnippetSelector
            key={name}
            selectSnippet={() => props.selectSnippet(name)}
            selected={props.selectedSnippet === name}
            updateName={newName => props.renameSnippet(name, newName)}
            name={name}
            deleteSnippet={() => props.deleteSnippet(name)}
            runSnippet={() => props.runSnippet(snippet.content.local)}
          />
        ))
    }
  </List>
)

export default SnippetList
