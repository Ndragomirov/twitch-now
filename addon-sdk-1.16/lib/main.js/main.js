//var jQuery = require("lib/3rd/jquery-1.8.2.min.js");
//var _ = require("lib/3rd/underscore.js");
//var Backbone = require("lib/3rd/backbone.js");
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  tabs.open("http://www.mozilla.org/");
}