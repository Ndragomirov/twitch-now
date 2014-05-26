(function (){
  var root = this;
  var that = root.OAuth2 = {};

  that._adapters = {};

  var openTab = function (url){
    chrome.tabs.create({url: url});
  }

  var request = function (opts, callback){
    if ( root.require ) {
      var Request = require("sdk/request").Request;
      Request({
        url       : opts.url,
        content   : opts.data,
        onComplete: function (response){
          if ( response.status == 200 ) {
            callback(null, response.text);
          } else {
            callback(response.status);
          }
        }
      })[opts.method]()
    }

    if ( root.jQuery ) {
      console.log("using jquery", opts);
      var $ = root.jQuery;
      $.ajax({
        url : opts.url,
        type: opts.method,
        data: opts.data
      })
        .always(function (data, textStatus, jqXHR){
          if ( textStatus == "success" ) {
            callback(null, data);
          } else {
            callback(data);
          }
        });
    }
  }

  /**
   return ('https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&' +
   'client_id={{CLIENT_ID}}&' +
   'redirect_uri={{REDIRECT_URI}}&' +
   'scope={{API_SCOPE}}')

   * @param opts
   * @constructor
   */
  var Adapter = function (id, opts, flow){
    this.lsPath = "oauth2_" + id;
    this.opts = opts;
    this.flowType = this.opts.response_type;
    this.secret = this.opts.client_secret;
    delete this.opts.client_secret;
    this.flow = flow;
    this.codeUrl = opts.api + "?" + this.query(opts);
  }

  Adapter.prototype.del = function (/*keys*/){
    delete localStorage[this.lsPath];
  };

  Adapter.prototype.get = function (){
    return  localStorage.hasOwnProperty(this.lsPath) ?
      JSON.parse(localStorage[ this.lsPath ]) :
      undefined;
  };

  Adapter.prototype.set = function (val){
    localStorage[ this.lsPath ] = JSON.stringify(val);
  };

  Adapter.prototype.updateLocalStorage = function (){
    var stored = this.get();
    stored = stored || { accessToken: "" };
    stored.accessToken = stored.accessToken || "";
    this.set(stored);
  }

  Adapter.prototype.query = function (o){
    var res = [];
    for ( var i in o ) {
      res.push(encodeURIComponent(i) + "=" + encodeURIComponent(o[i]));
    }
    return res.join("&");
  }

  Adapter.prototype.parseAuthorizationCode = function (url){
    var error = url.match(/[&\?]error=([^&]+)/);
    if ( error ) {
      throw 'Error getting authorization code: ' + error[1];
    }
    return url.match(/[&\?]code=([\w\/\-]+)/)[1];
  }

  Adapter.prototype.authorize = function (callback){
    console.log("\nStarting auth process", callback);
    this._callback = callback;
    this.openTab();
  }

  Adapter.prototype.finalize = function (params){
    var self = this;
    var code;
    try {
      code = this.parseAuthorizationCode(params);
    } catch (e) {
      return this._callback(e);
    }

    this.getAccessAndRefreshTokens(code, function (err, data){
      if ( !err ) {
        var access_token = data.access_token;
        self.set({accessToken: access_token});
        self._callback();
      }
    })
  }

  /**
   *
   * @param authorizationCode
   * @param callback
   */
  Adapter.prototype.getAccessAndRefreshTokens = function (authorizationCode, callback){

    var method = this.flow.method;
    var url = this.flow.url;
    var data = this.opts;

    data["grant_type"] = "authorization_code";
    data["code"] = authorizationCode;
    data["client_secret"] = this.secret;

    request({url: url, method: method, data: this.opts}, callback)
  }

  Adapter.prototype.openTab = function (){
    openTab(this.codeUrl);
  }

  Adapter.prototype.hasAccessToken = function (){
    return this.get().hasOwnProperty("accessToken");
  }

  Adapter.prototype.getAccessToken = function (){
    return this.get().accessToken;
  }

  Adapter.prototype.clearAccessToken = function (){
    var data = this.get();
    delete data.accessToken;
    this.set(data);
  }

  var listen = function (){
    if ( root.require ) {

    }
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
      console.log("\nConent Message ", msg);

      try {
        msg = JSON.parse(msg);
      } catch (e) {
        return;
      }

      if ( msg.type == "OAUTH2" ) {

        var adapter = OAuth2.lookupAdapter(msg.value.url);
        if ( adapter ) {
          adapter.finalize(msg.value.params);
        }
        chrome.tabs.remove(sender.tab.id);
      }
    });
  }

  that.lookupAdapter = function (url){
    console.log("lookup adapter for url = ", url);
    var adapters = that._adapters;
    for ( var i in adapters ) {
      if ( adapters[i].opts.redirect_uri == url ) {
        return adapters[i];
      }
    }
  }

  that.listen = function (){
    listen();
  }

  that.addAdapter = function (opts){
    var id = opts.id;
    var adapter = that._adapters[id];
    if ( !adapter ) {
      adapter = that._adapters[id] = new Adapter(id, opts.opts, opts.codeflow);
    }
    return adapter;
  }

  that.listen();

}).call(this);