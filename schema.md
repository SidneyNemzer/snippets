# Schema

This file documents how Snippets stores data

## Redux Store

```javascript
{
  saved: true, // Boolean
  snippets: {
    [id]: {
      name: "Snippet", // String
      body: "console.log('hi')" // String
    },
    // ...
  },
  settings: {
    tabSize: 2, // Int
    autoComplete: true, // Boolean
    softTabs: true, // Boolean
    theme: 'github' // 'github' or 'tomorrow_night'
  }
}
```

## Chrome Sync Storage

```javascript
{
  snippets: {
    // Same as Redux store.snippets
  },
  settings: {
    // Same as Redux store.settings
  }
}
```
