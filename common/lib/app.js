(function (){

  var root = this;

  var bgApp = root.bgApp = {};
  bgApp.notificationIds = {};
  bgApp.dispatcher = _.clone(Backbone.Events);

  var localStorage = root.localStorage;

  bgApp.del = function (/*keys*/){
    for ( var i = 0; i < arguments.length; i++ ) {
      delete localStorage[arguments[i]];
    }
  };

  bgApp.get = function (key){
    return key in localStorage ?
      JSON.parse(localStorage[key]) :
      undefined;
  };

  bgApp.set = function (key, val){
    localStorage[key] = JSON.stringify(val);
  };

  bgApp.getOSName = function (){
    var OSName = "Unknown OS";
    if ( navigator.appVersion.indexOf("Win") != -1 ) OSName = "Windows";
    if ( navigator.appVersion.indexOf("Mac") != -1 ) OSName = "MacOS";
    if ( navigator.appVersion.indexOf("X11") != -1 ) OSName = "UNIX";
    if ( navigator.appVersion.indexOf("Linux") != -1 ) OSName = "Linux";
    return OSName;
  };

  bgApp.richNotificationsSupported = function (){
    return utils.notifications.richNotificationsSupported();
  };

  bgApp.bindNotificationListeners = function (){

    if ( bgApp.richNotificationsSupported() ) {

      chrome.notifications.onClicked.addListener(function (notificationId){
        var stream = bgApp.notificationIds[notificationId];
        if ( stream ) {
          stream.openStream();
        }
        chrome.notifications.clear(notificationId, function (){

        });
      });

      chrome.notifications.onClosed.addListener(function (notificationId, byUser){
        delete bgApp.notificationIds[notificationId];
      });
    }
  };

  bgApp.sendNotification = function (streamList){
    var displayCount = 5;
    var opt;
    var defaultIcon = utils.runtime.getURL("common/icons/64_2.png");
    var streamsToShow = streamList.slice(0, displayCount);
    var isSingle = streamsToShow.length === 1;
    var streamTitles = streamsToShow.map(function (c){
      return c.get("channel").display_name;
    });

    if ( bgApp.richNotificationsSupported() ) {

      var notificationId = _.uniqueId("TwitchNow.Notification.");

      try {
        if ( isSingle ) {
          var singlePreview = streamsToShow[0].get("preview") && streamsToShow[0].get("preview").medium;
          opt = {
            type   : "basic",
            title  : streamsToShow[0].get("channel").display_name,
            message: streamsToShow[0].get("game") || "Games & Demos",
            iconUrl: defaultIcon
          }

          bgApp.notificationIds[notificationId] = streamsToShow[0];

        } else {
          opt = {
            type   : "basic",
            title  : "Twitch Now",
            message: streamTitles.join("\n"),
            iconUrl: defaultIcon
          }
        }
        chrome.notifications.create(notificationId, opt, function (){

        });

        setTimeout(function (){
          chrome.notifications.clear(notificationId, function (){
          });
        }, 10000);

      } catch (e) {
        delete bgApp.notificationIds[notificationId];
        console.log("Notification error: ", e);
      }
    }
  };

  bgApp.clearBadge = function (){
    bgApp.setBadge("");
  };

  bgApp.setBadge = function (text){
    text += "";
    text = text === "0" ? "" : text;
    utils.browserAction.setBadgeText({
      text: text
    })
  };

  bgApp.sound = new Audio();

  bgApp.stopSound = function (){
    if ( bgApp.sound ) {
      bgApp.sound.pause();
    }
  }

  bgApp.playSound = function (path, volume, loop){
    var sound = bgApp.sound;

    if ( typeof path === 'undefined' ) {
      return;
    }

    if ( typeof loop === 'undefined' ) {
      loop = false;
    }
    if ( typeof volume === 'undefined' ) {
      volume = 1;
    }

    if ( !/^data:audio/.test(path) ) {
      path = /^http/i.test(path) ? path : utils.runtime.getURL(path);
    }

    sound.src = path;
    sound.volume = volume;
    sound.loop = loop;
    sound.play();
  };

  bgApp.init = function (){
    bgApp.clearBadge();
  };

  var defaultSettings = [
    {
      id       : "streamLanguage",
      desc     : "__MSG_m102__",
      mcheckbox: true,
      type     : "mcheckbox",
      opts     : [
        {
          "id"  : "ru",
          "name": "Русский"
        },
        {
          "id"  : "en",
          "name": "English"
        },
        {
          "id"  : "da",
          "name": "Dansk"
        },
        {
          "id"  : "de",
          "name": "Deutsch"
        },
        {
          "id"  : "es",
          "name": "Español"
        },
        {
          "id"  : "fr",
          "name": "Français"
        },
        {
          "id"  : "it",
          "name": "Italiano"
        },
        {
          "id"  : "hu",
          "name": "Magyar"
        },
        {
          "id"  : "nl",
          "name": "Nederlands"
        },
        {
          "id"  : "no",
          "name": "Norsk"
        },
        {
          "id"  : "pl",
          "name": "Polski"
        },
        {
          "id"  : "pt",
          "name": "Português"
        },
        {
          "id"  : "sk",
          "name": "Slovenčina"
        },
        {
          "id"  : "fi",
          "name": "Suomi"
        },
        {
          "id"  : "sv",
          "name": "Svenska"
        },
        {
          "id"  : "vi",
          "name": "Tiếng Việt"
        },
        {
          "id"  : "tr",
          "name": "Türkçe"
        },
        {
          "id"  : "cs",
          "name": "Čeština"
        },
        {
          "id"  : "el",
          "name": "Ελληνικά"
        },
        {
          "id"  : "bg",
          "name": "Български"
        },
        {
          "id"  : "ar",
          "name": "العربية"
        },
        {
          "id"  : "th",
          "name": "ภาษาไทย"
        },
        {
          "id"  : "zh",
          "name": "中文"
        },
        {
          "id"  : "ja",
          "name": "日本語"
        },
        {
          "id"  : "ko",
          "name": "한국어"
        },
        {
          "id"  : "asl",
          "name": "American Sign Language"
        },
        {
          "id"  : "other",
          "name": "__MSG_m106__"
        }
      ],
      show     : true,
      value    : ''
    },
    {
      id   : "windowHeight",
      desc : "__MSG_m62__",
      range: true,
      show : false,
      type : "range",
      tip  : "px",
      min  : 360,
      max  : 590,
      value: 590
    },
    {
      id    : "defaultTab",
      desc  : "__MSG_m66__",
      type  : "select",
      select: true,
      opts  : [
        {id: "following", name: "__MSG_m67__"},
        {id: "browse", name: "__MSG_m68__"},
        {id: "topstreams", name: "__MSG_m69__"}
      ],
      show  : true,
      value : "following"
    },
    {
      id    : "viewSort",
      desc  : "__MSG_m1__",
      type  : "select",
      select: true,
      opts  : [
        {id: "viewers|1", name: "__MSG_m10__"},
        {id: "viewers|-1", name: "__MSG_m11__"},
        {id: "name|1", name: "__MSG_m12__"},
        {id: "name|-1", name: "__MSG_m13__"},
        {id: "game|1", name: "__MSG_m82__"},
        {id: "created_at|-1", name: "__MSG_m14__"}
      ],
      show  : true,
      value : "viewers|-1"
    },
    {
      id   : "themeType",
      desc : "__MSG_m55__",
      type : "radio",
      radio: true,
      opts : [
        {id: "dark", name: "__MSG_m56__"},
        {id: "white", name: "__MSG_m57__"}
      ],
      show : true,
      value: "white"
    },
    {
      id      : "simpleView",
      desc    : "__MSG_m65__",
      checkbox: true,
      type    : "checkbox",
      show    : true,
      value   : false
    },
    {
      id   : "openStreamIn",
      desc : "__MSG_m2__",
      type : "radio",
      radio: true,
      opts : [
        {id: "newlayout", name: "__MSG_m16__"},
        {id: "popout", name: "__MSG_m17__"},
        {id: "theatrelayout", name: "__MSG_m88__"},
        {id: "html5", name: "__MSG_m101__"}
      ],
      show : true,
      value: "newlayout"
    },
    {
      id   : "openChatIn",
      desc : "__MSG_m3__",
      type : "radio",
      radio: true,
      opts : [
        {id: "newwindow", name: "__MSG_m18__"},
        {id: "newtab", name: "__MSG_m19__"}
      ],
      show : true,
      value: "newwindow"
    },
    {
      id      : "showBadge",
      desc    : "__MSG_m4__",
      checkbox: true,
      type    : "checkbox",
      show    : true,
      value   : true
    },
    {
      id      : "hideVodcasts",
      desc    : "__MSG_m110__",
      checkbox: true,
      type    : "checkbox",
      show    : true,
      value   : false
    },
    {
      id      : "showDesktopNotification",
      desc    : "__MSG_m5__",
      checkbox: true,
      type    : "checkbox",
      show    : true,
      value   : true
    },
    {
      id   : "closeNotificationDelay",
      desc : "__MSG_m6__",
      range: true,
      type : "range",
      tip  : "sec",
      min  : 5,
      value: 8,
      max  : 60
    },
    {
      id      : "playNotificationSound",
      desc    : "__MSG_m7__",
      checkbox: true,
      show    : true,
      type    : "checkbox",
      value   : false
    },
    {
      id      : "loopNotificationSound",
      desc    : "__MSG_m99__",
      checkbox: true,
      show    : false,
      type    : "checkbox",
      value   : false
    },
    {
      id   : "notificationSound",
      desc : "__MSG_m8__",
      type : "radio",
      radio: true,
      show : true,
      opts : [
        {id: "common/audio/ding.ogg", name: "ding"},
        {id: "common/audio/chime.mp3", name: "chime"},
        {id: "common/audio/click.wav", name: "click"},
        {id: "customsound", name: "__MSG_m76__"}
      ],
      value: "common/audio/ding.ogg"
    },
    {
      id   : "notificationVolume",
      desc : "__MSG_m86__",
      range: true,
      show : true,
      type : "range",
      tip  : "%",
      min  : 1,
      max  : 100,
      value: 100
    },
    {
      id    : "customNotificationSound",
      desc  : "__MSG_m75__",
      button: true,
      show  : true,
      type  : "button",
      value : ""
    },
    {
      id   : "refreshInterval",
      desc : "__MSG_m9__",
      range: true,
      show : true,
      type : "range",
      tip  : "min",
      min  : 1,
      max  : 60,
      value: 5
    },
    {
      id    : "livestreamerQuality",
      desc  : "__MSG_m111__",
      type  : "select",
      select: true,
      opts  : [
        {id: "source", name: "source"},
        {id: "high", name: "high"},
        {id: "low", name: "low"},
        {id: "medium", name: "medium"},
        {id: "mobile", name: "mobile"}
      ],
      show  : true,
      value : "source"
    },
    {
      id   : "livestreamerPath",
      desc : "__MSG_m112__",
      type : "text",
      text : true,
      show : true,
      value: ""
    }
  ];

  var User = Backbone.Model.extend({
    userpic         : utils.runtime.getURL("common/icons/default_userpic.png"),
    initialize      : function (){
      var self = this;
      this.set({
        "authenticated": twitchApi.isAuthorized(),
        "logo"         : self.userpic,
        "name"         : "Twitchuser"
      });

      twitchApi.on("authorize", function (){
        self.populateUserInfo(function (){
        });
        self.set("authenticated", true);
      });

      twitchApi.on("revoke", function (){
        self.set("authenticated", false);
      });
    },
    populateUserInfo: function (cb){

      var self = this;

      twitchApi.send("user", {}, function (err, res){
        if ( !err ) {
          self.set({
            logo: res.logo || self.userpic,
            name: res.display_name
          })
        }
        cb(err, res);
      });
    },
    login           : function (){
      twitchApi.authorize();
    },
    logout          : function (){
      twitchApi.revoke();
    }
  });

  var Control = Backbone.Model.extend({

    initialize: function (){
      this.setShow();
    },

    setShow: function (){
      var hideControls = {
        chrome : [],
        firefox: [/*"showBadge"*/],
        opera  : []
      }

      var rbrowser = utils.rbrowser;
      var hideIds = hideControls[rbrowser];
      var selfId = this.get("id");
      if ( hideIds && ~hideIds.indexOf(selfId) ) {
        this.set("show", false);
      }
    },

    isValidValue: function (v){
      var type = this.get("type");

      if ( type == "checkbox" ) {
        if ( v === true || v === false ) {
          return true;
        }
        return false;
      }
      else if ( type == "radio" || type == "select" ) {
        var opts = this.get("opts");
        for ( var i = 0; i < opts.length; i++ ) {
          if ( opts[i].id === v ) {
            return true;
          }
        }
        return false;
      }
      else if ( type == "range" ) {
        var min = this.get("min")
          , max = this.get("max")
          ;
        v = parseInt(v, 10);

        if ( !isNaN(v) && v >= min && v <= max ) {
          return true;
        }
        return false;
      }
      else if ( type == 'mcheckbox' ) {
        return typeof v === 'string';
      }

      return false;
    }
  });

  var Settings = Backbone.Collection.extend({
    model: Control,

    initialize: function (){
      var storedSettings = bgApp.get("settings") || [];

      this.add(defaultSettings);

      this.forEach(function (control){
        var saved = _.find(storedSettings, function (storedControl){
          return storedControl.id === control.get("id");
        });

        if ( saved && saved.hasOwnProperty("value") && control.isValidValue(saved.value) ) {
          control.set("value", saved.value);
        }
      })

      this.saveToStorage();
      this.on("change", this.saveToStorage);
    },

    getNotificationSoundSource: function (){
      var val = this.get("notificationSound").get("value");
      return val == "customsound" ? localStorage["customSound"] : val;
    },

    saveToStorage: function (){
      bgApp.set("settings", this.toJSON());
    }
  });

  var TrackLastErrorMixin = {
    lastErrorMessage: "",
    initialize      : function (){
      //clear last message if update was successfull
      this.on("update", function (){
        this.lastErrorMessage = "";
      })
      this.on("error", function (err){
        console.log("\nNew error = ", err);
        this.lastErrorMessage = err;
        this.trigger("_error", this.lastErrorMessage);
      }.bind(this))
    }
  }

  var TwitchItemModel = Backbone.Model.extend({

    idAttribute: "_id",

    baseUrl: function (){
      return "http://www.twitch.tv";
    }
  });

  var UpdatableCollection = Backbone.Collection.extend({
    auto        : false, // auto updates every `timeout` interval
    pagination  : false,
    timeout     : 60 * 1000,
    pageQuery   : {
      offset: 0,
      limit : 20
    },
    defaultQuery: function (){
      return {
        limit : 50,
        offset: 0
      }
    },
    updating    : false,
    interval    : null,
    initialize  : function (){
      bgApp.dispatcher.on('popup-close', function (){
        this.rewind();
      }.bind(this))
    },
    rewind      : function (){
      if ( this.pagination ) {
        this.pageQuery.offset = 0;
        this.reset(this.slice(0, this.defaultQuery().limit).map(function (v){
          return v.attributes;
        }));
      }
    },
    send        : function (){
      throw new Error("Not implemented");
    },
    parse       : function (){
      throw new Error("Not Implemented");
    },
    beforeUpdate: function (){
    },
    afterUpdate : function (){
    },
    loadNext    : function (){
      if ( this.pagination && !this.updating ) {
        this.pageQuery.offset = this.length + 1;
        this.update(this.pageQuery, {add: true}, function (){
          console.log("loadNext() complete");
        })
      }
    },
    update      : function (query, opts, callback){
      query = $.extend({}, this.defaultQuery(), query);
      opts = opts || {reset: true};
      callback = callback || $.noop;

      clearTimeout(this.interval);

      //reset pagination
      if ( opts.reset ) {
        this.pageQuery.offset = 0;
      }

      this.updating = true;
      this.trigger("update-status", this.updating, {reset: opts.reset});
      this.beforeUpdate();
      this.send(query, function (err, res){
        console.log(err, res);
        this.updating = false;
        this.trigger("update-status", this.updating, {reset: opts.reset});

        if ( this.auto ) {
          this.interval = setTimeout(function (){
            this.update(this.defaultQuery(), {reset: true}, $.noop);
          }.bind(this), this.timeout);
        }

        if ( err ) {
          if ( err.status == 401 ) {
            this.trigger("error", "auth");
          } else {
            this.trigger("error", "api");
          }
          this.afterUpdate();
          return callback(err);
        }

        this.parse(res, function (err, result){
          if ( err ) {
            this.trigger("error", err.message);
            return callback(err);
          }
          if ( opts.reset ) {
            this.reset(result, {silent: true});
            this.afterUpdate();
            this.trigger("update");
          }

          if ( opts.add ) {
            var idsBefore = _.pluck(this.models, "id");
            this.add(result, {silent: true});
            var idsAfter = _.pluck(this.models, "id");
            var addedModels = _
              .difference(idsAfter, idsBefore)
              .map(function (id){
                return this.get(id);
              }.bind(this));

            this.afterUpdate();
            this.trigger("addarray", addedModels);
          }
          return callback(null);
        }.bind(this));

      }.bind(this));
    }
  })

  var Video = TwitchItemModel.extend();

  var Videos = UpdatableCollection.extend({
    model     : Video,
    pagination: true,

    send : function (query, callback){
      twitchApi.send(this.url, query, callback);
    },
    parse: function (res, callback){
      if ( !res ) {
        return callback(new Error("api"));
      }
      if ( Array.isArray(res.vods) ) {
        res.videos = res.vods;
      }
      if ( Array.isArray(res.videos) ) {
        res.videos = res.videos;
      }
      res.videos = res.videos || [];
      return callback(null, res.videos);
    }
  });

  var ChannelVideos = Videos.extend({
    url         : "channelVideos",
    channel     : null,
    defaultQuery: function (){
      return {
        channel: this.channel,
        limit  : 20
      }
    }
  })

  var GameVideos = Videos.extend({
    url         : "gameVideos",
    game        : null,
    defaultQuery: function (){
      return {
        game : this.game,
        limit: 20
      }
    }
  })

  var Game = Backbone.Model.extend({
    idAttribute: "_id",

    follow: function (cb){
      cb = cb || $.noop;
      var target = this.get("game").name;
      twitchApi.send("gameFollow", {name: target}, function (err, res){
        if ( err ) return cb(err);
        this.trigger("follow", this.attributes);
        bgApp.dispatcher.trigger("game:follow", this.attributes);
        cb();
      }.bind(this));
    },

    unfollow: function (cb){
      cb = cb || $.noop;
      var target = this.get("game").name;
      twitchApi.send("gameUnfollow", {name: target}, function (err, res){
        if ( err ) return cb(err);
        this.trigger("unfollow", this);
        bgApp.dispatcher.trigger("game:unfollow", this.attributes);
        cb();
      }.bind(this));
    }
  });

  var Games = UpdatableCollection.extend({
    auto      : true,
    pagination: true,
    timeout   : 5 * 60 * 1000,
    model     : Game,

    findByName: function (gameName){
      return this.find(function (g){
        return g.get("game").name == gameName;
      })
    },
    parse     : function (res, callback){
      if ( !res ) {
        return callback(new Error("api"));
      }
      res.top = Array.isArray(res.top) ? res.top : [];
      res.top.forEach(function (g){
        g._id = g.game._id;
      });
      return callback(null, res.top);
    },
    send      : function (query, callback){
      twitchApi.send("gamesTop", query, callback);
    }
  });

  var FollowingGames = Games.extend({
    auto      : true,
    pagination: false,
    timeout   : 5 * 60 * 1000,
    comparator: function (a){
      return -1 * a.get("viewers");
    },
    initialize: function (){
      var self = this;

      bgApp.dispatcher.on("game:follow", function (model){
        self.add(model);
      })

      bgApp.dispatcher.on("game:unfollow", function (model){
        self.remove(model._id);
      })

      twitchApi.on("authorize", function (){
        self.update();
      })

      twitchApi.on("revoke", function (){
        self.reset();
      });

    },
    send      : function (query, callback){
      twitchApi.send("followedgames", query, callback);
    },
    parse     : function (res, callback){
      if ( !res ) {
        return callback(new Error("api"));
      }
      res.follows = Array.isArray(res.follows) ? res.follows : [];
      res.follows.forEach(function (g){
        g._id = g.game._id;
      });
      return callback(null, res.follows);
    }
  })

  var ChannelNotification = Backbone.Model.extend({
    idAttribute    : "_id",
    defaults       : {
      notificationOpts: {
        desktop: true,
        sound  : true
      }
    },
    getProfileUrl  : function (){
      return "http://www.twitch.tv/" + this.get("channel").name + "/profile";
    },
    openProfilePage: function (){
      utils.tabs.create({url: this.getProfileUrl()});
    },
    initialize     : function (){

    }
  });

  var FollowedChannel = TwitchItemModel.extend({
    openChannelPage: function (){
      utils.tabs.create({url: this.get("channel").url})
    }
  })

  var FollowedChannels = Backbone.Collection.extend({
    model                   : FollowedChannel,
    updating                : false,
    initialize              : function (){
      twitchApi.on("revoke", function (){
        this.reset();
      }.bind(this));
    },
    comparator              : function (a){
      return a.get("channel").name;
    },
    getFollowedChannelsCount: function (cb){
      twitchApi.send("follows", {offset: 0, limit: 1}, function (err, res){
        if ( err || !res || !res._total ) {
          return cb(err || new Error("No Total channels"));
        }
        return cb(null, parseInt(res._total));
      })
    },
    getFollowedChannels     : function (page, cb){
      twitchApi.send("follows", {offset: page * 100, limit: 100}, function (err, res){
        if ( err || !res || !res.follows ) {
          return cb(err || new Error("No Total channels"));
        }

        res.follows.forEach(function (c){
          c._id = c.channel._id;
          c.channel.logo = c.channel.logo || "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_50x50.png";
          c.channel.logo = c.channel.logo.replace("300x300", "50x50");
        });
        return cb(null, res.follows);
      })
    },
    update                  : function (){
      var self = this;
      if ( self.updating ) {
        return;
      }
      self.updating = true;
      self.getFollowedChannelsCount(function (err, count){
        if ( err ) {
          self.updating = false;
          return self.trigger("error", "api");
        }
        var fns = [];
        var limit = 4;
        var requestCount = Math.ceil(count / 100);

        for ( var i = 0; i < requestCount; i++ ) {
          fns.push(self.getFollowedChannels.bind(null, i));
        }

        async.parallelLimit(fns, limit, function (err, results){
          self.updating = false;
          if ( err ) {
            return self.trigger("error", "api");
          } else {
            results = _.flatten(results);
            console.log("\nUpd success", results);
            self.reset(results, {silent: true});
            self.trigger("update");
          }
        })
      });
    }
  })

  var NotificationSettings = Backbone.Collection.extend({
    model: ChannelNotification,

    comparator: function (a){
      return a.get("channel").name;
    },

    initialize            : function (){
      _.extend(this, new Backbone.Memento(this));
      var self = this;

      twitchApi.on("revoke", function (){
        self.reset();
      })
    },
    loadFromStorage       : function (){
      if ( twitchApi.isAuthorized() ) {
        return bgApp.get("notifications_" + twitchApi.userName) || [];
      } else {
        this.trigger("error", "auth");
        return [];
      }
    },
    getChannelNotification: function (cid, type){
      var self = this;

      var channel = _.findWhere(self.loadFromStorage(), {_id: cid});
      if ( channel ) {
        return channel.notificationOpts[type];
      } else {
        return true;
      }
    },
    saveToStorage         : function (){
      if ( twitchApi.isAuthorized() ) {
        var val = this.map(function (v){
          return {
            "_id"             : v.get("_id"),
            "notificationOpts": v.get("notificationOpts")
          }
        });
        bgApp.set("notifications_" + twitchApi.userName, val);
      } else {
        this.trigger("error", "auth");
      }
    },
    update                : function (){
      var self = this;
      var channels = [];

      function getFollowedChannelsCount(cb){
        twitchApi.send("follows", {offset: 0, limit: 1}, function (err, res){
          if ( err || !res || !res._total ) {
            return cb(err || new Error("No Total channels"));
          }
          return cb(null, parseInt(res._total));
        })
      }

      function getFollowedChannels(count, cb){
        twitchApi.send("follows", {offset: count * 100, limit: 100}, function (err, res){
          if ( err || !res || !res.follows ) {
            return cb(err || new Error("No Total channels"));
          }

          res.follows.forEach(function (c){
            c._id = c.channel._id;
            c.channel.logo = c.channel.logo || "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_50x50.png";
            c.channel.logo = c.channel.logo.replace("300x300", "50x50");
          });
          channels = channels.concat(res.follows);

          return cb(null);
        })
      }

      getFollowedChannelsCount(function (err, count){
        var fns = [];
        var limit = 4;
        var requestCount = Math.ceil(count / 100);

        for ( var i = 0; i < requestCount; i++ ) {
          fns.push(getFollowedChannels.bind(null, i));
        }

        async.parallelLimit(fns, limit, function (err, results){
          if ( err ) {
            return self.trigger("error", "api");
          } else {
            self.reset(channels, {silent: true});
            //merge with stored notification preferences
            self.set(self.loadFromStorage(), {add: false, remove: false, merge: true, silent: true});
            self.trigger("update");
          }
        })
      });
    }
  })

  var Stream = TwitchItemModel.extend({

    defaults: {
      created_at: Date.now()
    },

    initialize: function (){
      var channelName = this.get("channel").name;
      var streamType = this.get("stream_type");
      var isVodcast = ['rerun', 'watch_party'].includes(streamType);
      this.set({
          vodcast: isVodcast,
          name   : channelName
        },
        {silent: true});
    },

    follow: function (cb){
      cb = cb || $.noop;
      var target = this.get("channel")._id;
      twitchApi.send("follow", {target: target}, function (err, res){
        if ( err ) return cb(err);
        this.trigger("follow", this.attributes);
        bgApp.dispatcher.trigger("stream:follow", this.attributes);
        cb();
      }.bind(this));
    },

    unfollow: function (cb){
      cb = cb || $.noop;
      var target = this.get("channel")._id;
      twitchApi.send("unfollow", {target: target}, function (err, res){
        if ( err ) return cb(err);
        this.trigger("unfollow", this);
        cb();
      }.bind(this));
    },

    getStreamURL: function (type){
      type = type || settings.get("openStreamIn").get("value");
      if ( type == "html5" ) {
        return "http://player.twitch.tv/?channel=" + this.get("channel").name + "&html5";
      }
      var links = {
        theatrelayout: "/ID?mode=theater",
        newlayout    : "/ID",
        popout       : "/ID/popout"
      };

      return this.baseUrl() + links[type].replace(/ID/, this.get("channel").name);
    },

    openMultitwitch: function (){
      var self = this;
      var url = "http://multitwitch.tv";
      var updatedTabUrl;
      utils.tabs.query({}, function (tabs){
        tabs = tabs.filter(function (t){
          return /https*:\/\/(www\.)*multitwitch\.tv/.test(t.url);
        })

        //update last tab with multitwitch
        if ( tabs.length ) {
          var tab = tabs[tabs.length - 1];
          var tabUrl = tab.url;
          updatedTabUrl = tabUrl + "/" + self.get("channel").name;
          utils.tabs.update(tab.id, {url: updatedTabUrl});
        } else {
          //creare new tab with multitwitch
          updatedTabUrl = url + "/" + self.get("channel").name;
          utils.tabs.create({url: updatedTabUrl, active: false});
        }
      });
    },

    openInLivestreamer: function (quality, path){
      var url = this.getStreamURL("newlayout");
      console.log("\nOpen livestreamer", url, quality, path);
      if ( utils.rbrowser == "firefox" ) {
        utils.runtime.sendMessage("LIVESTREAMER", {
          url    : url,
          quality: quality,
          path   : path
        });
      }
    },

    openStream: function (type){
      if ( type == "livestreamer" ) {
        this.openInLivestreamer(settings.get("livestreamerQuality").get("value"), settings.get("livestreamerPath").get("value"));
      } else {
        var url = this.getStreamURL(type);
        utils.tabs.create({url: url});
      }
    },

    openChat: function (){
      var openIn = settings.get("openChatIn").get("value");
      var href = this.baseUrl() + "/chat/embed?channel=ID&popout_chat=true".replace(/ID/, this.get("channel").name);

      if ( openIn == "newwindow" ) {
        utils.windows.create({url: href, width: 400});
      } else {
        utils.tabs.create({url: href});
      }
    }
  });

  var FollowingStream = Stream.extend({
    defaults: {
      favorite: true
    }
  })

  var StreamCollection = UpdatableCollection.extend({

    model: Stream,

    twitchApi: twitchApi,

    defaultQuery: function (){
      return {
        broadcaster_language: settings.get("streamLanguage").get("value"),
        limit               : 50,
        offset              : 0
      }
    },

    initialize: function (){
      UpdatableCollection.prototype.initialize.apply(this, arguments);
      this.setComparator();

      settings.get("viewSort").on("change:value", function (){
        this.setComparator();
      }.bind(this));

      settings.get("streamLanguage").on("change:value", function (){
        if ( this.length ) {
          this.update();
        }
      }.bind(this))
    },

    setComparator: function (){
      var curSort = settings.get("viewSort").get("value").split("|");
      var prop = curSort[0];
      var reverse = parseInt(curSort[1], 10);

      this.comparator = function (a, b){
        return a.get(prop) > b.get(prop) ? 1 * reverse
          : a.get(prop) < b.get(prop) ? -1 * reverse : 0;
      };
      this.sort();
    },

    parse: function (res, callback){
      if ( !res ) {
        return callback(new Error("api"));
      }
      res.streams = Array.isArray(res.streams) ? res.streams : [];
      if ( settings.get("hideVodcasts").get("value") ) {
        res.streams = res.streams.filter(function (v){
          if ( ['rerun', 'watch_party'].includes(v.stream_type) ) {
            return false;
          }
          return true;
        })
      }
      return callback(null, res.streams);
    }
  });

  var Hosts = StreamCollection.extend({
    pagination: false,
    auto      : true,
    timeout   : 5 * 60 * 1000,
    model     : Stream,
    initialize: function (){
      var self = this;

      twitchApi.on("authorize", function (){
        self.update();
      })

      twitchApi.on("revoke", function (){
        self.reset();
      });

      StreamCollection.prototype.initialize.call(this);
    },
    parse     : function (res, callback){
      console.log(res.hosts);
      if ( !res || !res.hosts ) {
        return callback(new Error("api"));
      }
      var streams = res.hosts.map(function (host){
        return Object.assign(
          {},
          host.target,
          {
            host: _.pick(host, 'display_name', 'id', 'name')
          }
        );
      })

      callback(null, streams);
    },
    send      : function (query, callback){
      console.log("hosts", arguments);
      twitchApi.send("hosts", {}, callback);
    }
  })

  var FollowingStreams = StreamCollection.extend({
    pagination: false,
    auto      : true,
    timeout   : 5 * 60 * 1000,
    model     : FollowingStream,

    defaultQuery: function (){
      return {
        limit : 100,
        offset: 0
      }
    },

    initialize: function (){
      var self = this;

      setInterval(function (){
        self.notified = [];
      }, 1000 * 60 * 10);

      settings.get("refreshInterval").on("change:value", function (){
        self.timeout = settings.get("refreshInterval").get("value") * 60 * 1000;
      });

      bgApp.dispatcher.on("stream:follow", function (model){
        self.add(model);
      })

      this.on("unfollow", function (attr){
        self.remove(attr);
      });

      this.on("add update remove reset", function (){
        badge.set("count", this.length);
      });

      this.on("update", function (){
        self.notify();
      });

      this.on("add", function (stream){
        self.addedStreams = [stream.id];
        self.notify();
      })

      twitchApi.on("authorize", function (){
        self.update();
      })

      twitchApi.on("revoke", function (){
        self.reset();
      });

      StreamCollection.prototype.initialize.call(this);
    },

    getNewStreams: function (){
      var ids = this.addedStreams;
      return this.filter(function (stream){
        return ~ids.indexOf(stream.get("channel")._id);
      });
    },

    addedStreams   : [],
    idsBeforeUpdate: [],
    idsAfterUpdate : [],
    notified       : [], //store notified streams id here
    notify         : function (){
      var self = this;

      twitchApi.getUserName(function (){
        //notify about all streams if error happens
        var desktopNotifications = self.getNewStreams()
          .filter(function (stream){
            return notifications.getChannelNotification(stream.get("channel")._id, "desktop")
          })

        var soundNotifications = self.getNewStreams()
          .filter(function (stream){
            return notifications.getChannelNotification(stream.get("channel")._id, "sound")
          })

        if ( desktopNotifications.length && settings.get("showDesktopNotification").get("value") ) {
          bgApp.sendNotification(desktopNotifications);
        }

        if ( soundNotifications.length && settings.get("playNotificationSound").get("value") ) {
          bgApp.playSound(
            settings.getNotificationSoundSource(),
            settings.get("notificationVolume").get("value") / 100,
            settings.get("loopNotificationSound").get("value")
          );
        }
      })

    },
    beforeUpdate   : function (){
      this.idsBeforeUpdate = this.pluck("channel").map(function (v){
        return v._id;
      });
    },
    send           : function (query, callback){
      twitchApi.send("followed", {}, callback);
    },
    afterUpdate    : function (){
      this.idsAfterUpdate = this.pluck("channel").map(function (v){
        return v._id;
      })

      this.addedStreams = _.difference(this.idsAfterUpdate, this.idsBeforeUpdate, this.notified);
      this.notified = _.union(this.addedStreams, this.notified);
    }
  });

  var GameLobby = Game.extend({

    lastChange: 0,

    change: function (gameName){
      var newGame = games.findByName(gameName) || followedgames.findByName(gameName);
      if ( newGame ) {
        console.log("lastchange", this.lastChange);
        if ( !this.get("game") || newGame.get("game").name != this.get("game").name || ( Date.now() - this.lastChange ) > 5 * 1000 * 60 ) {
          this.set(newGame.toJSON());
          this.lastChange = Date.now();
          bgApp.dispatcher.trigger("gameLobby:change", gameName);
        }
      }
    }
  })

  var GameStreams = StreamCollection.extend({
    game                 : null,
    enableLanguage       : true,
    langFilter           : true,
    pagination           : true,
    initialize           : function (){
      StreamCollection.prototype.initialize.apply(this, arguments);
      bgApp.dispatcher.on('popup-close', function (){
        this.enableLanguageFilter();
      }.bind(this))
    },
    disableLanguageFilter: function (){
      this.langFilter = false;
    },
    enableLanguageFilter : function (){
      this.langFilter = true;
    },
    send                 : function (query, callback){
      query.game = this.game;
      if ( !this.langFilter ) {
        delete query.broadcaster_language;
      }
      twitchApi.send("streams", query, callback);
    }
  });

  var GameLobbyStreams = GameStreams.extend({
    initialize: function (){
      bgApp.dispatcher.on("gameLobby:change", function (game){
        this.game = game;
        this.update();
      }.bind(this));
      GameStreams.prototype.initialize.apply(this, arguments);
    }
  })

  var GameLobbyVideos = GameVideos.extend({
    initialize: function (){
      bgApp.dispatcher.on("gameLobby:change", function (game){
        this.game = game;
        this.update();
      }.bind(this));
      GameVideos.prototype.initialize.apply(this, arguments);
    }
  })

  var TopStreams = StreamCollection.extend({
    auto      : true,
    pagination: true,
    timeout   : 5 * 60 * 1000,
    send      : function (query, callback){
      twitchApi.send("streams", query, callback);
    }
  });

  var Search = StreamCollection.extend({
    query     : null,
    pagination: true,
    send      : function (query, callback){
      query.query = this.query;
      twitchApi.send("searchStreams", query, callback);
    }
  });

  var Contributor = Backbone.Model.extend();

  var Contributors = Backbone.Collection.extend({
    model     : Contributor,
    initialize: function (){
      this.add(contributorList);
    }
  });

  var Badge = Backbone.Model.extend({
    defaults         : {
      count: 0
    },
    initialize       : function (){
      var self = this;
      utils.browserAction.setBadgeBackgroundColor({"color": [100, 100, 100, 255]});


      self.on("change:count", function (){
        if ( settings.get("showBadge").get("value") ) {
          bgApp.setBadge(self.get("count"));
        }
      });

      settings.on("change:value", function (model, value){
        if ( model.get("id") == "showBadge" ) {
          self.onShowBadgeChange(value);
        }
      });
    },
    onShowBadgeChange: function (value){
      if ( value ) {
        bgApp.setBadge(this.get("count"));
      } else {
        bgApp.clearBadge();
      }
    }
  })

  bgApp.bindNotificationListeners();

  StreamCollection.mixin(TrackLastErrorMixin);
  Games.mixin(TrackLastErrorMixin);
  FollowingStreams.mixin(TrackLastErrorMixin);
  TopStreams.mixin(TrackLastErrorMixin);
  Videos.mixin(TrackLastErrorMixin);
  FollowingGames.mixin(TrackLastErrorMixin);
  Search.mixin(TrackLastErrorMixin);

  var settings = root.settings = new Settings;
  var badge = root.badge = new Badge;
  var notifications = root.notifications = new NotificationSettings;
  var contributors = root.contributors = new Contributors;
  var following = root.following = new FollowingStreams;
  var followedgames = root.followedgames = new FollowingGames;
  var topstreams = root.topstreams = new TopStreams;
  var videos = root.videos = new ChannelVideos;
  var games = root.games = new Games;
  var search = root.search = new Search;
  var user = root.user = new User;
  var gameLobby = root.gameLobby = new GameLobby;
  var gameVideos = root.gameVideos = new GameLobbyVideos;
  var gameStreams = root.gameStreams = new GameLobbyStreams;
  var followedChannels = root.followedChannels = new FollowedChannels;
  // var hosts = root.hosts = new Hosts;

  topstreams.update();
  games.update();

  bgApp.init();

}).call(this);
