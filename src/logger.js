class Logger {
  constructor(prefix, handler) {
    this.prefix = prefix
    this.handler = handler
  }

  
  _callConsole(level, input) {
    evalInWindow(`console.${functionName}('[${this.prefix}] ${input}')`)
  }

  log() {
    const args = Array.from(arguments)
    let output = args[0]
    args.forEach(function (arg, index) {
      if (index == 0) {
        return
      }
      output += ' ' + arg
    })
    this._callConsole('log', output)
  }
}

export default Logger
