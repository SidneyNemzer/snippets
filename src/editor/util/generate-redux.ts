import { ActionCreator, AnyAction } from "redux";

// TODO Move to separate file or use Ramda
export const mapObject = <K extends string, V1, V2>(
  callback: (key: K, value: V1) => V2,
  obj: { [key in K]: V1 }
): { [key in K]: V2 } =>
  Object.entries(obj).reduce((newObj, [key, value]) => {
    newObj[key as K] = callback(key as K, value as V1);
    return newObj;
  }, {} as { [key in K]: V2 });

export type TypeDescription<T extends string> = {
  [name in T]: true | { action: ActionCreator<any> };
};

export const generateTypes = <T extends string>(
  typeDescription: TypeDescription<T>
): { [name_ in T]: name_ } => mapObject((type) => type as any, typeDescription);

export const generateActions = <T extends string>(
  typeDescription: TypeDescription<T>
): { [key in T]: (...args: any[]) => AnyAction } =>
  mapObject(
    (type, definition) =>
      typeof definition === "object"
        ? (...args: any[]) =>
            Object.assign({ type: type }, definition.action(...args))
        : (arg: any) => ({ type: type, [type]: arg }),
    typeDescription
  );

/**
 * Creates a reducer from individual update functions
 *
 * `updaters` should look like:
 * ```
 * {
 *   [actionType1]: (state, action) => (
 *     // update state
 *     // the returned object is assigned to the current state
 *   )
 * }
 * ```
 */
export const createReducer = <T extends string, S extends {}>(
  updaters: { [name in T]: (state: S, action: AnyAction) => Partial<S> },
  defaultState: S
) => (state = defaultState, action: AnyAction) => {
  const updater = updaters[action.type as T];
  return updater ? Object.assign({}, state, updater(state, action)) : state;
};

/**
 * Creates a reducer based on the default state. Assumes each action has one
 * key which matches the `action.type`. That key's value will be placed into
 * the state using the same key.
 */
export const generateReducer = <
  T extends string,
  S extends { [key in T]: V },
  V extends {}
>(
  defaultState: S
) =>
  createReducer<T, S>(
    mapObject(
      (type) => (state, action) => ({ [type]: action[type] } as Partial<S>),
      defaultState
    ),
    defaultState
  );
