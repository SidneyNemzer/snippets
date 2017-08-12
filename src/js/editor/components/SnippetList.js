import React from 'react'

import SnippetRow from './SnippetRow'

class SnippetList extends React.Component {
  renderRows() {
    return (
      Object.keys(this.props.snippets)
        .map(snippetID => {
          return (
            <SnippetRow
              selected={this.props.selectedSnippet === snippetID}
              name={this.props.snippets[snippetID].name}
              key={snippetID}
              selectSelf={() => this.props.selectSnippet(snippetID)}
              updateName={newName => this.props.renameSnippet(snippetID, newName)}
              unsaved={!this.props.snippets[snippetID].saved}
            />
          )
        })
    )
  }

  render() {
    return (
      <div className="snippet-list">
        {this.renderRows()}
      </div>
    )
  }
}

export default SnippetList
