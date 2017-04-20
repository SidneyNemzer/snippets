class Logger {
  constructor(prefix, handler) {
    this.prefix = prefix
    this.handler = handler || console
  }

  /**
   * NOTE: This function is for internal use
   * Calls the `handler` (most likely `console`) using the `level` and passing input
   * @param  {string} level The logging level (like `warn`)
   * @param  {string} input The content to give to `console[level]`
   */
  _callConsole(level, input) {
    this.handler[level](`[${this.prefix}] ${input}`)
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
