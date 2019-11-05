## 2.2.0

### Features

- Editor font size is now configurable in the settings, thanks @mighty-sparrow!

### Bug Fixes

- Selected snippet no longer resets when switching to settings

### Internal Changes

- Lots of code refactoring
- New React error boundry

## 2.1.1

### Bug Fixes

- Empty snippets would fail to save. Thanks to @Pfennigbaum for reporting!
- Typing a question mark would open the devtool's settings
- Prevent undo (ctrl+z) from undoing a file change
- Fix an issue that could causes the cursor to jump while typing quickly

### Misc

- Update dependencies

## 2.1.0

### Changes / Bug Fixes

- _Run_ button and shortcut (Ctrl/Cmd + Enter) did nothing. Thanks to @bladnman
  for reporting!
- An error message is logged if you run a Snippet with a syntax error

## 2.0.0

### Features

- Snippets are now stored in a Github Gist (instead of Chrome Sync Storage)
- Added a setting to configure autosave time

### Changes / Bug Fixes

- Slightly reduced editor font size
- The code editor (Ace) wouldn't get shorter than 500px

## 1.1.2

### Features

- Display a warning when the storage limit is exceeded

## 1.1.1

### Bug Fixes

- Fixed issue with loading legacy snippet data

## 1.1.0

### Features

- Add an option to enable line wrapping
- Add an option to disable the linter

### Bug Fixes

- Prevent old snippet data from overriding new data

### Misc

- Slightly reduce font size
- Code cleanup

## 1.0.1

### Bug Fixes

- Fix loading of old snippet data

## 1.0.0

### Features

- Add configurable settings
- Add autocompletion
- Add autosave (everything is autosaved!)
- Update interface
- Errors are displayed in nicer page
  - Removed all errors

### Bug Fixes

- Fixed spelling mistake in extension's description
- Disable line highlighting
- Errors in snippets are displayed in the console instead of being hidden

### Misc

- Update the "Welcome!" snippet
- Default to indents to 2 spaces instead of 4

## 0.1.1

### Bug Fixes

- Prevent error when saving or loading snippets after installing extension
- New snippets are marked as unsaved

## 0.1.0

_Initial Release_
