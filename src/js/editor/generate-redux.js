export const mapObject = (callback, obj) =>
  Object.entries(obj)
    .reduce((newObj, [key, value]) => {
      newObj[key] = callback(key, value)
      return newObj
    }, {})

/**
 * Generate redux types, actions, and reducer
 * @param  {Object<string, ?>} description The types to create with their default value
 * @return {Object} an object containing three keys: types, actions, and reducer
 * @example
 * generate({
 *  key1: { default_: true },
 *  key2: { default_: 'test'},
 *  key3: {
 *    default: 4,
 *    action: name => ({ id: createRandomId(), name }) ,
 *    reducer: (state, { name, id }) => (
 *      id < 4
 *        ? name
 *        : id + 4
 *    )
 *  }
 * })
 * // => {
 *   types: {
 *    key1: 'key1',
 *    key2: 'key2',
 *    key3: 'key3'
 *   },
 *   default_: {
 *    key1: true,
 *    key2: 'test',
 *    key3: 4
 *   }
 *   actions: {
 *    key1: key1 => ({
 *      type: 'key1',
 *      key1
 *    }),
 *    key2: key2 => ({
 *      type: 'key2',
 *      key2
 *    }),
 *    key3: name => ({
 *      type: 'key3' // type is added automatically
 *      id: createRandomId(),
 *      name
 *    })
 *   },
 *   reducer: (state = default, action) => {
 *    switch (action.type) {
 *      case 'key1':
 *        return Object.assign({}, state, { key1: action.key1 })
 *      case 'key2':
 *        return Object.assign({}, state, { key2: action.key2 })
 *      case 'key3':
 *        return Object.assign({}, state, { key3: key3.reducer(state.key3, action) })
 *    }
 *   }
 * }
 */
export default description => ({
  types: generateTypes(description),
  default_: generateDefault(description),
  actions: generateActions(description),
  reducer: generateReducer(description)
})

export const generateTypes = description => (
  mapObject(type => type, description)
)

export const generateDefault = description => (
  mapObject((type, { default_ }) => default_, description)
)

export const generateActions = description => (
  mapObject((type, { action }) => (
    action
      ? (...args) => Object.assign({ type: type }, action(...args))
      : arg => ({ type: type, [type]: arg })
  ), description)
)

export const generateReducer = description => {
  const defaultState = generateDefault(description)
  return (state = defaultState, action) => {
    const { type } = action
    const typeDescription = description[type]
    return typeDescription
      ? typeof typeDescription.reducer === 'function'
        ? Object.assign({}, state, { [type]: typeDescription.reducer(state[type], action) })
        : Object.assign({}, state, { [type]: action[type] })
      : state
  }
}
