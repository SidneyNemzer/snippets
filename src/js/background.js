let ports = []

chrome.runtime.onConnect.addListener(function (port) {
  // We're only interested in connections from a devtools panel
  if (port.name !== 'devtools') {
    return
  }
  ports.push(port)

  // Remove ports when they're closed (that means the devtools window closed)
  port.onDisconnect.addListener(function () {
    let index = ports.indexOf(port)
    if (index !== -1) {
      ports.splice(index, 1)
    }
  })

  port.onMessage.addListener(function (message) {
    console.log('[Background] Got message from devtools: ' + message)
  })
})

function messageAll(message) {
  ports.forEach(port => {
    port.postMessage(message)
  })
}
