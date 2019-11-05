# Schema

This file documents how Snippets stores data

## Redux Store

```javascript
{
  snippets: {
    loading: false, // Boolean
    saving: false, // Boolean
    error: null, // String or null
    data: {
      [name]: {
        deleted: false, // Boolean
        renamed: 'new-name', // String or false
        lastUpdatedBy: 'chrome-devtools://devt...kSide=undocked', // String or undefined
          // lastUpdatedBy is used by each panel's editor to know when to update
          // the editor in response to a change from a different panel. Editors
          // can ignore their own updates.
        content: {
          local: 'abcd', // String
          remote: 'defg' // String or false
      }
    }
  }

  settings: {
    tabSize: 2,         // Int
    autoComplete: true, // Boolean
    softTabs: true,     // Boolean
    theme: 'github',    // 'github' or 'tomorrow_night'
    lineWrap: false,    // Boolean
    linter: true,       // Boolean
    accessToken: 'abcd', // false or String
    gistId: 'abcd',     // false or String
    autosaveTimer: 5,   // number
    fontSize: 12,       // number
  }
}
```

## Github Gist

```javascript
{
  public: false,
  description: 'Snippets <link>'
  files: {
    [name]: {
      content: 'content'
    }
  }
}
```
