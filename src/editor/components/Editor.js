import React from "react";
import AceEditor from "react-ace";
import { connect } from "react-redux";

import "brace/ext/language_tools";
import "brace/mode/javascript";
import "brace/theme/github";
import "brace/theme/tomorrow_night";

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
