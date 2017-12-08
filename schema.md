# Schema

This file documents how Snippets stores data

## Redux Store

```javascript
{
  // Global errors
  // Just save errors for now
  error: null, // String

  snippets: {
    loading: false, // Boolean
    error: null, // String or null
    data: {
      [name]: {
        deleted: false, // Boolean
        renamed: 'new-name', // String or false
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
