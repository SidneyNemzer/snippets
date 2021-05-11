## 2.4.0

- Added the option to create a new Gist during setup instead of using an existing Gist
- Resolved an issue where the <kbd>Esc</kbd> shortcut did not open the devtools console
- Fixed an error that occured when deleting the first snippet in the list ([#26](https://github.com/SidneyNemzer/snippets/issues/26))
- Resolved an error that occured deleting a snippet that had never been saved
- Re-implemented a fade animation for the settings page
- Rewrote the extension with TypeScript
- Updated packages
- Minor animation changes

## 2.3.0

- Switched to ESLint for better support of new JavaScript syntax. ESLint will check for syntax errors, and I've enabled a few rules that I think are relevant for Snippets. [View the rules here][eslint-rules]. These could be configurable in the future.
- In the settings, dropdowns are now used where applicable
- Added an input field to view your access token (hidden by default)

[eslint-rules]: https://github.com/SidneyNemzer/snippets/blob/4541e82082ac49070c338abba6c3298f96523665/src/mode-javascript-eslint/worker-javascript-eslint.js#L19-L33

## 2.2.0

- Editor font size is now configurable in the settings, thanks @mighty-sparrow!
- Fixed a bug where the selected snippet reset when opening settings
- Lots of code refactoring, React error boundry

## 2.1.1

- Fixed a bug where empty snippets would fail to save. Thanks to @Pfennigbaum for reporting!
- Addressed a bug where typing a question mark would open the devtool's settings
- Fixed a bug where selecting a different snippet added to the undo history
- Fixed an issue that could causes the cursor to jump while typing quickly
- Updated dependencies

## 2.1.0

- The _Run_ button and shortcut (Ctrl/Cmd + Enter) didn't work. Thanks to @bladnman for reporting!
- An error message is now logged if you run a Snippet with a syntax error

## 2.0.0

- Snippets are now stored in a Github Gist instead of Chrome sync storage. This addresses the low data limit of Chrome sync storage.
- Added a setting to configure autosave time
- Slightly reduced editor font size
- Fixed an issue where the code editor (Ace) wouldn't get shorter than 500px

## 1.1.2

- A warning will be displayed when the storage limit is exceeded

## 1.1.1

- Fixed an issue with loading legacy snippet data

## 1.1.0

- Added options to control the linter and line wrapping
- Fixed an issue where old snippet data overwrote new data
- Slightly reduced font size
- Code cleanup

## 1.0.1

- Fixed an issue with loading legacy snippet data

## 1.0.0

- Added configurable settings
- Added autocompletion
- Added autosave (everything is autosaved!)
- Updated interface
- Errors are displayed in nicer page. _Note: fixed all bugs and errors_.
- Fixed a spelling mistake in extension's description
- Disabled line highlighting
- Errors in snippets are displayed in the console instead of being hidden
- Updated the "Welcome!" snippet
- Defaulted indent to 2 spaces instead of 4

## 0.1.1

- Addressed an issue that caused an error when saving or loading snippets after installing extension
- New snippets are marked as unsaved

## 0.1.0

_Initial Release_
