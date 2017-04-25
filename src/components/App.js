import React from 'react'

import Sidepane from './Sidepane'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/github'

import './style.css'

class App extends React.Component {
  render() {
    return (
      <div>
        <Sidepane />
        <AceEditor
          mode="javascript"
          onChange={newValue => logger.debug(newValue)}
          name="editor"
          height="100vh"
          width="100%"
          theme="github"
        />
      </div>
    )
  }
}

export default App
