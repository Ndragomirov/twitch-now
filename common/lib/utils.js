(function (){
  var root = this
    , OPERA = "opera"
    , CHROME = "chrome"
    , FIREFOX = "firefox"
    ;

  var that = {};

  var detectRealBrowser = function (){
    var ua = root.navigator && root.navigator.userAgent;

    if ( /opera|opr/i.test(ua) ) {
      return OPERA;
    }
    else if ( /chrome|crios|crmo/i.test(ua) ) {
      return CHROME;
    }
    else if ( /firefox|iceweasel/i.test(ua) ) {
      return FIREFOX;
    }
  }

  var rbrowser = that.rbrowser = detectRealBrowser();

  var detectBrowser = function (){
    if ( typeof root.chrome == "undefined" ) {
      return FIREFOX;
    }
    return CHROME;
  }

  var browser = that.browser = detectBrowser();

  var _tabs = that.tabs = {};

  var _callbacks = {};
  var callbackId = 0;

  if ( browser == FIREFOX ) {
    self.port.on("twitchnow-callback", function (opts){
      var callbackId = opts.callbackId;
      if ( _callbacks[callbackId] ) {
        _callbacks[callbackId](opts.value);
        delete _callbacks[callbackId];
      }
    });
  }

  function portEmit(){
    var callback = arguments[arguments.length - 1];
    if ( callback && typeof callback == "function" ) {
      _callbacks[++callbackId] = callback;
      arguments[1].callbackId = callbackId;
    }
    self.port.emit(arguments[0], arguments[1]);
  }

  _tabs.create = function (opts){
    if ( browser == CHROME ) {
      chrome.tabs.create({url: opts.url});
    }
    if ( browser == FIREFOX ) {
      portEmit("twitchnow", {command: "tabs.create", value: opts});
    }
  }

  _tabs.update = function (tabId, opts){
    if ( browser == CHROME ) {
      chrome.tabs.update(tabId, opts);
    }

    if ( browser == FIREFOX ) {
      opts.id = tabId;
      portEmit("twitchnow", {command: "tabs.update", value: opts});
    }
  }

  _tabs.query = function (opts, callback){
    console.log("\nTabs query", callback);
    if ( browser == CHROME ) {
      chrome.tabs.query(opts, callback);
    }

    if ( browser == FIREFOX ) {
      portEmit("twitchnow", {command: "tabs.query", value: opts}, callback);
    }
  }

  var _windows = that.windows = {};

  _windows.create = function (opts){
    if ( browser == CHROME ) {
      chrome.windows.create({url: opts.url, type: "popup", focused: true});
    }
    if ( browser == FIREFOX ) {
      portEmit("twitchnow", {command: "windows.create", value: {url: opts.url}});
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
      portEmit("twitchnow", {command: "browserAction.setBadgeText", value: {text: opts.text}});
    }
  }

  var _i18n = that.i18n = {};

  _i18n.getMessage = function (id){
    if ( browser == CHROME ) {
      return chrome.i18n.getMessage(id);
    }
    if ( browser == FIREFOX ) {
      if ( self.options.messages[id] ) {
        return self.options.messages[id].message;
      }
      if ( self.options.defaultMessages[id] ) {
        return self.options.defaultMessages[id].message;
      }
    }
  }

  var _runtime = that.runtime = {};

  _runtime.getURL = function (str){
    if ( browser == CHROME ) {
      return chrome.runtime.getURL(str);
    }
    if ( browser == FIREFOX ) {
      return self.options.dataURL + str;
    }
  }

  _runtime.getVersion = function (){
    if ( browser == CHROME ) {
      chrome.runtime.getManifest().version;
    } else {
      return self.options.version;
    }
  }

  _runtime.sendMessage = function (type, args){
    if ( browser == CHROME ) {
      chrome.runtime.sendMessage({type: type, args: args});
    }
    if ( browser == FIREFOX ) {
      portEmit(type, args);
    }
  }

  var notifications = that.notifications = {};

  notifications.create = function (opts){
    if ( browser == FIREFOX ) {
      portEmit("twitchnow", {command: "notifications.create", value: opts});
    }
  }

  notifications.richNotificationsSupported = function (){
    if ( browser == CHROME ) {
      return chrome.notifications && chrome.notifications.create;
    }
  }

  notifications.growlNotificationsSupported = function (){
    return browser == FIREFOX;
  }

  that._getBackgroundPage = function (){
    if ( browser == CHROME ) {
      return chrome.extension.getBackgroundPage();
    } else {
      return root;
    }
  }

  that.getConstants = function (){
    if ( browser == FIREFOX ) {
      return self.options.constants;
    } else {
      return root.constants;
    }
  }

  root.utils = that;

}).call(this);