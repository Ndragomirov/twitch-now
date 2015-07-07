var tabs = require("sdk/tabs");
var windows = require("sdk/windows").browserWindows;
var self = require("sdk/self");
var notifications = require("sdk/notifications");

var that = {};

that.tabs = {
  create: function (opts, panel){
    tabs.open({url: opts.url});
    panel.hide();
  },

  query: function (opts, panel, button){
    var _tabs = [];
    for ( var i = 0; i < tabs.length; i++ ) {
      _tabs.push({url: tabs[i].url, id: tabs[i].id});
    }
    return _tabs;
  },

  update: function (opts, panel, button){
    for ( var i = 0; i < tabs.length; i++ ) {
      if ( tabs[i].id == opts.id ) {
        tabs[i].url = opts.url;
        break;
      }
    }
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
    var callbackId = msg.callbackId;

    var module = chunks[0];
    var action = chunks[1];
    if ( module && action && that[module] && that[module][action] ) {
      var result = that[module][action](argument, panel, button);
      if ( callbackId ) {
        panel.port.emit("twitchnow-callback", {value: result, callbackId: callbackId});
      }
    }
  });
}

exports.twitchNow = that;

