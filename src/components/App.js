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
      selectedSnippet: null,
      snippets: {}
    }

    this.selectSnippet = this.selectSnippet.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.updateSnippetName = this.updateSnippetName.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
    this.saveSnippetToStorage = this.saveSnippetToStorage.bind(this)
    this.resetSnippets = this.resetSnippets.bind(this)
    // this.createSnippet = this.createSnippet.bind(this)
    // this.deleteSnippet = this.deleteSnippet.bind(this)
    // this.reloadSnippets = this.reloadSnippets.bind(this)

    function onDataLoadFail(error) {
      logger.error('Failed to load snippets from sync storage')
      logger.error(error)
      this.resetSnippets({
        '0': {
          name: 'Error',
          content: "Uh oh! Couldn't load snippets from Chrome storage. \n" + error
        }
      })
    }

    try {
      chrome.storage.sync.get('snippets', function (snippets) {
        if (chrome.runtime.lastError) {
          onDataLoadFail(chrome.runtime.lastError)
          return
        }

        this.resetSnippets(snippets)
      })
    } catch (error) {
      onDataLoadFail(error)
    }

    // this.reloadSnippets()
  }

  resetSnippets(snippets) {
    const newState = {
      snippets: snippets
    }
    if (Object.keys(newState.snippets).length === 0) {
      newState.snippets = {
        '0': {
          name: 'New Snippet',
          content: 'console.log(\'Welcome to Snippets!\')'
        }
      }
    }
    if (!this.state.selectedSnippet || !newState.snippets[this.state.selectedSnippet]) {
      newState.selectedSnippet = Object.keys(newState.snippets)[0]
    }

    this.setState(newState)
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

  updateSnippetName(snippetID, newName) {
    this.setState(function (previousState) {
      previousState.snippets[snippetID].name = newName
      return previousState
    })
  }

  saveSnippetToStorage(snippetID) {
    chrome.storage.sync.set({
      snippets: {
        [snippetID]: this.state.snippets[snippetID]
      }
    })
  }

  handleKeyPress(event) {
    if (event.key === 's' && event.ctrlKey) {
      saveSnippetToStorage(this.state.selectedSnippet)
    }
  }

  handleEditorChange(newValue) {
    this.setState(function (previousState) {
      previousState.snippets[this.state.selectedSnippet].content = newValue
      return previousState
    })
  }

  // deleteSnippet() {
  //
  // }

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
          updateSnippetName={this.updateSnippetName}
        />
        <AceEditor
          mode="javascript"
          name="editor"
          height="100vh"
          width="90%"
          theme="github"
          value={this.state.selectedSnippet ? this.state.snippets[this.state.selectedSnippet].content : ''}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleEditorChange}
        />
      </div>
    )
  }
}

export default App
