import React from 'react'

import CreateSnippetButton from './CreateSnippetButton'
import SnippetList from './SnippetList'
import DeleteSnippetButton from './DeleteSnippetButton'

class Sidepane extends React.Component {
  render() {
    return (
      <div className="sidepane">
        <CreateSnippetButton createSnippet={this.props.createSnippet} />
        <SnippetList
          snippets={this.props.snippets}
          selectedSnippet={this.props.selectedSnippet}
          selectSnippet={this.props.selectSnippet}
          updateSnippetName={this.props.updateSnippetName}
        />
        <DeleteSnippetButton deleteSnippet={() => this.props.deleteSnippet(this.props.selectedSnippet)} />
      </div>
    )
  }
}

export default Sidepane
