import React from 'react'

import CreateSnippetButton from './CreateSnippetButton'
import SnippetList from './SnippetList'

class Sidepane extends React.Component {
  render() {
    return (
      <div>
        <CreateSnippetButton />
        <SnippetList />
      </div>
    )
  }
}

export default Sidepane
