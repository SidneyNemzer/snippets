import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Store } from 'webext-redux'
import App from './components/App'
import ErrorPage from './components/ErrorPage'

const chromeReduxStore = () =>
  new Store({
    portName: 'SNIPPETS'
  })

export default (runInInspectedWindow, store = chromeReduxStore()) => {
  // Ignore the first event; the store will be empty
  const unsubscribe = store.subscribe(() => {
    unsubscribe()
    const root = document.createElement('div')
    document.body.appendChild(root)
    try {
      ReactDOM.render(
        <Provider store={store}>
          <App
            runInInspectedWindow={runInInspectedWindow}
          />
        </Provider>,
        root
      )
    } catch (error) {
      ReactDOM.render(
        <ErrorPage
          title="Error"
          message="Something's not working :("
          error={error.toString()}
          action="If this happens again, report it here:"
          link="https://github.com/SidneyNemzer/snippets/issues"
        />,
        root
      )
      console.error(error)
    }
  })
}
