import React from 'react'

import Sidepane from './Sidepane'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/github'

import './style.css'

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      snippets: {}
    }

    this.openSnippet = this.openSnippet.bind(this)
    this.createSnippet = this.createSnippet.bind(this)
    this.updateSnippet = this.updateSnippet.bind(this)
    this.deleteSnippet = this.deleteSnippet.bind(this)
    this.reloadSnippets = this.reloadSnippets.bind(this)

    this.reloadSnippets()
  }

  openSnippet() {

  }

  createSnippet(name) {
    chrome.storage.local.set({
      snippets: {
        [name]: ''
      }
    }, function () {
      this.setState({
        snippets: {
          [name]: ''
        }
      })
    })
  }

  updateSnippet() {

  }

  deleteSnippet() {

  }

  reloadSnippets() {
    // TODO Display a loading icon in the list while stuff is loading
    // TODO Use sync storage
    chrome.storage.local.get('snippets', function (snippets) {
      this.setState({
        snippets: snippets
      })
    })
  }

  render() {
    return (
      <div>
        <Sidepane snippets={this.state.snippets} />
        <AceEditor
          mode="javascript"
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
