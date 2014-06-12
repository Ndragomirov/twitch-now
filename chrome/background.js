var l = lytics.init('UA-21976825-4');

var twitchOauth = OAuth2.addAdapter({
  id      : 'twitch',
  codeflow: {
    method: "POST",
    url   : "https://api.twitch.tv/kraken/oauth2/token"
  },
  opts    : constants.twitchApi
});

chrome.runtime.onMessage.addListener(function (msg){
  if ( msg.id == "OAUTH2_AUTH" ) {
    twitchOauth.authorize(function (){
    })
  }
})

chrome.runtime.onMessage.addListener(function (msg){
  if ( msg.id == "OAUTH2_TOKEN_GET" ) {
    chrome.runtime.sendMessage({id: "OAUTH2_TOKEN", value: twitchOauth.getAccessToken()});
  }
})

chrome.runtime.onMessage.addListener(function (msg){
  if ( msg.id == "OAUTH2_REVOKE" ) {
    twitchOauth.clearAccessToken();
  }
})