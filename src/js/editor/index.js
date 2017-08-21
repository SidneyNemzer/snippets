import React from 'react'
import { createStore } from 'redux'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import ErrorPage from './components/ErrorPage'
import rootReducer from './reducers'
import { saved } from './actions'

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		};
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow)
      func.apply(context, args)
	}
}

const timer = (miliseconds) =>
	new Promise(resolve => {
		setTimeout(resolve, miliseconds)
	})

export default (loadFromStorage, saveToStorage, runInInspectedWindow) => {
	const saveStore = (store) => {
	  const state = store.getState()
	  if (!state.saved) {
			const copyState = Object.assign({}, state)
			delete copyState.saved
	    saveToStorage(undefined, copyState, true)
	      .then(() => {
					store.dispatch(saved())
	      })
	  }
	}

	// TODO loading screen
	// ReactDOM.render(
	// 	<div>Loading...</div>,
	// 	document.getElementById('root')
	// )

	Promise.all([
		loadFromStorage('snippets'),
		//timer(1000)
	])
	  .then(() => {
	    const store = createStore(rootReducer)

	    store.subscribe(debounce(() => saveStore(store), 1000))

			try {
		    ReactDOM.render(
					<Provider store={store}>
	      		<App
							runInInspectedWindow={runInInspectedWindow}
						/>
					</Provider>,
		      document.getElementById('root')
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
		      document.getElementById('root')
		    )
		    console.error(error)
		  }
	  })
}
