"use strict";

var app = {};

var gm = chrome.i18n.getMessage;

app.notificationIds = {};

app.del = function (/*keys*/){
  for ( var i = 0; i < arguments.length; i++ ) {
    delete localStorage[arguments[i]];
  }
};

app.get = function (key){
  return  localStorage.hasOwnProperty(key) ?
    JSON.parse(localStorage[ key ]) :
    undefined;
};

app.set = function (key, val){
  localStorage[ key ] = JSON.stringify(val);
};

app.getChromeVersion = function (){
  return parseInt(window.navigator.appVersion.match(/Chrome\/(.*?) /)[1].split(".")[0]);
};

app.getOSName = function (){
  var OSName = "Unknown OS";
  if ( navigator.appVersion.indexOf("Win") != -1 ) OSName = "Windows";
  if ( navigator.appVersion.indexOf("Mac") != -1 ) OSName = "MacOS";
  if ( navigator.appVersion.indexOf("X11") != -1 ) OSName = "UNIX";
  if ( navigator.appVersion.indexOf("Linux") != -1 ) OSName = "Linux";
  return OSName;
};

app.richNotificationsSupported = function (){
  return chrome.notifications && chrome.notifications.create;
};

app.htmlNotificationsSupported = function (){

  return window.webkitNotifications && window.webkitNotifications.createHTMLNotification;
};

app.bindNotificationListeners = function (){

  if ( app.richNotificationsSupported() ) {
    chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex){
      chrome.tabs.create({ url: "http://twitch.tv/directory/following"});
    });

    chrome.notifications.onClicked.addListener(function (notificationId){
      var stream = app.notificationIds[notificationId];
      if ( stream ) {
        stream.openStream();
      }
      chrome.notifications.clear(notificationId, function (){

      });
    });

    chrome.notifications.onClosed.addListener(function (notificationId, byUser){
      delete app.notificationIds[notificationId];
    });
  }
};

app.sendNotification = function (streamList){
  if ( app.htmlNotificationsSupported() ) {
    console.log("html notifications supported");
    //close all previous opened windows
    var notificationWindows = chrome.extension.getViews({
      type: 'notification'
    });
    notificationWindows.forEach(function (window){
      window.close();
    });
    var n = webkitNotifications.createHTMLNotification("html/notification.html");
    setTimeout(function (){
      n.cancel();
    }, 8000);
    n.show();
  }
  else if ( app.richNotificationsSupported() ) {
    console.log("rich notifications supported");

    var displayCount = 5;
    var moreCount = streamList.length - displayCount;
    var defaultIcon = "../icons/128_1.png";
    var streamsToShow = streamList.slice(0, displayCount);
    var streamTitles = streamsToShow.map(function (c){
      return c.get("channel").display_name
    });
    var buttons = [
      {title: gm("m54")}
    ];
    var items = streamTitles.map(function (t){
      return {title: t, message: ""}
    });
    var isSingle = streamsToShow.length === 1;

//    var iconImage = streamsToShow.length > 1 ? defaultIcon : streamsToShow[0].get("preview").small;

    var notificationId = _.uniqueId("TwitchNow.Notification.");

    try {
      var opt = {
        type   : "list",
        title  : "",
        message: "",
        iconUrl: "../icons/64_2.png",
        buttons: buttons,
        items  : items
      }

      if ( isSingle ) {
        app.notificationIds[notificationId] = streamsToShow[0];

      }
      chrome.notifications.create(notificationId, opt, function (){
      });
      setTimeout(function (){
        chrome.notifications.clear(notificationId, function (){
        });
      }, 10000);
    } catch (e) {
      delete app.notificationIds[notificationId];
      console.log("Notification error: ", e);
    }

  }
};

app.clearBadge = function (){
  app.setBadge("");

};

app.setBadge = function (text){
  text += "";
  text = text === "0" ? "" : text;
  chrome.browserAction.setBadgeText({
    text: text
  })
};

app.playSound = function (path){
  new Audio(path).play();
};

app.init = function (){
  app.clearBadge();
};

