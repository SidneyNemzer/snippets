import React from 'react'
import AceEditor from 'react-ace'
import { connect } from 'react-redux'

import 'brace/ext/language_tools'
import 'brace/mode/javascript'
import 'brace/theme/github'
import 'brace/theme/tomorrow_night'

const Editor = (props) => (
  <AceEditor
    mode="javascript"
    name="editor"
    width="100%"
    theme={props.settings.theme}
    value={props.value}
    onChange={props.onChange}
    highlightActiveLine={false}
    enableBasicAutocompletion={props.settings.autoComplete}
    enableLiveAutocompletion={props.settings.autoComplete}
    tabSize={props.settings.tabSize}
    editorProps={{
      $blockScrolling: Infinity,
      useSoftTabs: props.settings.softTabs
    }}
  />
)

const mapStateToProps = (state) => ({
  settings: state.settings
})

export default connect(mapStateToProps)(Editor)
