var providerOpts = {
  api          : "https://api.twitch.tv/kraken/oauth2/authorize",
  response_type: 'code',
  client_id    : 'b4sj5euottb8mm7pc1lfvi84kvzxqxk',
  client_secret: '2m42qpmxfy5l2ik4c93s0qco4vzfgr0',
  api_scope    : 'user_follows_edit user_read',
  redirect_uri : 'http://ndragomirov.github.io/twitch.html'
};

var twitchOauth = OAuth2.addAdapter({
  id      : 'twitch',
  codeflow: {
    method: "POST",
    url   : "https://api.twitch.tv/kraken/oauth2/token"
  },
  opts    : providerOpts
});

chrome.runtime.onMessage.addListener(function (msg){
  if ( msg.id == "OAUTH2_AUTH" ) {
    twitchOauth.authorize(function (){
      chrome.runtime.sendMessage({id: "OAUTH2_TOKEN", value: twitchOauth.getAccessToken()});
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
    chrome.runtime.sendMessage({id: "OAUTH2_TOKEN", value: twitchOauth.getAccessToken()});
  }
})

var scripts = [
//  "common/lib/concat.js"
  "common/lib/utils.js",
  "common/lib/3rd/jquery-1.8.2.min.js",
  "common/lib/3rd/bootstrap.min.js",
  "common/lib/3rd/underscore.js",
  "common/lib/3rd/backbone.js",
  "common/lib/3rd/handlebars.js",
  "common/lib/3rd/prettydate.js",
  "common/lib/3rd/i18n.js",
  "common/dist/templates.js",
  "common/lib/handlebars-helpers.js",
  "common/lib/popup.js",
  "common/lib/routes.js",
  "common/lib/init.js",
];

//scripts = scripts.map(function (v){
//  return chrome.runtime.getURL(v);
//})
scripts = scripts.map(function (v){
  return "../../" + v;
})
//
//chrome.runtime.onMessage.addListener(function (msg){
//  if ( msg.id == "POPUP_SCRIPTS_GET" ) {
//
//
//    chrome.runtime.sendMessage({id: "POPUP_SCRIPTS_INJECT", value: scripts});
//  }
//})