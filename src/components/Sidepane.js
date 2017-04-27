import React from 'react'

import CreateSnippetButton from './CreateSnippetButton'
import SnippetList from './SnippetList'

class Sidepane extends React.Component {
  render() {
    return (
      <div className="sidepane">
        <CreateSnippetButton />
        <SnippetList
          snippets={this.props.snippets}
          selectedSnippet={this.props.selectedSnippet}
          selectSnippet={this.props.selectSnippet}
        />
      </div>
    )
  }
}

export default Sidepane
