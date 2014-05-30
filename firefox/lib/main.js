/*disable strict javascript error logs*/
require("sdk/preferences/service").set("javascript.options.strict", false);

var buttons = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var panels = require("sdk/panel");
var Request = require("sdk/request").Request;
var pageMod = require("sdk/page-mod");
var ss = require("sdk/simple-storage");
var i18n = require("./i18n.js");
var OAuth2 = require("./oauth2.js");
var twitchNow = require("./twitch-now.js").twitchNow;

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


var scripts = [
  "lib/3rd/sinon-xhr.js",
  "lib/3rd/xhr-proxy-ff.js",
  "lib/utils.js",
  "lib/3rd/jquery.js",
  "lib/3rd/baron.js",
  "lib/3rd/bootstrap.js",
  "lib/3rd/underscore.js",
  "lib/3rd/backbone.js",
  "lib/3rd/handlebars.js",
  "lib/3rd/prettydate.js",
  "lib/3rd/i18n.js",
  "dist/templates.js",
  "lib/handlebars-helpers.js",
  "lib/twitch-api.js",
  "lib/app.js",

  "lib/popup.js",
  "lib/routes.js",
  "lib/init.js",
]

scripts = scripts.map(function (v){
  return self.data.url("common/" + v);
})

var panel = panels.Panel({
  contentURL          : self.data.url("common/html/popup.html"),
  width               : 440,
  height              : 590,
  onHide              : onPanelHide,
  contentScriptFile   : scripts,
  badge               : {
    text : "+1",
    color: "#5fc24f" // any CSS color syntax is valid
  },
  contentScriptOptions: {
    dataURL        : self.data.url(""),
    locale         : i18n.locale,
    defaultMessages: i18n.defaultMessages,
    messages       : i18n.messages
  },
  contentScriptWhen   : "ready"
});


twitchNow.listen(panel);

panel.port.on("OAUTH2_AUTH", function (){
  panel.hide();
  twitchOauth.authorize(function (){
    panel.port.emit("OAUTH2_TOKEN", twitchOauth.getAccessToken());
  })
});

panel.port.on("OAUTH2_REVOKE", function (){
  twitchOauth.clearAccessToken();
  panel.port.emit("OAUTH2_TOKEN", twitchOauth.getAccessToken());
})

panel.port.on("OAUTH2_TOKEN", function (){
  panel.port.emit("OAUTH2_TOKEN", twitchOauth.getAccessToken());
});

panel.port.on("XHR_PROXY", function (xhr){

  var method = xhr.method.toLowerCase();

  var guid = xhr.guid;

  var r = Request({
    url       : xhr.url,
    content   : xhr.requestBody,
    headers   : xhr.requestHeaders,
    onComplete: function (response){
      var res = {
        guid      : guid,
        status    : response.status,
        statusText: response.statusText,
        text      : response.text,
        headers   : response.headers
      }

      panel.port.emit("XHR_PROXY_RESPONSE", res);
    }
  });

  r[method]();
})

var button = buttons.ToggleButton({
  id      : "twitch-now",
  label   : "Twitch Now",
  icon    : {
    "16": self.data.url("common/icons/16_1.png"),
    "32": self.data.url("common/icons/32_1.png")
  },
  onChange: onButtonStateChange
});

function onButtonStateChange(state){
  if ( state.checked ) {
    panel.show({
      position: button
    });
  }
}

function onPanelHide(){
  button.state('window', {checked: false});
}