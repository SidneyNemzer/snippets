import Logger from 'logger'

import React from 'react'

import SnippetRow from './SnippetRow'

const logger = new Logger('SnippetList')

class SnippetList extends React.Component {
  render() {
    const rows = Object.keys(this.props.snippets).map(snippetID => {
      logger.debug('snippetID: ' + snippetID)
      logger.debug('this.props.selectedSnippet: ' + this.props.selectedSnippet)
      return (
        <SnippetRow
          selected={this.props.selectedSnippet === snippetID}
          name={this.props.snippets[snippetID].name}
          key={snippetID}
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
