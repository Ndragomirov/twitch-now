(function (){
  var root = this
    , OPERA = "opera"
    , CHROME = "chrome"
    , FIREFOX = "firefox"
    ;

  var isFirefox = !!root.browser;
  var _browser = chrome;

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

  var _tabs = that.tabs = {};

  _tabs.create = function (opts){
    _browser.tabs.create({url: opts.url});
  }

  _tabs.update = function (tabId, opts){
    _browser.tabs.update(tabId, opts);
  }

  _tabs.query = function (opts, callback){
    _browser.tabs.query(opts, callback);
  }

  var _windows = that.windows = {};

  _windows.create = function (opts){
    var defaults = {url: opts.url, type: "popup"};
    if ( !isFirefox ) {
      defaults.focused = true;
    }
    _browser.windows.create(defaults);
  }

  var _browserAction = that.browserAction = {};

  _browserAction.setBadgeText = function (opts){
    _browser.browserAction.setBadgeText({
      text: opts.text
    })
  }

  _browserAction.setBadgeBackgroundColor = function(color){
    _browser.browserAction.setBadgeBackgroundColor(color);
  }

  var _i18n = that.i18n = {};

  _i18n.getMessage = function (id){
    return _browser.i18n.getMessage(id);
  }

  var _runtime = that.runtime = {};

  _runtime.getURL = function (str){
    return _browser.runtime.getURL(str);
  }

  _runtime.getVersion = function (){
    _browser.runtime.getManifest().version;
  }

  _runtime.sendMessage = function (type, args){
    _browser.runtime.sendMessage({type: type, args: args});
  }

  var notifications = that.notifications = {};

  notifications.richNotificationsSupported = function (){
    return _browser.notifications && _browser.notifications.create;
  }

  that._getBackgroundPage = function (){
    return _browser.extension.getBackgroundPage();
  }

  that.getConstants = function (){
    return root.constants;
  }

  root.utils = that;

}).call(this);