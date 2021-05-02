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
