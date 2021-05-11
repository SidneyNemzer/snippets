import { AnyAction } from "redux";

import { DeepPartial } from "../../types";
import * as settingsActions from "../actions/settings";
import {
  CREATE_SNIPPET,
  RENAME_SNIPPET,
  UPDATE_SNIPPET,
  DELETE_SNIPPET,
  LOADING_SNIPPETS,
  LOADED_SNIPPETS,
  SAVING_SNIPPETS,
  SAVED_SNIPPETS,
  LOADED_LEGACY_SNIPPETS,
} from "../actions/snippets";
import { mergeDeep as merge } from "../util/deep-merge";

const nextUniqueName = (
  name: string,
  existingNames: string[],
  append = 0
): string =>
  existingNames.includes(name + (append ? "-" + append : ""))
    ? nextUniqueName(name, existingNames, append + 1)
    : name + (append ? "-" + append : "");

export type Snippet = {
  deleted: boolean;
  renamed: string | false;
  /**
   * Used by each panel's editor to know when to update. Editors ignore their
   * own updates, but accept updates from other editors.
   */
  lastUpdatedBy?: string;
  content: {
    local: string;
    remote: string | false;
  };
};

export type SnippetsState = {
  loading: boolean;
  saving: boolean;
  error: Error | null;
  data: { [name: string]: Snippet } | null;
};

const defaultState: SnippetsState = {
  loading: true,
  saving: false,
  error: null,
  data: null,
};

const mergeState = <S extends {}>(oldState: S) => (
  newState: DeepPartial<S>
): S => merge({} as S, oldState, newState as any);

const snippets = (state = defaultState, action: AnyAction): SnippetsState => {
  const update = mergeState(state);
  switch (action.type) {
    case CREATE_SNIPPET:
      return !state.loading && state.data
        ? update({
            data: {
              [nextUniqueName("untitled", Object.keys(state.data))]: {
                deleted: false,
                renamed: false,
                content: {
                  local: "",
                  remote: false,
                },
              },
            },
          })
        : state;
    case RENAME_SNIPPET:
      return !state.loading &&
        state.data &&
        state.data[action.oldName] &&
        action.newName
        ? update({
            data: {
              [action.oldName]: {
                renamed:
                  action.newName === action.oldName ? false : action.newName,
              },
            },
          })
        : state;
    case UPDATE_SNIPPET:
      return !state.loading && state.data
        ? update({
            data: {
              [action.name]: {
                lastUpdatedBy: action.editorId,
                content: {
                  local: action.newBody,
                },
              },
            },
          })
        : state;
    case DELETE_SNIPPET:
      if (state.loading || !state.data) {
        return state;
      }

      const snippet = state.data[action.name];
      if (!snippet) {
        return state;
      }

      if (snippet.content.remote === false) {
        const snippets = { ...state.data };
        delete snippets[action.name];
        return { ...state, data: snippets };
      }

      return update({
        data: {
          [action.name]: {
            deleted: true,
          },
        },
      });
    case LOADING_SNIPPETS:
      return update({ loading: true, error: null });
    case LOADED_SNIPPETS:
      return action.error
        ? { loading: false, error: action.error, saving: false, data: null }
        : {
            saving: state.saving,
            error: null,
            loading: false,
            data: Object.entries<any>(action.snippets).reduce(
              (snippets, [name, { body }]) => {
                snippets[name] = {
                  deleted: false,
                  renamed: false,
                  content: {
                    local: body,
                    remote: body,
                  },
                };
                return snippets;
              },
              {} as { [name: string]: Snippet }
            ),
          };
    case SAVING_SNIPPETS:
      return update({ saving: true, error: null });
    case SAVED_SNIPPETS:
      return action.error
        ? {
            loading: false,
            saving: false,
            error: action.error,
            data: state.data,
          }
        : {
            loading: false,
            saving: false,
            error: null,
            data: Object.entries(state.data || {}).reduce(
              (accum, [name, snippet]) => {
                if (!snippet.deleted) {
                  accum[snippet.renamed ? snippet.renamed : name] = {
                    renamed: false,
                    deleted: false,
                    content: {
                      local: snippet.content.local,
                      remote: snippet.content.local,
                    },
                  };
                }
                return accum;
              },
              {} as { [name: string]: Snippet }
            ),
          };
    case LOADED_LEGACY_SNIPPETS:
      return action.error
        ? {
            loading: false,
            saving: false,
            error: action.error,
            data: state.data,
          }
        : {
            loading: false,
            saving: false,
            error: null,
            data: Object.entries<string>(action.snippets).reduce(
              (snippets, [name, body]) => {
                snippets[name] = {
                  renamed: false,
                  deleted: false,
                  content: {
                    local: body,
                    remote: snippets[name] && snippets[name].content.remote,
                  },
                };
                return snippets;
              },
              state.data || {}
            ),
          };
    case settingsActions.types.gistId:
    case settingsActions.types.accessToken:
      return update({ error: null, data: null });
    default:
      return state;
  }
};

export default snippets;
