import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './components/App'
import ErrorPage from './components/ErrorPage'

export default (store) => {
      try {
        ReactDOM.render(
					<Provider store={store}>
          	<App/>
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
    //})
}
