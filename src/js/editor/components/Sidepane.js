import React from 'react'

import Button from 'material-ui/Button'
import SettingsIcon from 'material-ui-icons/Settings'
import CreateSnippetButton from './CreateSnippetButton'
import SnippetList from './SnippetList'

const Sidepane = props => (
  <div className="sidepane">
    <CreateSnippetButton createSnippet={props.createSnippet} />
    <SnippetList
      snippets={props.snippets}
      selectedSnippet={props.selectedSnippet}
      selectSnippet={props.selectSnippet}
      renameSnippet={props.renameSnippet}
      deleteSnippet={props.deleteSnippet}
      runSnippet={props.runSnippet}
    />
    <Button
      onClick={props.handleOpenSettings}
    >
      <SettingsIcon />
    </Button>
  </div>
)

export default Sidepane
