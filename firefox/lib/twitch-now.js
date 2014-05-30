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
    notifications.notify({
      title  : opts.title,
      text   : opts.text,
      iconURL: opts.iconURL
//      data   : "did gyre and gimble in the wabe",
//      onClick: function (data){
//        console.log(data);
//        // console.log(this.data) would produce the same result.
//      }
    });
  }
}

//that.notifications.create();

that.windows = {
  create: function (opts, panel){
    windows.open({url: opts.url});
    panel.hide();
  }
}

that.listen = function (panel){
  panel.port.on("twitchnow", function (msg){
    var chunks = msg.command.split(".");
    var argument = msg.value;
    var module = chunks[0];
    var action = chunks[1];
    if ( module && action && that[module] && that[module][action] ) {
      that[module][action](argument, panel);
    }
  });
}

exports.twitchNow = that;

