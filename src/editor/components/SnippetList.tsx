import List from "@material-ui/core/List";
import React from "react";

import { Snippet } from "../reducers/snippets";
import SnippetSelector from "./SnippetSelector";

type Props = {
  snippets: { [name: string]: Snippet };
  selectedSnippet: string | null;
  selectSnippet: (name: string) => void;
  renameSnippet: (oldName: string, newName: string) => void;
  deleteSnippet: (name: string) => void;
  runSnippet: (name: string) => void;
};

const SnippetList: React.FC<Props> = ({
  snippets,
  selectedSnippet,
  selectSnippet,
  renameSnippet,
  deleteSnippet,
  runSnippet,
}) => (
  <List className="snippet-list">
    {Object.entries(snippets).map(([name, snippet]) => (
      <SnippetSelector
        key={name}
        selectSnippet={() => selectSnippet(name)}
        selected={selectedSnippet === name}
        updateName={(newName) => renameSnippet(name, newName)}
        name={snippet.renamed || name}
        deleteSnippet={() => deleteSnippet(name)}
        runSnippet={() => runSnippet(snippet.content.local)}
      />
    ))}
  </List>
);

export default SnippetList;
