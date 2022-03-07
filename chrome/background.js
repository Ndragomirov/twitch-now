var twitchOauth = OAuth2.addAdapter({
  id      : 'twitch',
  codeflow: {
    method: "POST",
    url   : "https://id.twitch.tv/oauth2/token"
  },
  opts    : constants.twitchApi
});