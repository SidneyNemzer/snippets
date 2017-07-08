chrome.devtools.panels.create(
  'Snippets',
  '', // We don't provide an image
  'panel.html',

  // Enable messaging between panel and background script
  // This logic passes messages between the two
  // See http://stackoverflow.com/a/11677744
  function (panel) {
    // We'll use this once the panel is opened (by the user)
    let _window = null

    let messageQueue = []
    let port = chrome.runtime.connect({name: 'devtools'})

    port.onMessage.addListener(function (message) {
      // Send the message to the panel if it exists
      if (_window) {
        _window.onMessage(message)
      } else {
        data.push(message)
      }
    })

    panel.onShown.addListener(function temp(panelWindow) {
      panel.onShown.removeListener(temp) // Runs only once
      _window = panelWindow

      // Release the queue
      let message
      while (message = messageQueue.shift()) {
        _window.onMessage(message)
      }

      _window.postMessage = function (message) {
        port.postMessage(message)
      }
    })
})
