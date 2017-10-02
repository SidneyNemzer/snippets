import React from 'react'
import AceEditor from 'react-ace'
import { connect } from 'react-redux'

import 'brace/ext/language_tools'
import 'brace/mode/javascript'
import 'brace/theme/github'
import 'brace/theme/tomorrow_night'

const Editor = (props) => {
  let timer
  return (
    <AceEditor
      mode="javascript"
      name="editor"
      width="100%"
      theme={props.settings.theme}
      value={props.value}
      onChange={(newValue) => {
        if (timer) {
          clearTimeout(timer)
          timer = undefined
          props.onChange(newValue)
        } else {
          timer = setTimeout(() => {
            props.onChange(newValue)
          }, 5)
        }
      }}
      highlightActiveLine={false}
      enableBasicAutocompletion={props.settings.autoComplete}
      enableLiveAutocompletion={props.settings.autoComplete}
      tabSize={props.settings.tabSize}
      wrapEnabled={props.settings.lineWrap}
      editorProps={{
        $blockScrolling: Infinity,
        useSoftTabs: props.settings.softTabs
      }}
    />
  )
}

const mapStateToProps = (state) => ({
  settings: state.settings
})

export default connect(mapStateToProps)(Editor)
