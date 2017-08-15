import React from 'react'

import CreateSnippetButton from './CreateSnippetButton'
import SnippetList from './SnippetList'

class Sidepane extends React.Component {
  render() {
    return (
      <div className="sidepane">
        <CreateSnippetButton createSnippet={this.props.createSnippet} />
        <SnippetList
          snippets={this.props.snippets}
          selectedSnippet={this.props.selectedSnippet}
          selectSnippet={this.props.selectSnippet}
          renameSnippet={this.props.renameSnippet}
          deleteSnippet={this.props.deleteSnippet}
        />
      </div>
    )
  }
}

export default Sidepane
