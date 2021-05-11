export const pages = {
  MAIN: "/main",
  SETTINGS: "/settings",
  LOGIN: "/login",
  SELECT_GIST: "/select-gist",
  WELCOME: "/welcome",
};

export const CREATE_ACCESS_TOKEN_URL =
  "https://github.com/settings/tokens/new?description=Snippets%20Access%20Token&scopes=gist";

export const SNIPPETS_ISSUES_URL =
  "https://github.com/SidneyNemzer/snippets/issues/new";

export const OCTOKIT_USER_AGENT = `github.com/sidneynemzer/snippets ${process.env.SNIPPETS_VERSION}`;

export const WELCOME_SNIPPET_CONTENT = `
/***********************
* Welcome to Snippets! *
***********************/

console.log('Welcome to snippets!')

/*
CONTROLS

  * Run a snippet in the page that you opened the devtools on
    CTRL+ENTER
    (You must have the snippet focused)

  * Toggle the devtools console
    ESC

BUGS / ISSUES / SUGGESTIONS

  https://github.com/SidneyNemzer/snippets/issues

HAPPY CODING!
*/
`;
