(function (){
  "use strict";

  var root = this;
  var isFirefox = utils.rbrowser == "firefox";

  var TwitchApi = root.TwitchApi = function (clientId){
    if ( !clientId ) throw new Error("clientId is required");
    this.basePath = "https://api.twitch.tv/kraken";
    this.userName = "";
    this.clientId = clientId;
    this.timeout = 10 * 1000;
    this.token = "";
    _.extend(this, Backbone.Events);
    this.listen();
  }

  TwitchApi.prototype.isAuthorized = function (){
    return !!this.token;
  }

  TwitchApi.prototype.authorize = function (){
    if ( isFirefox ) {
      self.port.emit("OAUTH2_AUTH");
    } else {
      twitchOauth.authorize(function (){
      })
    }
  }

  TwitchApi.prototype.revoke = function (){
    if ( this.token && this.token.length > 0 ) {
      if ( isFirefox ) {
        self.port.emit("OAUTH2_REVOKE");
      } else {
        twitchOauth.clearAccessToken();
      }
    }
  }

  TwitchApi.prototype.getRequestParams = function (){
    return {
      timeout : this.timeout,
      dataType: "json",
      headers : {
        "Accept"       : "application/vnd.twitchtv.v3+json",
        "Client-ID"    : this.clientId,
        "Authorization": " OAuth " + this.token
      }
    }
  }

  TwitchApi.prototype.listen = function (){

    var _self = this;

    this.on("tokenchange", function (accessToken){
      _self.token = accessToken;
      if ( accessToken ) {
        _self.trigger("authorize");
      } else {
        _self.userName = "";
        _self.trigger("revoke");
      }
    });

    if ( isFirefox ) {
      self.port.on("OAUTH2_TOKEN", function (accessToken){
        _self.trigger("tokenchange", accessToken);
      })
      self.port.emit("OAUTH2_TOKEN");
    } else {
      twitchOauth.on("OAUTH2_TOKEN", function (){
        _self.trigger("tokenchange", twitchOauth.getAccessToken());
      })
    }
  }

  TwitchApi.prototype.getUserName = function (cb){
    var _self = this
      , userName = _self.userName
      , err = {
        err: "cant get current username"
      }
      , req = {
        url: _self.basePath + "/"
      }
      ;
    if ( userName ) return cb(null, userName);

    $.ajax($.extend(true, req, _self.getRequestParams()))
      .fail(function (xhr){
        if ( xhr.status == 401 ) {
          _self.revoke();
        }
        return cb(err);
      })
      .done(function (res){
        if ( !res.token.user_name ) {
          return cb(err);
        }
        _self.userName = userName = res.token.user_name;
        return cb(null, userName);
      });
  }

  TwitchApi.prototype.send = function (methodName, opts, cb){
    var _self = this;

    var requestOpts = _self.methods[methodName]();

    var getUserName = requestOpts.url.match(/:user/) ?
      _self.getUserName :
      function (fn){
        return fn();
      }

    requestOpts.url = requestOpts.url.replace(/:(\w+)/g, function (substr, match){
      return opts[match] || ":" + match;
    });

    getUserName.call(_self, function (err, userName){
      cb = cb || $.noop;
      if ( err ) return cb(err);

      //rewrite basePath if full url provided by requestOpts
      requestOpts.url = /^http/.exec(requestOpts.url) ? requestOpts.url : _self.basePath + requestOpts.url;
      requestOpts.url = requestOpts.url.replace(/:user/, userName);
      requestOpts = $.extend(true, requestOpts, {data: opts}, _self.getRequestParams());
      $.ajax(requestOpts)
        .done(function (data){
          //workaround for inconsistent API preview returns
          if ( /^(streams|searchStreams|followed)$/.test(methodName) ) {
            if ( data.streams && data.streams.length ) {
              data.streams = data.streams.map(function (s){
                if ( s.preview && typeof s.preview == "string" ) {
                  var medium = s.preview;
                  s.preview = {
                    medium: medium
                  }
                }
                return s;
              })
            }
          }
          _self.trigger("done:" + methodName);
          cb(null, data);
        })
        .fail(function (xhr){
//          if ( xhr.status == 401 ) {
//            _self.revoke();
//          }
          _self.trigger("fail:" + methodName);
          cb({err: "err" + methodName, status: xhr.status});
        })
    });
  }

  var methods = TwitchApi.prototype.methods = {};

  methods.base = function (){
    return {
      type: "GET",
      url : "/"
    }
  }

  methods.user = function (){
    return {
      type: "GET",
      url : "/user"
    }
  }

  methods.gameVideos = function (){
    return {
      type: "GET",
      url : "/videos/top"
    }
  }

  methods.channelVideos = function (){
    return {
      type: "GET",
      url : "/channels/:channel/videos"
    }
  }

  methods.searchGames = function (){
    return {
      type: "GET",
      url : "/search/games",
      data: {
        limit: 50
      }
    }
  }

  methods.searchStreams = function (){
    return {
      type: "GET",
      url : "/search/streams",
      data: {
        limit: 50
      }
    }
  }

  methods.gamesTop = function (){
    return {
      type: "GET",
      url : "/games/top",
      data: {
        limit: 40
      }
    }
  }

  methods.follows = function (){
    return {
      type: "GET",
      url : "/users/:user/follows/channels",
      data: {
        limit: 100
      }
    }
  }

  methods.followedgames = function (){
    return {
      type: "GET",
      url : "http://api.twitch.tv/api/users/:user/follows/games/live",
      data: {
        limit: 100
      }
    }
  }

  methods.gameFollow = function (){
    return {
      type: "PUT",
      url : "http://api.twitch.tv/api/users/:user/follows/games/follow"
    }
  }

  methods.gameUnfollow = function (){
    return {
      type: "DELETE",
      url : "http://api.twitch.tv/api/users/:user/follows/games/unfollow"
    }
  }

  methods.follow = function (){
    return {
      type: "PUT",
      url : "/users/:user/follows/channels/:target"
    }
  }

  methods.unfollow = function (){
    return {
      type: "DELETE",
      url : "/users/:user/follows/channels/:target"
    }
  }

  methods.followed = function (){
    return {
      type: "GET",
      url : "/streams/followed",
      data: {
        limit: 100
      }
    }
  }

  methods.streams = function (){
    return {
      type: "GET",
      url : "/streams",
      data: {
        limit: 50
      }
    }
  }

  root.twitchApi = new TwitchApi(utils.getConstants().twitchApi.client_id);

}).call(this);
