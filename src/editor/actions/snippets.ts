export const CREATE_SNIPPET = "CREATE_SNIPPET";
export const RENAME_SNIPPET = "RENAME_SNIPPET";
export const UPDATE_SNIPPET = "UPDATE_SNIPPET";
export const DELETE_SNIPPET = "DELETE_SNIPPET";
export const LOADING_SNIPPETS = "LOADING_SNIPPETS";
export const LOADED_SNIPPETS = "LOADED_SNIPPETS";
export const SAVING_SNIPPETS = "SAVING_SNIPPETS";
export const SAVED_SNIPPETS = "SAVED_SNIPPETS";
export const LOAD_SNIPPETS = "LOAD_SNIPPETS";
export const SAVE_SNIPPETS = "SAVE_SNIPPETS";
export const LOAD_LEGACY_SNIPPETS = "LOAD_LEGACY_SNIPPETS";
export const LOADED_LEGACY_SNIPPETS = "LOADED_LEGACY_SNIPPETS";

export const createSnippet = () => ({
  type: CREATE_SNIPPET,
});

export const renameSnippet = (oldName: string, newName: string) => ({
  type: RENAME_SNIPPET,
  oldName,
  newName,
});

export const updateSnippet = (
  name: string,
  newBody: string,
  editorId: string
) => ({
  type: UPDATE_SNIPPET,
  name,
  newBody,
  editorId,
});

export const deleteSnippet = (name: string) => ({
  type: DELETE_SNIPPET,
  name,
});

export const loadSnippets = () => ({
  type: LOAD_SNIPPETS,
});

export const loadLegacySnippets = () => ({
  type: LOAD_LEGACY_SNIPPETS,
});

export type Snippet = {
  name: string;
  body: string;
};

export const loadedSnippets = (
  error: Error | null,
  snippets?: { [name: string]: Snippet }
) => ({
  type: LOADED_SNIPPETS,
  snippets,
  error,
});

export const saveSnippets = () => ({
  type: SAVE_SNIPPETS,
});

export const savedSnippets = (error: Error | null) => ({
  type: SAVED_SNIPPETS,
  error,
});