var defaultSettings = [
  {
    id   : "windowHeight",
    desc : gm("m62"),
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
    desc  : gm("m66"),
    type  : "select",
    select: true,
    opts  : [
      { id: "following", name: gm("m67") },
      { id: "browse", name: gm("m68")},
      { id: "topstreams", name: gm("m69")}
    ],
    show  : true,
    value : "following"
  },
  {
    id    : "viewSort",
    desc  : gm("m1"),
    type  : "select",
    select: true,
    opts  : [
      { id: "viewers|1", name: gm("m10") },
      { id: "viewers|-1", name: gm("m11")},
      { id: "name|1", name: gm("m12")},
      { id: "name|-1", name: gm("m13") },
      { id: "created_at|-1", name: gm("m14") }
    ],
    show  : true,
    value : "viewers|-1"
  },
  {
    id    : "twitchDefaultLocale",
    desc  : gm("m61"),
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
    desc : gm("m55"),
    type : "radio",
    radio: true,
    opts : [
      {id: "dark", name: gm("m56")},
      {id: "white", name: gm("m57")}
    ],
    show : true,
    value: "dark"
  },
  {
    id      : "simpleView",
    desc    : gm("m65"),
    checkbox: true,
    type    : "checkbox",
    show    : true,
    value   : false
  },
  {
    id   : "openStreamIn",
    desc : gm("m2"),
    type : "radio",
    radio: true,
    opts : [
      {id: "oldlayout", name: gm("m15")},
      {id: "newlayout", name: gm("m16")},
      {id: "popout", name: gm("m17")}
    ],
    show : true,
    value: "newlayout"
  },
  {
    id   : "openChatIn",
    desc : gm("m3"),
    type : "radio",
    radio: true,
    opts : [
      {id: "newwindow", name: gm("m18")},
      {id: "newtab", name: gm("m19")}
    ],
    show : true,
    value: "newwindow"
  },
  {
    id      : "showBadge",
    desc    : gm("m4"),
    checkbox: true,
    type    : "checkbox",
    show    : true,
    value   : true
  },
  {
    id      : "showDesktopNotification",
    desc    : gm("m5"),
    checkbox: true,
    type    : "checkbox",
    show    : true,
    value   : true
  },
  {
    id   : "closeNotificationDelay",
    desc : gm("m6"),
    range: true,
    type : "range",
    tip  : "sec",
    min  : 5,
    value: 8,
    max  : 60
  },
  {
    id      : "playNotificationSound",
    desc    : gm("m7"),
    checkbox: true,
    show    : true,
    type    : "checkbox",
    value   : false
  },
  {
    id   : "notificationSound",
    desc : gm("m8"),
    type : "radio",
    radio: true,
    show : true,
    opts : [
      {id: "../audio/ding.ogg", name: "ding"},
      {id: "../audio/chime.mp3", name: "chime"},
      {id: "../audio/click.wav", name: "click"}
    ],
    value: "../audio/ding.ogg"
  },
  {
    id   : "refreshInterval",
    desc : gm("m9"),
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
  initialize: function (){
    var self = this;
    this.set("authenticated", twitchApi.isAuthorized());

    twitchApi.on("authorize", function (){
      console.log("auth");
      self.set("authenticated", true);
    });

    twitchApi.on("revoke", function (){
      console.log("revoke");
      self.set("authenticated", false);
    });
  },
  login     : function (){
    twitchApi.authorize();
  },
  logout    : function (){
    twitchApi.revoke();
  }
});

var Control = Backbone.Model.extend({});

