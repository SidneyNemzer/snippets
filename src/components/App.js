import Logger from 'logger'

import React from 'react'

import Sidepane from './Sidepane'
import AceEditor from 'react-ace'
import 'brace/mode/javascript'
import 'brace/theme/github'

import '../style.css'

const logger = new Logger('App')

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSnippet: this.props.selectedSnippet,
      snippets: this.props.snippets
    }

    this.selectSnippet = this.selectSnippet.bind(this)
    // this.createSnippet = this.createSnippet.bind(this)
    this.updateSnippetName = this.updateSnippetName.bind(this)
    // this.deleteSnippet = this.deleteSnippet.bind(this)
    // this.reloadSnippets = this.reloadSnippets.bind(this)
    //
    // this.reloadSnippets()
  }

  selectSnippet(snippetID) {
    this.setState({
      selectedSnippet: snippetID
    })
  }

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

  updateSnippetName(snippetID, snippet) {
    this.setState(function (previousState) {
      previousState.
    })

    // this.setState({
    //   snippets: {
    //     [snippetID]: snippet
    //   }
    // })
  }

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
      <div className="app">
        <Sidepane
          snippets={this.state.snippets}
          selectedSnippet={this.state.selectedSnippet}
          selectSnippet={this.selectSnippet}
          updateSnippet={this.updateSnippet}
        />
        <AceEditor
          mode="javascript"
          name="editor"
          height="100vh"
          width="90%"
          theme="github"
          value={this.state.snippets[this.state.selectedSnippet].content }
        />
      </div>
    )
  }
}

export default App
