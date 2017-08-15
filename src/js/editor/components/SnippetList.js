import React from 'react'

import List from 'material-ui/List'
import SnippetSelector from './SnippetSelector'

class SnippetList extends React.Component {
  renderRows() {
    return (
      Object.keys(this.props.snippets)
        .map(snippetID => {
          const selected = this.props.selectedSnippet === snippetID
          return (
            <SnippetSelector
              key={snippetID}
              selectSnippet={() => this.props.selectSnippet(snippetID)}
              selected={selected}
              name={this.props.snippets[snippetID].name}
              deleteSnippet={() => this.props.deleteSnippet(snippetID)}
              runSnippet={() => this.props.runSnippet(this.props.snippets[snippetID].body)}
            />
          )
        })
    )
  }

  render() {
    return (
      <List>
        {this.renderRows()}
      </List>
    )
  }
}

export default SnippetList
