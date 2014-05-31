(function (){

  var root = this;

  var bgApp = root.bgApp = {};

  bgApp.notificationIds = {};

  var localStorage = root.localStorage;

  bgApp.del = function (/*keys*/){
    for ( var i = 0; i < arguments.length; i++ ) {
      delete localStorage[arguments[i]];
    }
  };

  bgApp.get = function (key){
    return  localStorage.hasOwnProperty(key) ?
      JSON.parse(localStorage[ key ]) :
      undefined;
  };

  bgApp.set = function (key, val){
    localStorage[ key ] = JSON.stringify(val);
  };

  bgApp.getOSName = function (){
    var OSName = "Unknown OS";
    if ( navigator.appVersion.indexOf("Win") != -1 ) OSName = "Windows";
    if ( navigator.appVersion.indexOf("Mac") != -1 ) OSName = "MacOS";
    if ( navigator.appVersion.indexOf("X11") != -1 ) OSName = "UNIX";
    if ( navigator.appVersion.indexOf("Linux") != -1 ) OSName = "Linux";
    return OSName;
  };

  bgApp.growlNotificationsSupported = function (){
    return utils.notifications.growlNotificationsSupported();
  };

  bgApp.richNotificationsSupported = function (){
    return utils.notifications.richNotificationsSupported();
  };

  bgApp.htmlNotificationsSupported = function (){
    return utils.notifications.htmlNotificationsSupported();
  };

  bgApp.bindNotificationListeners = function (){

    if ( bgApp.richNotificationsSupported() ) {
      chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex){
        utils.tabs.create({ url: "http://twitch.tv/directory/following"});
      });

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
    var defaultIcon = utils.runtime.getURL("common/icons/64_2.png");
    var streamsToShow = streamList.slice(0, displayCount);
    var streamTitles = streamsToShow.map(function (c){
      return c.get("channel").display_name;
    });

    if ( bgApp.growlNotificationsSupported() ) {
      var opts = {title: "Twitch Now", text: streamTitles.join("\n"), iconURL: defaultIcon};
      if ( streamTitles.length == 1 ) {
        opts.data = streamsToShow[0].getStreamURL();
      }
      utils.notifications.create(opts);
    }

    if ( bgApp.htmlNotificationsSupported() ) {
      console.log("html notifications supported");
      //close all previous opened windows
      var notificationWindows = chrome.extension.getViews({
        type: 'notification'
      });
      notificationWindows.forEach(function (window){
        window.close();
      });
      var n = webkitNotifications.createHTMLNotification(chrome.runtime.getURL("common/html/notification.html"));
      setTimeout(function (){
        n.cancel();
      }, 8000);
      n.show();
    }
    if ( bgApp.richNotificationsSupported() ) {
      console.log("rich notifications supported");

      var buttons = [
        {title: utils.i18n.getMessage("m54")}
      ];
      var items = streamTitles.map(function (t){
        return {title: t, message: ""}
      });
      var isSingle = streamsToShow.length === 1;

//      var iconImage = streamsToShow.length > 1 ? defaultIcon : streamsToShow[0].get("preview").small;

      var notificationId = _.uniqueId("TwitchNow.Notification.");

      try {
        var opt = {
          type   : "list",
          title  : "",
          message: "",
          iconUrl: defaultIcon,
          buttons: buttons,
          items  : items
        }

        if ( isSingle ) {
          bgApp.notificationIds[notificationId] = streamsToShow[0];

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

  bgApp.audioSupported = function audioSupported(){
    var saved = audioSupported.val;
    if ( saved !== undefined ) {
      return saved;
    }
    audioSupported.val = true;
    try {
      new Audio();
    } catch (e) {
      audioSupported.val = false;
    }
    return audioSupported.val;
  };

  bgApp.playSound = function (path){
    var p = utils.runtime.getURL(path);
    new Audio(p).play();
  };

  bgApp.init = function (){
    bgApp.clearBadge();
  };

  var defaultSettings = [
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
        { id: "following", name: "__MSG_m67__" },
        { id: "browse", name: "__MSG_m68__"},
        { id: "topstreams", name: "__MSG_m69__"}
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
        { id: "viewers|1", name: "__MSG_m10__" },
        { id: "viewers|-1", name: "__MSG_m11__"},
        { id: "name|1", name: "__MSG_m12__"},
        { id: "name|-1", name: "__MSG_m13__" },
        { id: "created_at|-1", name: "__MSG_m14__" }
      ],
      show  : true,
      value : "viewers|-1"
    },
    {
      id    : "twitchDefaultLocale",
      desc  : "__MSG_m61__",
      type  : "select",
      select: true,
      opts  : [
        {id: "www", name: "__MSG_m63__"},
        {id: "ar", name: "ar"},
        {id: "bg", name: "bg"},
        {id: "ca", name: "ca"},
        {id: "cs", name: "cs"},
        {id: "da", name: "da"},
        {id: "de", name: "de"},
        {id: "el", name: "el"},
        {id: "en", name: "en"},
        {id: "en-gb", name: "en-gb"},
        {id: "es", name: "es"},
        {id: "fi", name: "fi"},
        {id: "fr", name: "fr"},
        {id: "he", name: "he"},
        {id: "hi", name: "hi"},
        {id: "hu", name: "hu"},
        {id: "id", name: "id"},
        {id: "it", name: "it"},
        {id: "ja", name: "ja"},
        {id: "ko", name: "ko"},
        {id: "lt", name: "lt"},
        {id: "lv", name: "lv"},
        {id: "nl", name: "nl"},
        {id: "no", name: "no"},
        {id: "pl", name: "pl"},
        {id: "pt-br", name: "pt-br"},
        {id: "ro", name: "ro"},
        {id: "ru", name: "ru"},
        {id: "sk", name: "sk"},
        {id: "sv", name: "sv"},
        {id: "th", name: "th"},
        {id: "tr", name: "tr"},
        {id: "vi", name: "vi"},
        {id: "zh-cn", name: "zh-cn"},
        {id: "zh-tw", name: "zh-tw"}
      ],
      show  : true,
      value : "www"
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
      value: "dark"
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
        {id: "popout", name: "__MSG_m17__"}
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
      id   : "notificationSound",
      desc : "__MSG_m8__",
      type : "radio",
      radio: true,
      show : true,
      opts : [
        {id: "common/audio/ding.ogg", name: "ding"},
        {id: "common/audio/chime.mp3", name: "chime"},
        {id: "common/audio/click.wav", name: "click"}
      ],
      value: "common/audio/ding.ogg"
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
        console.log("revoke");
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
        firefox: ["showBadge"],
        opera  : ["showDesktopNotification", "closeNotificationDelay"]
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

    saveToStorage: function (){
      bgApp.set("settings", this.toJSON());
    }
  });

  var SettingsGroup = Backbone.Model.extend();

  var Groups = Backbone.Collection.extend({
    model     : SettingsGroup,
    initialize: function (){

    }
  })

  var TwitchItemModel = Backbone.Model.extend({

    idAttribute: "_id",

    baseUrl: function (){
      return "http://LOCALE.twitch.tv".replace(/LOCALE/, settings.get("twitchDefaultLocale").get("value"));
    }
  });

  var Video = TwitchItemModel.extend();

  var Videos = Backbone.Collection.extend({
    model     : Video,
    channel   : null,
    updateData: function (){
      console.log("fetching channel videos", this.channel);
      twitchApi.send("channelVideos", {channel: this.channel, limit: 20}, function (err, res){
        if ( err ) {
          console.log("API error", err);
          return this.trigger("apierror");
        }
        res.videos.forEach(function (v){
          //video duration in min
          v.length = Math.ceil(v.length / 60);
        });
        this.reset(res.videos, {silent: true});
        this.trigger("update");
      }.bind(this));
    }
  });

  var Game = Backbone.Model.extend();

  var Games = Backbone.Collection.extend({
    model: Game,

    favorite: function (){
      var favoriteGamesIds = bgApp.get("favorite_games");
      favoriteGamesIds[this.get("id")] = 1;
      bgApp.set("favorite-games-ids", favoriteGamesIds);
      this.set("favorite", true);
    },

    unfavorite: function (){
      var favoriteGamesIds = bgApp.get("favorite_games");
      delete favoriteGamesIds[this.get("id")];
      bgApp.set("favorite-games-ids", favoriteGamesIds);
      this.set("favorite", false);
    },

    updateData: function (){
      clearTimeout(this.timeout);
      twitchApi.send("gamesTop", {}, function (err, res){
        this.timeout = setTimeout(this.updateData.bind(this), 5 * 60 * 1000);
        if ( err ) {
          console.log("GamesTop API error", err);
          return this.trigger("apierror");
        }
        res.top.forEach(function (g){
          g._id = g.game._id;
        });
        this.reset(res.top, {silent: true});
        this.trigger("update");
      }.bind(this));
    }
  });

  var Stream = TwitchItemModel.extend({

    initialize: function (){
      var channelName = this.get("channel").name;
      this.set({
          name      : channelName,
          created_at: Date.now()
        },
        {silent: true});
    },

    follow: function (cb){
      cb = cb || $.noop;
      var target = this.get("channel").name;
      twitchApi.send("follow", {target: target}, function (err, res){
        console.log("follow", err, res);
        if ( err ) return cb(err);
        this.trigger("follow", this.attributes);
        cb();
      }.bind(this));
    },

    unfollow: function (cb){
      cb = cb || $.noop;
      var target = this.get("channel").name;
      twitchApi.send("unfollow", {target: target}, function (err, res){
        console.log("unfollow", err, res);
        if ( err ) return cb(err);
        this.trigger("unfollow", this);
        cb();
      }.bind(this));
    },

    getStreamURL: function (type){
      type = type || settings.get("openStreamIn").get("value");

      var links = {
        newlayout: "/ID",
        popout   : "/ID/popout"
      };

      return this.baseUrl() + links[type].replace(/ID/, this.get("channel").name);
    },

    openStream: function (type){
      var url = this.getStreamURL(type);
      utils.tabs.create({ url: url });
    },

    openChat: function (){
      var openIn = settings.get("openChatIn").get("value");
      var href = this.baseUrl() + "/chat/embed?channel=ID&popout_chat=true".replace(/ID/, this.get("channel").name);

      if ( openIn == "newwindow" ) {
        utils.windows.create({url: href, width: 400});
      } else {
        utils.tabs.create({ url: href });
      }
    }
  });

  var FollowingStream = Stream.extend({
    initialize: function (){
      Stream.prototype.initialize.call(this);

      var notifyList = bgApp.get("notifyList") || [];

      this.set("following", true, {silent: true});
      this.set("notify", ~notifyList.indexOf(this.get("_id")), {silent: true});
    },

    notify: function (val){
      var notifyList = bgApp.get("notifyList") || []
        , id = this.get("_id");

      this.set("notify", val);
      console.log(id);

      //add to list
      if ( val ) {
        _.union(notifyList, [id]);
        //remove
      } else {
        _.without(notifyList, id);
      }
      console.log("notifyList", notifyList);

      bgApp.set("notifyList", notifyList);

      this.trigger("notify", this.get("notify"));
    }
  })

  var StreamCollection = Backbone.Collection.extend({

    model: Stream,

    twitchApi: twitchApi,

    initialize: function (){
      this.setComparator();
      settings.get("viewSort").on("change:value", function (){
        console.log("view sort changed");
        this.setComparator();
      }.bind(this));
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
    }
  });

  var FollowingCollection = StreamCollection.extend({

    model: FollowingStream,

    initialize: function (){
      setInterval(function (){
        this.notified = [];
      }.bind(this), 1000 * 60 * 60);

      this.on("unfollow", function (attr){
        this.remove(attr);
      }.bind(this));

      StreamCollection.prototype.initialize.call(this);
    },

    getNewStreams: function (){
      var ids = this.addedStreams;
      return this.filter(function (stream){
        return ~ids.indexOf(stream.get("_id"));
      });
    },

    addedStreams: [],
    notified    : [], //store notified streams id here
    updateData  : function (){
      var idsBeforeUpdate = this.pluck("_id");
      var idsAfterUpdate;

      clearTimeout(this.timeout);

      twitchApi.send("followed", {}, function (err, res){

        this.timeout = setTimeout(this.updateData.bind(this), settings.get("refreshInterval").get("value") * 60 * 1000);

        if ( err ) {
          console.log("Following API error", err);
          if ( err.status == 401 ) {
            return this.trigger("autherror", err);
          }
          return this.trigger("apierror", err);
        }
        this.set(res.streams, {silent: true});

        idsAfterUpdate = this.pluck("_id");
        this.addedStreams = _.difference(idsAfterUpdate, idsBeforeUpdate, this.notified);
        this.notified = _.union(this.addedStreams, this.notified);
        this.trigger("update");
      }.bind(this));
    }
  });

  var BrowsingCollection = StreamCollection.extend({
    game      : null,
    updateData: function (){
      console.log("fetching game streams", this.game);
      twitchApi.send("streams", {game: this.game, limit: 50}, function (err, res){
        if ( err ) {
          console.log("Following API error", err);
          return this.trigger("apierror");
        }
        this.reset(res.streams, {silent: true});
        this.trigger("update");
      }.bind(this));
    }
  });

  var TopStreamsCollection = StreamCollection.extend({
    updateData: function (){
      twitchApi.send("streams", {limit: 50}, function (err, res){
        this.timeout = setTimeout(this.updateData.bind(this), 5 * 60 * 1000);
        if ( err ) {
          console.log("Following API error", err);
          return this.trigger("apierror");
        }
        this.reset(res.streams, {silent: true});
        this.trigger("update");
      }.bind(this));
    }
  });

  var SearchCollection = StreamCollection.extend({
    query     : null,
    updateData: function (){
      twitchApi.send("searchStreams", {query: this.query, limit: 50}, function (err, res){
        if ( err ) {
          console.log("Following API error", err);
          return this.trigger("apierror");
        }
        this.reset(res.streams, {silent: true});
        this.trigger("update");
      }.bind(this));
    }
  });

  var Contributor = Backbone.Model.extend();

  var ContributorCollection = Backbone.Collection.extend({
    model     : Contributor,
    initialize: function (){
      this.url = "https://api.github.com/repos/ndragomirov/twitch-now/contributors";
      this.updateData();
    },
    updateData: function (){
      var self = this;
      $.ajax({ method: "GET", url: self.url})
        .done(function (contributors){
          self.reset(contributors, {silent: true});
          self.trigger("update");
        })
    }
  });

  var Donation = Backbone.Model.extend();

  var DonationCollection = Backbone.Collection.extend({
    model     : Donation,
    initialize: function (){
      this.url = "http://162.243.34.81:8080/payments";
      this.interval = 10 * 60 * 1000;
      this.updateData();
    },
    updateData: function (){
      var self = this;
      $.ajax({ method: "GET", url: self.url})
        .done(function (donations){
          self.reset(donations, {silent: true});
          self.trigger("update");
        })

      setTimeout(function (){
        self.updateData()
      }, self.interval);
    }
  });


  bgApp.bindNotificationListeners();

  var donations = root.donations = new DonationCollection;
  var contributors = root.contributors = new ContributorCollection;
  var settings = root.settings = new Settings;
  var following = root.following = new FollowingCollection;
  var browsing = root.browsing = new BrowsingCollection;
  var topstreams = root.topstreams = new TopStreamsCollection;
  var videos = root.videos = new Videos;
  var games = root.games = new Games;
  var search = root.search = new SearchCollection;
  var user = root.user = new User;

  var notify = function (){

    if ( following.addedStreams.length > 0 ) {
      if ( settings.get("showDesktopNotification").get("value") ) {
        bgApp.sendNotification(following.getNewStreams());
      }
      if ( settings.get("playNotificationSound").get("value") ) {
        bgApp.playSound(settings.get("notificationSound").get("value"));
      }
    }
  };

  function updateBadgeCount(){
    if ( settings.get("showBadge").get("value") ) {
      bgApp.setBadge(following.length);
    }
  }

  browsing.on("follow", function (stream){
    following.add(stream);
    following.addedStreams = [stream._id];
    notify();
    updateBadgeCount();
  });

  following.on("update", notify);
  following.on("update remove", updateBadgeCount);

  settings.on("change:value", function (model, value){
    switch (model.get("id")) {
      case "showBadge":
        onShowBadgeChange(value);
        break;
      default:
        break;
    }
  });

  function onShowBadgeChange(value){
    if ( value ) {
      updateBadgeCount();
    } else {
      bgApp.clearBadge();
    }
  }

  twitchApi.on("authorize", function (){
    following.updateData();
  })

  twitchApi.on("revoke", function (){
    following.reset();
    bgApp.clearBadge();
  });

  topstreams.updateData();
  games.updateData();

  bgApp.init();

}).call(this);

