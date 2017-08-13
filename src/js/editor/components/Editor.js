import React from 'react'
import AceEditor from 'react-ace'

import 'brace/ext/language_tools'
import 'brace/mode/javascript'
import 'brace/theme/github'

const Editor = (props) => (
  <AceEditor
    mode="javascript"
    name="editor"
    width="100%"
    theme={props.theme}
    value={props.value}
    onChange={props.onChange}
    highlightActiveLine={false}
    enableBasicAutocompletion={props.autoCompletion}
    enableLiveAutocompletion={props.autoCompletion}
    editorProps={{$blockScrolling: Infinity}}
  />
)

export default Editor
