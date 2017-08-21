import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Store } from 'react-chrome-redux'
import App from './components/App'
import ErrorPage from './components/ErrorPage'


export default (runInInspectedWindow) => {
	const store = new Store({
		portName: 'SNIPPETS'
	})
	const unsubscribe = store.subscribe(() => {
		unsubscribe()
		console.log(store.getState())
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
