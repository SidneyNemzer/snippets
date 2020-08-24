// ace-builds must be imported before react-ace
// See https://github.com/securingsincity/react-ace/issues/725
import 'ace-builds'

import React from "react";
import AceEditor from "react-ace";
import { connect } from "react-redux";

import 'ace-builds/webpack-resolver'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-tomorrow_night'

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.lastUpdatedBy && props.lastUpdatedBy !== props.editorId) {
      return { value: props.value };
    } else {
      return null;
    }
  }

  handleChange = value => {
    this.setState({ value });
    this.props.onChange(value);
  };

  render() {
    return (
      <AceEditor
        mode="javascript"
        name="editor"
        width="100%"
        height="auto"
        theme={this.props.settings.theme}
        fontSize={this.props.settings.fontSize}
        value={this.state.value}
        onChange={this.handleChange}
        highlightActiveLine={false}
        enableBasicAutocompletion={this.props.settings.autoComplete}
        enableLiveAutocompletion={this.props.settings.autoComplete}
        tabSize={this.props.settings.tabSize}
        wrapEnabled={this.props.settings.lineWrap}
        editorProps={{
          $blockScrolling: Infinity,
          useSoftTabs: this.props.settings.softTabs
        }}
        setOptions={{
          useWorker: this.props.settings.linter
        }}
        onLoad={ace => {
          ace.container.addEventListener("keydown", event => {
            if (event.key === "?") {
              event.stopPropagation();
            }
          });
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings
});

export default connect(mapStateToProps)(Editor);
