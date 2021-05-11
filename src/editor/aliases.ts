/**
 * Redux actions that are usually thunks must be implemented with aliases
 * https://github.com/tshaddix/webext-redux/wiki/Advanced-Usage
 */

import { Octokit } from "@octokit/rest";
import { Dispatch } from "redux";

import {
  LOAD_SNIPPETS,
  LOADING_SNIPPETS,
  LOAD_LEGACY_SNIPPETS,
  LOADED_LEGACY_SNIPPETS,
  SAVE_SNIPPETS,
  SAVING_SNIPPETS,
  loadedSnippets,
  savedSnippets,
} from "./actions/snippets";
import { RootState } from "./reducers";

type Snippet = {
  name: string;
  body: string;
};

const loadSnippets = (octokit: Octokit) => () => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const gistId = getState().settings.gistId;
  if (!gistId) {
    const error: any = new Error("Missing Gist ID");
    error.context = "load snippets";
    dispatch(loadedSnippets(error));
    return;
  }

  dispatch({ type: LOADING_SNIPPETS });

  octokit.gists
    .get({ gist_id: gistId })
    .then(({ data: gist }) => {
      dispatch(
        loadedSnippets(
          null,
          Object.entries(gist.files || {}).reduce(
            (snippets, [fileName, gistFile]) => {
              if (!gistFile) {
                return snippets;
              }

              const { truncated, content } = gistFile;

              snippets[fileName] = {
                name: fileName,
                body: truncated ? "(Truncated)" : content || "", // TODO handle truncated files
              };
              return snippets;
            },
            {} as { [name: string]: Snippet }
          )
        )
      );
    })
    .catch((error) => {
      error.context = "load snippets";
      dispatch(loadedSnippets(error));
    });
};

type GistFile = {
  content?: string;
  filename?: string;
};

const saveSnippets = (octokit: Octokit) => () => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  const {
    snippets: { data },
    settings: { gistId },
  } = getState();

  if (!data) return;

  dispatch({ type: SAVING_SNIPPETS });

  const files = Object.entries(data).reduce((files, [name, snippet]) => {
    if (snippet.deleted) {
      files[name] = null;
    } else if (snippet.content.local !== snippet.content.remote) {
      const content = snippet.content.local.trim()
        ? snippet.content.local
        : "(Github Gists can't be empty so Snippets saved this content)";

      files[name] = { content };
    }

    if (snippet.renamed) {
      files[name] = files[name] || {};
      (files[name] as GistFile).filename = snippet.renamed;
    }

    return files;
  }, {} as { [name: string]: GistFile | null });

  octokit.gists
    .update({ gist_id: gistId, files })
    .then(() => dispatch(savedSnippets(null)))
    .catch((error) => {
      error.context = "save snippets";
      dispatch(savedSnippets(error));
    });
};

const loadLegacySnippets = () => (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  chrome.storage.sync.get((storage) => {
    const snippets: {
      [name: string]: { content?: string; body?: string; name: string };
    } = storage.snippets;

    const processedSnippets = Object.entries(snippets).reduce(
      (snippets, [id, value]) => {
        const { content, body, name } = value;
        if (body || content) {
          snippets[name] = body || content || "";
        }
        return snippets;
      },
      {} as { [name: string]: string }
    );

    dispatch({
      type: LOADED_LEGACY_SNIPPETS,
      error: null,
      snippets: processedSnippets,
    });
  });
};

export default (octokit: Octokit) => ({
  [LOAD_SNIPPETS]: loadSnippets(octokit),
  [SAVE_SNIPPETS]: saveSnippets(octokit),
  [LOAD_LEGACY_SNIPPETS]: loadLegacySnippets,
});
