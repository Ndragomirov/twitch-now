/*disable strict javascript error logs*/
require("sdk/preferences/service").set("javascript.options.strict", false);

var buttons = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var panels = require("sdk/panel");
var i18n = require("./i18n-ff.js");
var Request = require("sdk/request").Request;


console.log("\n\nI18N = ", i18n.locale);

var scripts = [
  "lib/3rd/sinon-xhr.js",
  "lib/3rd/xhr-proxy-ff.js",
  "lib/utils.js",
  "lib/3rd/jquery-1.8.2.min.js",
  "lib/3rd/bootstrap.min.js",
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
  return self.data.url(v);
})

var localStorage = require("sdk/simple-storage");

var panel = panels.Panel({
  contentURL          : self.data.url("html/popup.html"),
  width               : 440,
  height              : 590,
  onHide              : handleHide,
  contentScriptFile   : scripts,
  contentScriptOptions: {
    locale  : i18n.locale,
    messages: i18n.messages
  },
  contentScriptWhen   : "ready"
});

panel.port.on("XHR_PROXY", function (xhr){

//  console.log("\n Bacground xhr proxy = ", JSON.stringify(xhr, null, 4), "\n");
//  console.log("\n background xhr proxy = ", xhr.url, "\n");
//

  var method = xhr.method.toLowerCase();

  var guid = xhr.guid;

//  console.log("url", xhr.url);
//  console.log("method", method);
//  console.log("headers", xhr.requestHeaders);
  var r = Request({
    url       : xhr.url,
    content   : xhr.requestBody,
    headers   : xhr.requestHeaders,
//    overrideMimeType: "application/json",
    onComplete: function (response){
      var res = {
        guid      : guid,
        status    : response.status,
        statusText: response.statusText,
        text      : response.text,
        headers   : response.headers
      }

      console.log(res.text);

      panel.port.emit("XHR_PROXY_RESPONSE", res);
    }
  });

  r[method]();
})

var button = buttons.ToggleButton({
  id   : "twitch-now",
  label: "Twitch Now",
  icon : {
    "32": self.data.url("icons/32_1.png"),
    "64": self.data.url("icons/19_1.png")
  },

  onClick: function (){
//    console.log("Panel show");
    panel.show({
      position: button
    });
  }
});

function handleHide(){
//  console.log("Panel hide");
}