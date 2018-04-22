// TODO this file needs to be cleaned up

// TODO Move to separate file or use Ramda
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
// export default description => ({
//   types: generateTypes(description),
//   default_: generateDefault(description),
//   actions: generateActions(description),
//   reducer: generateReducer(description)
// })

export const generateTypes = typeDescription => (
  mapObject(type => type, typeDescription)
)

export const generateActions = typeDescription => (
  mapObject((type, { action }) => (
    action
      ? (...args) => Object.assign({ type: type }, action(...args))
      : arg => ({ type: type, [type]: arg })
  ), typeDescription)
)

/*
Creates a reducer from individual update functions
example updaters object:
{
  [actionType1]: (state, action) => (
    // update state
    // the returned object is assigned to the current state
  )
}
*/
export const createReducer = (updaters, defaultState) =>
  (state = defaultState, action) => {
    const updater = updaters[action.type]
    return updater
      ? Object.assign({}, state, updater(state, action))
      : state
  }

// Creates a reducer based on the default state
// Assumes each action has one key which matches the action.type
// That key's value will be placed into the state using the same key
export const generateReducer = defaultState => (
  createReducer(
    mapObject(
      type => (state, action) => (
        { [type]: action[type] }
      ),
      defaultState
    ),
    defaultState
  )
)
