import Button from "@material-ui/core/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import React from "react";

import { Snippet } from "../reducers/snippets";
import SnippetList from "./SnippetList";

type Props = {
  snippets: { [name: string]: Snippet };
  selectedSnippet: string | null;
  handleOpenSettings: () => void;
  createSnippet: (name: string) => void;
  selectSnippet: (name: string) => void;
  renameSnippet: (oldName: string, newName: string) => void;
  deleteSnippet: (name: string) => void;
  runSnippet: (name: string) => void;
};

const Sidepane: React.FC<Props> = (props) => (
  <div className="sidepane">
    <Button
      variant="contained"
      color="primary"
      className="create"
      onClick={() => props.createSnippet("New Snippet")}
    >
      Create Snippet
    </Button>
    <SnippetList
      snippets={props.snippets}
      selectedSnippet={props.selectedSnippet}
      selectSnippet={props.selectSnippet}
      renameSnippet={props.renameSnippet}
      deleteSnippet={props.deleteSnippet}
      runSnippet={props.runSnippet}
    />
    <Button onClick={props.handleOpenSettings} style={{ padding: "11px" }}>
      <SettingsIcon />
    </Button>
  </div>
);

export default Sidepane;
