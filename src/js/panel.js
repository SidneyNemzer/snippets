/* global chrome */
import createEditor from './editor'

createEditor(chrome.devtools.inspectedWindow.eval)
