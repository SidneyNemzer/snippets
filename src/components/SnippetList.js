import React from 'react'

import SnippetRow from './SnippetRow'

class SnippetList extends React.Component {
  render() {
    const rows = Object.keys(this.props.snippets).map(snippetID => {
      return (
        <SnippetRow
          selected={this.props.selectedSnippet === snippetID}
          name={this.props.snippets[snippetID].name}
          key={snippetID}
          selectSelf={() => this.props.selectSnippet(snippetID)}
        />
      )
    })

    return (
      <div className="snippet-list">
        {rows}
      </div>
    )
  }
}

export default SnippetList
