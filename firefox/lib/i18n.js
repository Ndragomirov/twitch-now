const {components,Ci} = require("chrome");


var self = require("sdk/self");
var xhr = require("sdk/net/xhr");

var defaultLocale = "en";


var getLocaleList = function (){
  var localesFile = self.data.url("common/dist/locales.json");
  var _xhr = new xhr.XMLHttpRequest();
  _xhr.open("GET", localesFile, false);
  _xhr.send();
  return JSON.parse(_xhr.responseText);
}

var localeList = getLocaleList();

var getLocaleMessages = function (localeList, id){
  var noPrefixId = id.split("_")[0];

  return localeList[id] || localeList[noPrefixId] || localeList[defaultLocale];
}


var locale = components.classes["@mozilla.org/chrome/chrome-registry;1"]
  .getService(components.interfaces.nsIXULChromeRegistry)
  .getSelectedLocale('global');

exports.locale = locale;
exports.defaultLocale = defaultLocale;
exports.defaultMessages = getLocaleMessages(localeList, defaultLocale);
exports.messages = getLocaleMessages(localeList, locale);