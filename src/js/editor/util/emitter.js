export default () => {

  const subscribers = []

  return {
    subscribe: (callback) => {
      if (!subscribers.includes(callback))
        subscribers.push(callback)
    },

    unsubscribe: (callback) => {
      if (this.subscribers.includes(callback))
        subscribers.splice(subscribers.indexOf(callback), 1)
    },

    emit: (...args) => {
      subscribers.forEach(callback => callback(...args))
    }
  }
}
