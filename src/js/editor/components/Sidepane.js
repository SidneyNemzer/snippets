import React from 'react'

import Button from 'material-ui/Button'
import SettingsIcon from 'material-ui-icons/Settings'
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
          runSnippet={this.props.runSnippet}
        />
        <Button><SettingsIcon /></Button>
      </div>
    )
  }
}

export default Sidepane