var Settings = Backbone.Collection.extend({
  model: Control,

  initialize: function (){
    var storedSettings = app.get("settings") || [];
    var actualSettings = defaultSettings.map(function (defaultControl){
      var saved = _.find(storedSettings, function (storedControl){
        return storedControl.id === defaultControl.id
      });
      defaultControl.value = saved ? saved.value : defaultControl.value;
      return defaultControl;
    });
    this.add(actualSettings);
    this.on("change", this.saveToStorage);
  },

  saveToStorage: function (){
    app.set("settings", this.toJSON());
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
    var favoriteGamesIds = app.get("favorite_games");
    favoriteGamesIds[this.get("id")] = 1;
    app.set("favorite-games-ids", favoriteGamesIds);
    this.set("favorite", true);
  },

  unfavorite: function (){
    var favoriteGamesIds = app.get("favorite_games");
    delete favoriteGamesIds[this.get("id")];
    app.set("favorite-games-ids", favoriteGamesIds);
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
    this.set(
      {
        name      : channelName,
        created_at: Date.now()
      },
      {silent: true}
    );
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

  openStream: function (type){
    type = type || settings.get("openStreamIn").get("value");

    var links = {
      oldlayout: "/ID/old",
      newlayout: "/ID/new",
      popout   : "/ID/popout"
    };

    var href = this.baseUrl() + links[type].replace(/ID/, this.get("name"));
    chrome.tabs.create({ url: href });
  },

  openChat: function (){
    var openIn = settings.get("openChatIn").get("value");
    var href = this.baseUrl() + "/chat/embed?channel=ID&popout_chat=true".replace(/ID/, this.get("name"));
    var windowOpts = {
      "type"   : "popup",
      "focused": true,
      "width"  : 400
//            "height" : 600
    };

    if ( openIn == "newwindow" ) {
      chrome.windows.create($.extend({url: href}, windowOpts));
    } else {
      chrome.tabs.create({ url: href });
    }
  }
});

var FollowingStream = Stream.extend({
  initialize: function (){
    Stream.prototype.initialize.call(this);

    var notifyList = app.get("notifyList") || [];

    this.set("following", true, {silent: true});
    this.set("notify", ~notifyList.indexOf(this.get("_id")), {silent: true});
  },

  notify: function (val){
    var notifyList = app.get("notifyList") || []
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

    app.set("notifyList", notifyList);

    this.trigger("notify", this.get("notify"));
  }
})

var Pagination = Backbone.Collection.extend({
  defaultQueryOpts: {
    offset: 0,
    limit : 50
  },
  curQueryOpts    : {
    offset: 0
  },
  hasNext         : function (){
    return this.length == ( this.curQueryOpts.offset + 1 ) * 50;
  },
  loadNext        : function (fn){
    if ( this.hasNext() ) {
      this.curQueryOpts.offset++;
      fn();
    }
  }
});

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

    SearchCollection.prototype.initialize.call(this);
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
        return this.trigger("apierror");
      }

      this.update(res.streams, {silent: true});

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
    this.updateData();
  },
  updateData: function (){
    var url = "https://api.github.com/repos/ndragomirov/twitch-now/contributors";
    var self = this;
    $.ajax({ method: "GET", url: url})
      .done(function (contributors){
        self.reset(contributors);
      })
  }
});

app.bindNotificationListeners();

var contributors = new ContributorCollection;

var settings = new Settings;

var following = new FollowingCollection;
var browsing = new BrowsingCollection;
var topstreams = new TopStreamsCollection;

var videos = new Videos;
var games = new Games;
var search = new SearchCollection;

var user = new User;

var notify = function (){

  if ( following.addedStreams.length > 0 ) {
    if ( settings.get("showDesktopNotification").get("value") ) {
      app.sendNotification(following.getNewStreams());
    }
    if ( settings.get("playNotificationSound").get("value") ) {
      app.playSound(settings.get("notificationSound").get("value"));
    }
  }
};

function updateBadgeCount(){
  if ( settings.get("showBadge").get("value") ) {
    app.setBadge(following.length);
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
    app.clearBadge();
  }
}

twitchApi.on("authorize", function(){
  chrome.browserAction.setIcon({ path: "icons/38_2.png" });
})

twitchApi.on("revoke", function (){
  chrome.browserAction.setIcon({ path: "icons/38_2_grey.png" });
  following.reset();
  app.clearBadge();
});

twitchApi.on("init", function (){
  following.updateData();
  topstreams.updateData();
  games.updateData();
});

app.init();