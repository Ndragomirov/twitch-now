var tabs = require("sdk/tabs");
var windows = require("sdk/windows").browserWindows;
var self = require("sdk/self");
var notifications = require("sdk/notifications");

var that = {};

that.tabs = {
  create: function (opts, panel){
    tabs.open({ url: opts.url});
    panel.hide();
  }
}

that.notifications = {
  create: function (opts){
    if ( opts.data ) {
      opts.onClick = function (data){
        var tabs = require("sdk/tabs");
        tabs.open({url: data});
      }
    }
    notifications.notify(opts);
  }
}

that.browserAction = {
  setBadgeText: function (opts, panel, button){
    button.badge = opts.text;
  },
  getBadgeText: function (opts, panel, button){
    return button.badge;
  }
}

that.windows = {
  create: function (opts, panel){
    windows.open({url: opts.url});
    panel.hide();
  }
}

that.listen = function (panel, button){
  panel.port.on("twitchnow", function (msg){
    var chunks = msg.command.split(".");
    var argument = msg.value;
    var module = chunks[0];
    var action = chunks[1];
    if ( module && action && that[module] && that[module][action] ) {
      that[module][action](argument, panel, button);
    }
  });
}

exports.twitchNow = that;

