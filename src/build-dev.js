module.exports = [
  // Background
  {
    input: {
      entryScript: 'js/background.js'
    },
    output: {
      bundle: 'js/background'
    }
  },

  // Devtools
  {
    input: {
      template: 'html/blank.ejs',
      entryScript: 'js/devtools.js'
    },
    output: {
      html: 'html/devtools.html',
      bundle: 'js/devtools'
    }
  },

  // Panel
  {
    input: {
      template: 'html/root.ejs',
      entryScript: 'js/panel.js'
    },
    output: {
      html: 'html/panel.html',
      bundle: 'js/panel'
    }
  },

  // Test page
  {
    input: {
      template: 'html/root.ejs',
      entryScript: 'js/test.js'
    },
    options: {
      title: 'Snippets Test Page'
    },
    output: {
      html: 'html/test.html',
      bundle: 'js/test'
    }
  },
]
