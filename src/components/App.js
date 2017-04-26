import Logger from 'logger'

import React from 'react'

import Sidepane from './Sidepane'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/github'

import '../style.css'

const logger = new Logger('App')

class App extends React.Component {
  // constructor() {
  //   super()
  //
  //   // this.state = {
  //   //   snippets: {}
  //   // }
  //   //
  //   // this.openSnippet = this.openSnippet.bind(this)
  //   // this.createSnippet = this.createSnippet.bind(this)
  //   // this.updateSnippet = this.updateSnippet.bind(this)
  //   // this.deleteSnippet = this.deleteSnippet.bind(this)
  //   // this.reloadSnippets = this.reloadSnippets.bind(this)
  //   //
  //   // this.reloadSnippets()
  // }

  // openSnippet() {
  //
  // }
  //
  // createSnippet() {
  //   logger.debug('Creating snippet')
  //   chrome.storage.local.get('lastSnippetID', function (lastID) {
  //     const nextID = lastID + 1
  //
  //     chrome.storage.local.set({
  //       snippets: {
  //         nextID: {
  //           name: '',
  //           content: ''
  //         }
  //       }
  //     }, function () {
  //       this.setState({
  //         snippets: {
  //           nextID: {
  //             name: '',
  //             content: ''
  //           }
  //         }
  //       })
  //     })
  //   })
  // }
  //
  // updateSnippet() {
  //
  // }
  //
  // deleteSnippet() {
  //
  // }
  //
  // reloadSnippets() {
  //   // TODO Display a loading icon in the list while stuff is loading
  //   // TODO Use sync storage
  //   chrome.storage.local.get('snippets', function (snippets) {
  //     this.setState({
  //       snippets: snippets
  //     })
  //   })
  // }

  render() {
    return (
      <div>
        <Sidepane
          snippets={this.props.snippets}
          selectedSnippet={this.props.selectedSnippet}
        />
        <AceEditor
          mode="javascript"
          name="editor"
          height="100vh"
          width="100%"
          theme="github"
          value={this.props.snippets[this.props.selectedSnippet].content }
        />
      </div>
    )
  }
}

export default App
