import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import ErrorPage from './components/ErrorPage'

import createSnippetStore from './stores/snippets'

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// Generate a unique ID using the crypto API
// Source: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

export default (saveToStorage, loadFromStorage) => {
  loadFromStorage('snippets')
    .then(initalSnippets => {
      const handleSnippetsChange = (id) => {
        console.info('snippet changed: ', id)
      }

      const snippetStore = createSnippetStore(initalSnippets)
      snippetStore.subscribe(handleSnippetsChange)

      try {
        ReactDOM.render(
          <App
            snippetStore={snippetStore}
            getNextId={uuidv4}
          />,
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
