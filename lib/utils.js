(function (){
  var root = this
    , CHROME = "chrome"
    , FIREFOX = "firefox"
    ;

  var that = {};

  var detectBrowser = function (){
    if ( typeof window.chrome == "undefined" ) {
      return FIREFOX;
    }
    return CHROME;
  }

  var browser = that.browser = detectBrowser();

  var detectBackground = function (){
    if ( browser == CHROME ) {
      return chrome.extension.getBackgroundPage() === this;
    }
    if ( browser == FIREFOX ) {
      return typeof window == "undefined";
    }
  }

  var background = that.background = detectBackground();

  var _tabs = that.tabs = {};

  _tabs.create = function (opts){
    if ( browser == CHROME ) {
      chrome.tabs.create({url: opts.url});
    }
    if ( browser == FIREFOX ) {
      tabs.open({ url: opts.url});
    }
  }

  var _windows = that._windows = {};

  _windows.create = function (opts){
    if ( browser == CHROME ) {
      chrome.windows.create({url: opts.url, type: "popup", focused: true });
    }
    if ( browser == FIREFOX ) {
      windows.create({url: opts.url});
    }
  }

  var _browserAction = that.browserAction = {};

  _browserAction.setBadgeText = function (opts){
    if ( browser == CHROME ) {
      chrome.browserAction.setBadgeText({
        text: opts.text
      })
    }
    if ( browser == FIREFOX ) {
//      throw new Error("Not Implemented");
    }
  }

  var _i18n = that.i18n = {};

  _i18n.getMessage = function (id){
    if ( browser == CHROME ) {
      return chrome.i18n.getMessage(id);
    }
    if ( browser == FIREFOX ) {
      return self.options.messages[id] && self.options.messages[id].message;
    }
  }

  var _runtime = that.runtime = {};

  _runtime.getURL = function (str){
    if ( browser == CHROME ) {
      return chrome.runtime.getURL(str);
    }
    if ( browser == FIREFOX ) {
      return "";
//      throw new Error("Not Implemented");
//      return self.data.url("my-panel-content.html");
    }
  }

  var notifications = that.notifications = {};

  notifications.richNotificationsSupported = function (){
    if ( browser == CHROME ) {
      return chrome.notifications && chrome.notifications.create;
    }
  }

  notifications.htmlNotificationsSupported = function (){
    if ( browser == CHROME ) {
      return window.webkitNotifications && window.webkitNotifications.createHTMLNotification;
    }
  }

  that._getBackgroundPage = function (){
    if ( browser == CHROME ) {
      return chrome.extension.getBackgroundPage();
    } else {
      return root;
    }
  }

  that._postMessage = function _postMessage(msg){
    if ( browser == FIREFOX ) {
      self.postMessage(msg);
    }
  }


  "runtime notifications i18n tabs windows".split(" ").forEach(function (impl){
    var interface = that[impl];
    for ( var fn in interface ) {
      var _fn = interface[fn];
//      interface[fn] = function() {
//
//      }
    }
  })

  root.utils = that;

}).call(this);