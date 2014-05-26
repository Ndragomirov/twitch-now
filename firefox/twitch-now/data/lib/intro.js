/*disable strict javascript error logs*/
require("sdk/preferences/service").set("javascript.options.strict", false);

var buttons = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var self = require("sdk/self");
var panels = require("sdk/panel");
var locale = require("sdk/l10n/core").locale;


var XMLHttpRequest = require("sdk/net/xhr");
var localStorage = require("sdk/simple-storage");


/*disable exports for javascript libs*/

var _exports = exports;
exports = undefined;
//var _require = require;
//require = undefined;