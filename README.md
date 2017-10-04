# WARNING

Currently, you can only store up to about 8000 bytes accross all your snippets, due to the way Chrome's Sync storage works.

**If you exceed this amount, the new data will be lost!**

I'm going to deploy an update soon that displays a warning when this happens. In the next few days, I'll be able to switch to a different storage method with a much higher limit. See issue [#5](https://github.com/SidneyNemzer/snippets/issues/5)

![Snippets](images/logo-transparent.png)

A Chrome extension that allows you to create and edit JavaScript code snippets, which are synced to all your computers.

See [the changelog](CHANGELOG.md) for a version history and [the roadmap](roadmap.md) for upcoming features.

## Installing

Install the extension [from the Chrome Web Store](https://chrome.google.com/webstore/detail/snippets/fakjeijchchmicjllnabpdkclfkpbiag)

## FAQ

### Q: How do I use this extension?

A: After installing the extension, open the Chrome Devtools on any webpage. This extension adds a new tab called "Snippets", where you can view, edit, and run your JavaScript code snippets.

### Q: Why doesn't this just sync the snippets that are built-into Chrome?

A: Unfortunately, Chrome doesn't allow extensions to access the built-in snippets. So I created my own snippet editor!

### Q: What did you use to make this extension?

A: The interface uses [React](https://facebook.github.io/react/) and [Material UI](http://www.material-ui.com/#/). The code editor is [react-ace](https://github.com/securingsincity/react-ace). [Redux](http://redux.js.org/) and [react-chrome-redux](https://github.com/tshaddix/react-chrome-redux) are used to sync all panels.

### Q: Can you add *insert feature here*

A: See [the roadmap](roadmap.md) for planned features. [Open an issue](https://github.com/SidneyNemzer/snippets/issues) if you'd like to suggest a feature.

### Q: What font is the logo in?

A: Freestyle Script. Maybe you don't find that too interesting, but I'll forget it if I don't write it somewhere...
