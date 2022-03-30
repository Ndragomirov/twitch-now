(function () {

  var root = this;

  var bgApp = root.bgApp = {};
  bgApp.notificationIds = {};
  bgApp.dispatcher = _.clone(Backbone.Events);

  var localStorage = root.localStorage;

  bgApp.del = function (/*keys*/) {
    for (var i = 0; i < arguments.length; i++) {
      delete localStorage[arguments[i]];
    }
  };

  bgApp.get = function (key) {
    return key in localStorage ?
      JSON.parse(localStorage[key]) :
      undefined;
  };

  bgApp.set = function (key, val) {
    localStorage[key] = JSON.stringify(val);
  };

  bgApp.getOSName = function () {
    var OSName = "Unknown OS";
    if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
    return OSName;
  };

  bgApp.richNotificationsSupported = function () {
    return utils.notifications.richNotificationsSupported();
  };

  bgApp.bindNotificationListeners = function () {

    if (bgApp.richNotificationsSupported()) {

      chrome.notifications.onClicked.addListener(function (notificationId) {
        var stream = bgApp.notificationIds[notificationId];
        if (stream) {
          stream.openStream();
        }
        chrome.notifications.clear(notificationId, function () {

        });
      });

      chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
        delete bgApp.notificationIds[notificationId];
      });
    }
  };


  bgApp.downloadImageAsBlob = async function (url, type) {
    return new Promise((res, rej) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function () {
        var blob = new Blob([xhr.response], { type: type });
        res(URL.createObjectURL(blob));
      };
      xhr.onerror = function (err) {
        rej(err);
      }
      xhr.send();
    })
  }

  bgApp.sendNotification = async function (streamList) {
    var displayCount = settings.get("notifyCount").get("value");
    var defaultIcon = utils.runtime.getURL("common/icons/64_1.png");
    var streamsToShow = streamList.slice(0, displayCount);
    var streamsOther = streamList.slice(displayCount, streamList.length);
    var streamTitles = streamsOther.map(function (c) {
      return c.get("name");
    });

    if (bgApp.richNotificationsSupported()) {
      let sec = 0;
      for (let i in streamsToShow) {
        let num = i;
        let notificationId = _.uniqueId("TwitchNow.Notification.");
        let iconUrl = await getIcon();

        async function getIcon() {
          return new Promise((res, rej) => {
            try {
              let target = streamsToShow[num].get("user_id")
              twitchApi.send("user", { id: target }, async function (err, resp) {
                if (err) return rej(err);
                let iconUrl = await bgApp.downloadImageAsBlob(resp.data[0].profile_image_url, "image/png");
                res(iconUrl)
              })
            } catch (e) {
              //unable to download channels image as blob
              let iconUrl = defaultIcon;
              res(iconUrl)
            }
          });
        }
        try {
          let opt = {
            type: "basic",
            title: streamsToShow[num].get("name"),
            message: streamsToShow[num].get("game_name") + "\n" + streamsToShow[num].get("title"),
            iconUrl: iconUrl
          }
          bgApp.notificationIds[notificationId] = streamsToShow[num];
          setTimeout(function () {
            chrome.notifications.create(notificationId, opt, function () { });
          }, sec);
          sec = (sec + 1000);
        } catch (e) {
          console.log("Notification error: ", e);
          delete bgApp.notificationIds[notificationId];
        }
      }

      if (streamsOther.length) {
        try {
          let notificationId = _.uniqueId("TwitchNow.Notification.");
          var opt2 = {
            type: "basic",
            title: "Twitch Now",
            iconUrl: defaultIcon
          }
          if (streamsOther.length > 3) {
            let moreStreamers = streamTitles.slice(0, 2);
            opt2.message = moreStreamers.join("\n") + "\n" + utils.i18n.getMessage("m114") + (streamsOther.length - moreStreamers.length);
          } else {
            let moreStreamers = streamTitles.slice(0, 3);
            opt2.message = moreStreamers.join("\n");
          }
          setTimeout(function () {
            chrome.notifications.create(notificationId, opt2, function () { });
          }, sec);
        } catch (e) {
          delete bgApp.notificationIds[notificationId];
          console.log("Notification error: ", e);
        }
      }
    }
  };

  bgApp.clearBadge = function () {
    bgApp.setBadge("");
  };

  bgApp.setBadge = function (text) {
    text += "";
    text = text === "0" ? "" : text;
    utils.browserAction.setBadgeText({
      text: text
    })
  };

  bgApp.sound = new Audio();

  bgApp.stopSound = function () {
    if (bgApp.sound) {
      bgApp.sound.pause();
    }
  }

  bgApp.playSound = function (path, volume, loop) {
    var sound = bgApp.sound;

    if (typeof path === 'undefined') {
      return;
    }

    if (typeof loop === 'undefined') {
      loop = false;
    }
    if (typeof volume === 'undefined') {
      volume = 1;
    }

    if (!/^data:audio/.test(path)) {
      path = /^http/i.test(path) ? path : utils.runtime.getURL(path);
    }

    sound.src = path;
    sound.volume = volume;
    sound.loop = loop;
    sound.play();
  };

  bgApp.init = function () {
    bgApp.clearBadge();
  };

  var defaultSettings = [
    {
      id: "streamLanguage2",
      desc: "__MSG_m102__",
      type: "select",
      select: true,
      opts: [
        {
          "id": "any",
          "name": "Any",
        },
        {
          "id": "ru",
          "name": "Русский"
        },
        {
          "id": "en",
          "name": "English"
        },
        {
          "id": "da",
          "name": "Dansk"
        },
        {
          "id": "de",
          "name": "Deutsch"
        },
        {
          "id": "es",
          "name": "Español"
        },
        {
          "id": "fr",
          "name": "Français"
        },
        {
          "id": "it",
          "name": "Italiano"
        },
        {
          "id": "hu",
          "name": "Magyar"
        },
        {
          "id": "nl",
          "name": "Nederlands"
        },
        {
          "id": "no",
          "name": "Norsk"
        },
        {
          "id": "pl",
          "name": "Polski"
        },
        {
          "id": "pt",
          "name": "Português"
        },
        {
          "id": "sk",
          "name": "Slovenčina"
        },
        {
          "id": "fi",
          "name": "Suomi"
        },
        {
          "id": "sv",
          "name": "Svenska"
        },
        {
          "id": "vi",
          "name": "Tiếng Việt"
        },
        {
          "id": "tr",
          "name": "Türkçe"
        },
        {
          "id": "cs",
          "name": "Čeština"
        },
        {
          "id": "el",
          "name": "Ελληνικά"
        },
        {
          "id": "bg",
          "name": "Български"
        },
        {
          "id": "ar",
          "name": "العربية"
        },
        {
          "id": "th",
          "name": "ภาษาไทย"
        },
        {
          "id": "zh",
          "name": "中文"
        },
        {
          "id": "ja",
          "name": "日本語"
        },
        {
          "id": "ko",
          "name": "한국어"
        },
        {
          "id": "asl",
          "name": "American Sign Language"
        },
        {
          "id": "other",
          "name": "__MSG_m106__"
        }
      ],
      show: true,
      value: 'any'
    },
    {
      id: "windowHeight",
      desc: "__MSG_m62__",
      range: true,
      show: false,
      type: "range",
      tip: "px",
      min: 360,
      max: 590,
      value: 590
    },
    {
      id: "defaultTab",
      desc: "__MSG_m66__",
      type: "select",
      select: true,
      opts: [
        { id: "following", name: "__MSG_m67__" },
        { id: "browse", name: "__MSG_m68__" },
        { id: "topstreams", name: "__MSG_m69__" }
      ],
      show: true,
      value: "following"
    },
    {
      id: "viewSort",
      desc: "__MSG_m1__",
      type: "select",
      select: true,
      opts: [
        { id: "viewer_count|1", name: "__MSG_m10__" },
        { id: "viewer_count|-1", name: "__MSG_m11__" },
        { id: "user_login|1", name: "__MSG_m12__" },
        { id: "user_login|-1", name: "__MSG_m13__" },
        { id: "game_name|1", name: "__MSG_m82__" },
        { id: "started_at|-1", name: "__MSG_m14__" }
      ],
      show: true,
      value: "viewer_count|-1"
    },
    {
      id: "themeType",
      desc: "__MSG_m55__",
      type: "radio",
      radio: true,
      opts: [
        { id: "dark", name: "__MSG_m56__" },
        { id: "white", name: "__MSG_m57__" }
      ],
      show: true,
      value: "white"
    },
    {
      id: "simpleView",
      desc: "__MSG_m65__",
      checkbox: true,
      type: "checkbox",
      show: true,
      value: false
    },
    {
      id: "openStreamIn",
      desc: "__MSG_m2__",
      type: "radio",
      radio: true,
      opts: [
        { id: "newlayout", name: "__MSG_m16__" },
        { id: "popout", name: "__MSG_m17__" },
        { id: "theatrelayout", name: "__MSG_m88__" },
        { id: "html5", name: "__MSG_m101__" }
      ],
      show: true,
      value: "newlayout"
    },
    {
      id: "openChatIn",
      desc: "__MSG_m3__",
      type: "radio",
      radio: true,
      opts: [
        { id: "newwindow", name: "__MSG_m18__" },
        { id: "newtab", name: "__MSG_m19__" }
      ],
      show: true,
      value: "newwindow"
    },
    {
      id: "showBadge",
      desc: "__MSG_m4__",
      checkbox: true,
      type: "checkbox",
      show: true,
      value: true
    },
    {
      id: "hideVodcasts",
      desc: "__MSG_m110__",
      checkbox: true,
      type: "checkbox",
      show: false,
      value: false
    },
    {
      id: "showDesktopNotification",
      desc: "__MSG_m5__",
      checkbox: true,
      type: "checkbox",
      show: true,
      value: true
    },
    {
      id: "invertNotification",
      desc: "__MSG_m115__",
      checkbox: true,
      type: "checkbox",
      show: true,
      value: true
    },
    {
      id: "notifyCount",
      desc: "__MSG_m113__",
      type: "select",
      select: true,
      opts: [
        { id: "0", name: "0" },
        { id: "1", name: "1" },
        { id: "2", name: "2" },
        { id: "3", name: "3" },
        { id: "4", name: "4" },
        { id: "5", name: "5" }
      ],
      show: true,
      value: "0"
    },
    {
      id: "closeNotificationDelay",
      desc: "__MSG_m6__",
      range: true,
      type: "range",
      tip: "sec",
      min: 5,
      value: 8,
      max: 60
    },
    {
      id: "playNotificationSound",
      desc: "__MSG_m7__",
      checkbox: true,
      show: true,
      type: "checkbox",
      value: false
    },
    {
      id: "loopNotificationSound",
      desc: "__MSG_m99__",
      checkbox: true,
      show: false,
      type: "checkbox",
      value: false
    },
    {
      id: "notificationSound",
      desc: "__MSG_m8__",
      type: "radio",
      radio: true,
      show: true,
      opts: [
        { id: "common/audio/ding.ogg", name: "ding" },
        { id: "common/audio/chime.mp3", name: "chime" },
        { id: "common/audio/click.wav", name: "click" },
        { id: "customsound", name: "__MSG_m76__" }
      ],
      value: "common/audio/ding.ogg"
    },
    {
      id: "notificationVolume",
      desc: "__MSG_m86__",
      range: true,
      show: true,
      type: "range",
      tip: "%",
      min: 1,
      max: 100,
      value: 100
    },
    {
      id: "customNotificationSound",
      desc: "__MSG_m75__",
      button: true,
      show: true,
      type: "button",
      value: ""
    },
    {
      id: "refreshInterval",
      desc: "__MSG_m9__",
      range: true,
      show: true,
      type: "range",
      tip: "min",
      min: 1,
      max: 60,
      value: 5
    },
    {
      id: "livestreamerQuality",
      desc: "__MSG_m111__",
      type: "select",
      select: true,
      opts: [
        { id: "source", name: "source" },
        { id: "high", name: "high" },
        { id: "low", name: "low" },
        { id: "medium", name: "medium" },
        { id: "mobile", name: "mobile" }
      ],
      show: true,
      value: "source"
    },
    {
      id: "livestreamerPath",
      desc: "__MSG_m112__",
      type: "text",
      text: true,
      show: true,
      value: ""
    }
  ];

  var User = Backbone.Model.extend({
    userpic: utils.runtime.getURL("common/icons/default_userpic.png"),
    initialize: function () {
      var self = this;
      if (twitchOauth.hasAccessToken()) {
        twitchApi.token = twitchOauth.getAccessToken();
        self.populateUserInfo(function (e, res) {
          self.set("authenticated", true);
          self.set({
            "logo": res.logo,
            "name": res.display_name
          });
        });
      }

      twitchApi.on("authorize", function () {
        self.populateUserInfo(function () {
        });
        self.set("authenticated", true);
      });

      twitchApi.on("revoke", function () {
        self.set("authenticated", false);
      });
    },
    populateUserInfo: function (cb) {

      var self = this;

      twitchApi.send("user", {}, function (err, res) {
        if (!err) {
          self.set({
            logo: res.data[0].profile_image_url || self.userpic,
            name: res.data[0].display_name
          })
        }
        cb(err, res);
      });
    },
    login: function () {
      twitchApi.authorize();
    },
    logout: function () {
      twitchApi.revoke();
    }
  });

  var Control = Backbone.Model.extend({

    initialize: function () {
      this.setShow();
    },

    setShow: function () {
      var hideControls = {
        chrome: [],
        firefox: [/*"showBadge"*/],
        opera: []
      }

      var rbrowser = utils.rbrowser;
      var hideIds = hideControls[rbrowser];
      var selfId = this.get("id");
      if (hideIds && ~hideIds.indexOf(selfId)) {
        this.set("show", false);
      }
    },

    isValidValue: function (v) {
      var type = this.get("type");

      if (type == "checkbox") {
        if (v === true || v === false) {
          return true;
        }
        return false;
      }
      else if (type == "radio" || type == "select") {
        var opts = this.get("opts");
        for (var i = 0; i < opts.length; i++) {
          if (opts[i].id === v) {
            return true;
          }
        }
        return false;
      }
      else if (type == "range") {
        var min = this.get("min")
          , max = this.get("max")
          ;
        v = parseInt(v, 10);

        if (!isNaN(v) && v >= min && v <= max) {
          return true;
        }
        return false;
      }
      else if (type == 'mcheckbox') {
        return typeof v === 'string';
      }

      return false;
    }
  });

  var Settings = Backbone.Collection.extend({
    model: Control,

    initialize: function () {
      var storedSettings = bgApp.get("settings") || [];

      this.add(defaultSettings);

      this.forEach(function (control) {
        var saved = _.find(storedSettings, function (storedControl) {
          return storedControl.id === control.get("id");
        });

        if (saved && saved.hasOwnProperty("value") && control.isValidValue(saved.value)) {
          control.set("value", saved.value);
        }
      })

      this.saveToStorage();
      this.on("change", this.saveToStorage);
    },

    getNotificationSoundSource: function () {
      var val = this.get("notificationSound").get("value");
      return val == "customsound" ? localStorage["customSound"] : val;
    },

    saveToStorage: function () {
      bgApp.set("settings", this.toJSON());
    }
  });

  var TrackLastErrorMixin = {
    lastErrorMessage: "",
    initialize: function () {
      //clear last message if update was successfull
      this.on("update", function () {
        this.lastErrorMessage = "";
      })
      this.on("error", function (err) {
        console.log("\nNew error = ", err);
        this.lastErrorMessage = err;
        this.trigger("_error", this.lastErrorMessage);
      }.bind(this))
    }
  }

  var TwitchItemModel = Backbone.Model.extend({

    idAttribute: "_id",

    baseUrl: function () {
      return "http://www.twitch.tv";
    }
  });

  var UpdatableCollection = Backbone.Collection.extend({
    auto: false, // auto updates every `timeout` interval
    pagination: false,
    timeout: 60 * 1000,
    pageQuery: {
      offset: 0,
      limit: 20
    },
    defaultQuery: function () {
      return {
        first: 100,
        offset: 0
      }
    },
    updating: false,
    interval: null,
    initialize: function () {
      bgApp.dispatcher.on('popup-close', function () {
        this.rewind();
      }.bind(this))
    },
    rewind: function () {
      if (this.pagination) {
        this.pageQuery.offset = 0;
        this.reset(this.slice(0, this.defaultQuery().limit).map(function (v) {
          return v.attributes;
        }));
      }
    },
    send: function () {
      throw new Error("Not implemented");
    },
    parse: function () {
      throw new Error("Not Implemented");
    },
    beforeUpdate: function () {
    },
    afterUpdate: function () {
    },
    loadNext: function () {
      if (this.pagination && !this.updating) {
        this.pageQuery.offset = this.length + 1;
        this.update(this.pageQuery, { add: true }, function () {
          console.log("loadNext() complete");
        })
      }
    },
    update: function (query, opts, callback) {
      query = $.extend({}, this.defaultQuery(), query);
      opts = opts || { reset: true };
      callback = callback || $.noop;

      clearTimeout(this.interval);

      //reset pagination
      if (opts.reset) {
        this.pageQuery.offset = 0;
      }

      this.updating = true;
      this.trigger("update-status", this.updating, { reset: opts.reset });
      this.beforeUpdate();
      this.send(query, function (err, res) {
        console.log(err, res);
        this.updating = false;
        this.trigger("update-status", this.updating, { reset: opts.reset });

        if (this.auto) {
          this.interval = setTimeout(function () {
            this.update(this.defaultQuery(), { reset: true }, $.noop);
          }.bind(this), this.timeout);
        }

        if (err) {
          if (err.status == 401) {
            this.trigger("error", "auth");
          } else {
            this.trigger("error", "api");
          }
          this.afterUpdate();
          return callback(err);
        }

        this.parse(res, function (err, result) {
          if (err) {
            this.trigger("error", err.message);
            return callback(err);
          }
          if (opts.reset) {
            this.reset(result, { silent: true });
            this.afterUpdate();
            this.trigger("update");
          }

          if (opts.add) {
            var idsBefore = _.pluck(this.models, "id");
            this.add(result, { silent: true });
            var idsAfter = _.pluck(this.models, "id");
            var addedModels = _
              .difference(idsAfter, idsBefore)
              .map(function (id) {
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
    model: Video,
    pagination: true,

    send: function (query, callback) {
      twitchApi.send(this.url, query, callback);
    },
    parse: function (res, callback) {
      if (!res) {
        return callback(new Error("api"));
      }
      if (Array.isArray(res.vods)) {
        res.videos = res.vods;
      }
      if (Array.isArray(res.videos)) {
        res.videos = res.videos;
      }
      res.videos = res.videos || [];
      return callback(null, res.videos);
    }
  });

  var ChannelVideos = Videos.extend({
    url: "channelVideos",
    channel: null,
    defaultQuery: function () {
      return {
        channel: this.channel,
        limit: 20
      }
    }
  })

  var GameVideos = Videos.extend({
    url: "gameVideos",
    game: null,
    defaultQuery: function () {
      return {
        game_id: this.gameid,
        period: "week"
      }
    }
  })

  var Game = Backbone.Model.extend({
    idAttribute: "_id",

    follow: function (cb) {
      cb = cb || $.noop;
      var target = this.get("game").name;
      twitchApi.send("gameFollow", { name: target }, function (err, res) {
        if (err) return cb(err);
        this.trigger("follow", this.attributes);
        bgApp.dispatcher.trigger("game:follow", this.attributes);
        cb();
      }.bind(this));
    },

    unfollow: function (cb) {
      cb = cb || $.noop;
      var target = this.get("game").name;
      twitchApi.send("gameUnfollow", { name: target }, function (err, res) {
        if (err) return cb(err);
        this.trigger("unfollow", this);
        bgApp.dispatcher.trigger("game:unfollow", this.attributes);
        cb();
      }.bind(this));
    }
  });

  var Games = UpdatableCollection.extend({
    auto: true,
    pagination: true,
    timeout: 5 * 60 * 1000,
    model: Game,

    findByName: function (gameName) {
      return this.find(function (g) {
        return g.get("name") == gameName;
      })
    },
    parse: function (res, callback) {
      if (!res) {
        return callback(new Error("api"));
      }
      res.data = Array.isArray(res.data) ? res.data : [];
      res.data.forEach(function (g) {
        g.box_art_url = g.box_art_url.replace(/{width}/, 136)
        g.box_art_url = g.box_art_url.replace(/{height}/, 190)
      });
      return callback(null, res.data);
    },
    send: function (query, callback) {
      twitchApi.send("gamesTop", query, callback);
    }
  });

  var FollowingGames = Games.extend({
    auto: true,
    pagination: false,
    timeout: 5 * 60 * 1000,
    comparator: function (a) {
      return -1 * a.get("viewers");
    },
    initialize: function () {
      var self = this;

      bgApp.dispatcher.on("game:follow", function (model) {
        self.add(model);
      })

      bgApp.dispatcher.on("game:unfollow", function (model) {
        self.remove(model._id);
      })

      twitchApi.on("authorize", function () {
        self.update();
      })

      twitchApi.on("revoke", function () {
        self.reset();
      });

      if (twitchApi.isAuthorized) {
        self.update();
      }
    },
    send: function (query, callback) {
      // twitchApi.send("followedgames", query, callback);
    },
    parse: function (res, callback) {
      if (!res) {
        return callback(new Error("api"));
      }
      res.follows = Array.isArray(res.follows) ? res.follows : [];
      res.follows.forEach(function (g) {
        g._id = g.game._id;
      });
      return callback(null, res.follows);
    }
  })

  var ChannelNotification = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
      notificationOpts: {
        desktop: true,
        sound: true
      }
    },
    getProfileUrl: function () {
      return "https://www.twitch.tv/" + this.get("to_login") + "/about";
    },
    openProfilePage: function () {
      utils.tabs.create({ url: this.getProfileUrl() });
    },
    initialize: function () {
      let i = settings.get("invertNotification").get("value");
      this.defaults.notificationOpts.desktop = i;
      this.defaults.notificationOpts.sound = i;
    }
  });

  var FollowedChannel = TwitchItemModel.extend({
    openChannelPage: function () {
      utils.tabs.create({ url: "https://twitch.tv/" + this.get("to_login") })
    }
  })

  var FollowedChannels = Backbone.Collection.extend({
    model: FollowedChannel,
    updating: false,
    initialize: function () {
      twitchApi.on("revoke", function () {
        this.reset();
      }.bind(this));
    },
    comparator: function (a) {
      return a.get("to_login");
    },
    getFollowedChannelsCount: function (cb) {
      twitchApi.send("follows", { first: 1 }, function (err, res) {
        if (err || !res || !res.total) {
          return cb(err || new Error("No Total channels"));
        }
        return cb(null, parseInt(res.total));
      })
    },
    getFollowedChannels: function (page, cb) {
      let cursor = (page ? {first: 100, after: page} : {first: 100});
      twitchApi.send("follows", cursor, function (err, res) {
        if (err || !res || !res.data) {
          return cb(err || new Error("No Total channels"));
        }
        res.data.forEach(function (c) {
          c._id = c.to_id;
          c.logo = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_50x50.png";
        });
        return cb(null, res.data, res.pagination.cursor);
      })
    },
    update: function () {
      var self = this;
      if (self.updating) {
        return;
      }
      self.updating = true;
      self.getFollowedChannelsCount(function (err, count) {
        if (err) {
          self.updating = false;
          return self.trigger("error", "api");
        }
        let fns = [];
        var requestCount = Math.ceil(count / 100);
        let ct = 0

        getFC()

        function getFC (c) {
          self.getFollowedChannels(c, function (err, cb, cur) {
            if (requestCount > ct) {
              fns = fns.concat(cb)
              ct++
              getFC(cur)
            } else {
              self.updating = false;
              fns = _.flatten(fns);
              self.reset(fns, { silent: true });
              self.trigger("update");
            }
          })
        }
      });
    }
  })

  var NotificationSettings = Backbone.Collection.extend({
    model: ChannelNotification,

    comparator: function (a) {
      return a.get("to_login");
    },

    initialize: function () {
      _.extend(this, new Backbone.Memento(this));
      var self = this;

      twitchApi.on("revoke", function () {
        self.reset();
      })
    },
    loadFromStorage: function () {
      if (twitchApi.isAuthorized()) {
        return bgApp.get("notifications_" + twitchApi.userName) || [];
      } else {
        this.trigger("error", "auth");
        return [];
      }
    },
    getChannelNotification: function (cid, type) {
      var self = this;

      var channel = _.findWhere(self.loadFromStorage(), { _id: parseInt(cid) });
      if (channel) {
        return channel.notificationOpts[type];
      } else {
        return settings.get("invertNotification").get("value");
      }
    },
    saveToStorage: function () {
      if (twitchApi.isAuthorized()) {
        var val = this.map(function (v) {
          return {
            "_id": v.get("_id"),
            "notificationOpts": v.get("notificationOpts")
          }
        });
        bgApp.set("notifications_" + twitchApi.userName, val);
      } else {
        this.trigger("error", "auth");
      }
    },
    update: function () {
      var self = this;
      var channels = [];

      function getFollowedChannelsCount(cb) {
        twitchApi.send("follows", {}, function (err, res) {
          if (err || !res || !res.total) {
            return cb(err || new Error("No Total channels"));
          }
          return cb(null, parseInt(res.total));
        })
      }

      function getFollowedChannels(count, cb) {
        twitchApi.send("follows", { first: 100 }, function (err, res) {
          if (err || !res || !res.data) {
            return cb(err || new Error("No Total channels"));
          }

          res.data.forEach(function (c) {
            c._id = c.to_id;
            c.channel = {
              display_name: c.to_name,
              logo: "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_50x50.png"
            }
            // c.logo = c.channel.logo.replace("300x300", "50x50");
          });
          channels = channels.concat(res.data);

          return cb(null);
        })
      }

      getFollowedChannelsCount(function (err, count) {
        var fns = [];
        var limit = 4;
        var requestCount = Math.ceil(count / 100);

        for (var i = 0; i < requestCount; i++) {
          fns.push(getFollowedChannels.bind(null, i));
        }

        async.parallelLimit(fns, limit, function (err, results) {
          if (err) {
            return self.trigger("error", "api");
          } else {
            self.reset(channels, { silent: true });
            //merge with stored notification preferences
            self.set(self.loadFromStorage(), { add: false, remove: false, merge: true, silent: true });
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

    initialize: function () {
      var channelName = this.get("user_name");
      var streamType = this.get("type");
      var isVodcast = ['rerun', 'watch_party'].includes(streamType);
      this.set({
        vodcast: isVodcast,
        name: channelName
      },
        { silent: true });
    },

    follow: function (cb) {
      cb = cb || $.noop;
      var target = this.get("channel")._id;
      twitchApi.send("follow", { target: target }, function (err, res) {
        if (err) return cb(err);
        this.trigger("follow", this.attributes);
        bgApp.dispatcher.trigger("stream:follow", this.attributes);
        cb();
      }.bind(this));
    },

    unfollow: function (cb) {
      cb = cb || $.noop;
      var target = this.get("channel")._id;
      twitchApi.send("unfollow", { target: target }, function (err, res) {
        if (err) return cb(err);
        this.trigger("unfollow", this);
        cb();
      }.bind(this));
    },

    getStreamURL: function (type) {
      type = type || settings.get("openStreamIn").get("value");
      if (type == "html5") {
        return "http://player.twitch.tv/?channel=" + this.get("user_login") + "&html5" + "&parent=twitch-now";
      }
      var links = {
        theatrelayout: "/ID?mode=theatre",
        newlayout: "/ID",
        popout: "/ID/popout"
      };

      return this.baseUrl() + links[type].replace(/ID/, this.get("user_login"));
    },

    openMultitwitch: function () {
      var self = this;
      var url = "http://multitwitch.tv";
      var updatedTabUrl;
      utils.tabs.query({}, function (tabs) {
        tabs = tabs.filter(function (t) {
          return /https*:\/\/(www\.)*multitwitch\.tv/.test(t.url);
        })

        //update last tab with multitwitch
        if (tabs.length) {
          var tab = tabs[tabs.length - 1];
          var tabUrl = tab.url;
          updatedTabUrl = tabUrl + "/" + self.get("user_login");
          utils.tabs.update(tab.id, { url: updatedTabUrl });
        } else {
          //creare new tab with multitwitch
          updatedTabUrl = url + "/" + self.get("user_login");
          utils.tabs.create({ url: updatedTabUrl, active: false });
        }
      });
    },

    openInLivestreamer: function (quality, path) {
      var url = this.getStreamURL("newlayout");
      console.log("\nOpen livestreamer", url, quality, path);
      if (utils.rbrowser == "firefox") {
        utils.runtime.sendMessage("LIVESTREAMER", {
          url: url,
          quality: quality,
          path: path
        });
      }
    },

    openStream: function (type) {
      if (type == "livestreamer") {
        this.openInLivestreamer(settings.get("livestreamerQuality").get("value"), settings.get("livestreamerPath").get("value"));
      } else {
        var url = this.getStreamURL(type);
        utils.tabs.create({ url: url });
      }
    },

    openChat: function () {
      var openIn = settings.get("openChatIn").get("value");
      var href = this.baseUrl() + "/popout/ID/chat?popout=".replace(/ID/, this.get("user_login"));

      if (openIn == "newwindow") {
        utils.windows.create({ url: href, width: 400 });
      } else {
        utils.tabs.create({ url: href });
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

    defaultQuery: function () {
      let language = settings.get("streamLanguage2").get("value");
      language = language == 'any' ? '' : language;
      if (language) {
        return {
          language: language,
          first: 50,
          offset: 0
        }
      } else {
        return {
          first: 50,
          offset: 0
        }
      }
    },

    initialize: function () {
      UpdatableCollection.prototype.initialize.apply(this, arguments);
      this.setComparator();

      settings.get("viewSort").on("change:value", function () {
        this.setComparator();
      }.bind(this));

      settings.get("streamLanguage2").on("change:value", function () {
        if (this.length) {
          this.update();
        }
      }.bind(this))
    },

    setComparator: function () {
      var curSort = settings.get("viewSort").get("value").split("|");
      var prop = curSort[0];
      var reverse = parseInt(curSort[1], 10);

      this.comparator = function (a, b) {
        return a.get(prop) > b.get(prop) ? 1 * reverse
          : a.get(prop) < b.get(prop) ? -1 * reverse : 0;
      };
      this.sort();
    },

    parse: function (res, callback) {
      if (!res) {
        return callback(new Error("api"));
      }
      res.data = Array.isArray(res.data) ? res.data : [];
      if (settings.get("hideVodcasts").get("value")) {
        res.data = res.data.filter(function (v) {
          if (['rerun', 'watch_party'].includes(v.type)) {
            return false;
          }
          return true;
        })
      }
      return callback(null, res.data);
    }
  });

  var Hosts = StreamCollection.extend({
    pagination: false,
    auto: true,
    timeout: 5 * 60 * 1000,
    model: Stream,
    initialize: function () {
      var self = this;

      twitchApi.on("authorize", function () {
        self.update();
      })

      twitchApi.on("revoke", function () {
        self.reset();
      });

      StreamCollection.prototype.initialize.call(this);
    },
    parse: function (res, callback) {
      if (!res || !res.hosts) {
        return callback(new Error("api"));
      }
      var streams = res.hosts.map(function (host) {
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
    send: function (query, callback) {
      console.log("hosts", arguments);
      twitchApi.send("hosts", {}, callback);
    }
  })

  var FollowingStreams = StreamCollection.extend({
    pagination: false,
    auto: true,
    timeout: 5 * 60 * 1000,
    model: FollowingStream,

    defaultQuery: function () {
      return {
        limit: 100,
        offset: 0
      }
    },

    initialize: function () {
      var self = this;

      setInterval(function () {
        self.notified = [];
      }, 1000 * 60 * 10);

      settings.get("refreshInterval").on("change:value", function () {
        self.timeout = settings.get("refreshInterval").get("value") * 60 * 1000;
      });

      bgApp.dispatcher.on("stream:follow", function (model) {
        self.add(model);
      })

      this.on("unfollow", function (attr) {
        self.remove(attr);
      });

      this.on("add update remove reset", function () {
        badge.set("count", this.length);
      });

      this.on("update", function () {
        self.notify();
      });

      this.on("add", function (stream) {
        self.addedStreams = [stream.id];
        self.notify();
      })

      // twitchApi.on("authorize", function () {
      //   self.update();
      // })

      twitchApi.on("userid", function () {
        self.update();
      })

      twitchApi.on("revoke", function () {
        self.reset();
      });

      StreamCollection.prototype.initialize.call(this);
    },

    getNewStreams: function () {
      var ids = this.addedStreams;
      return this.filter(function (stream) {
        return ~ids.indexOf(stream.get("id"));
      });
    },

    addedStreams: [],
    idsBeforeUpdate: [],
    idsAfterUpdate: [],
    notified: [], //store notified streams id here
    notify: function () {
      var self = this;

      twitchApi.getUserName(function () {
        //notify about all streams if error happens
        var desktopNotifications = self.getNewStreams()
          .filter(function (stream) {
            return notifications.getChannelNotification(stream.get("user_id"), "desktop")
          })

        var soundNotifications = self.getNewStreams()
          .filter(function (stream) {
            return notifications.getChannelNotification(stream.get("user_id"), "sound")
          })

        if (desktopNotifications.length && settings.get("showDesktopNotification").get("value")) {
          bgApp.sendNotification(desktopNotifications);
        }

        if (soundNotifications.length && settings.get("playNotificationSound").get("value")) {
          bgApp.playSound(
            settings.getNotificationSoundSource(),
            settings.get("notificationVolume").get("value") / 100,
            settings.get("loopNotificationSound").get("value")
          );
        }
      })

    },
    beforeUpdate: function () {
      this.idsBeforeUpdate = this.pluck("id").map(function (v) {
        return v;
      });
    },
    send: function (query, callback) {
      twitchApi.send("followed", {}, callback);
    },
    afterUpdate: function () {
      this.idsAfterUpdate = this.pluck("id", function (v) {
        return v;
      })

      this.addedStreams = _.difference(this.idsAfterUpdate, this.idsBeforeUpdate, this.notified);
      this.notified = _.union(this.addedStreams, this.notified);
    }
  });

  var GameLobby = Game.extend({

    lastChange: 0,

    change: function (gameName) {
      var newGame = games.findByName(gameName) || followedgames.findByName(gameName);
      if (newGame) {
        console.log("lastchange", this.lastChange, newGame);
        if (!this.get("game") || newGame.get("game").name != this.get("game").name || (Date.now() - this.lastChange) > 5 * 1000 * 60) {
          this.set(newGame.toJSON());
          this.lastChange = Date.now();
          bgApp.dispatcher.trigger("gameLobby:change", gameName, newGame.get("id"));
        }
      }
    }
  })

  var GameStreams = StreamCollection.extend({
    game: null,
    gameid: null,
    enableLanguage: true,
    langFilter: true,
    pagination: true,
    initialize: function () {
      StreamCollection.prototype.initialize.apply(this, arguments);
      bgApp.dispatcher.on('popup-close', function () {
        this.enableLanguageFilter();
      }.bind(this))
    },
    disableLanguageFilter: function () {
      this.langFilter = false;
    },
    enableLanguageFilter: function () {
      this.langFilter = true;
    },
    send: function (query, callback) {
      query.game_id = this.gameid;
      if (!this.langFilter) {
        delete query.broadcaster_language;
      }
      twitchApi.send("streams", query, callback);
    }
  });

  var GameLobbyStreams = GameStreams.extend({
    initialize: function () {
      bgApp.dispatcher.on("gameLobby:change", function (game, gameid) {
        this.game = game;
        this.gameid = gameid;
        this.update();
      }.bind(this));
      GameStreams.prototype.initialize.apply(this, arguments);
    }
  })

  var GameLobbyVideos = GameVideos.extend({
    initialize: function () {
      bgApp.dispatcher.on("gameLobby:change", function (game, gameid) {
        this.game = game;
        this.gameid = gameid;
        this.update();
      }.bind(this));
      GameVideos.prototype.initialize.apply(this, arguments);
    }
  })

  var TopStreams = StreamCollection.extend({
    auto: true,
    pagination: true,
    timeout: 5 * 60 * 1000,
    send: function (query, callback) {
      twitchApi.send("streams", query, callback);
    }
  });

  var Search = StreamCollection.extend({
    query: null,
    pagination: true,
    send: function (query, callback) {
      query.query = this.query;
      twitchApi.send("searchStreams", query, callback);
    }
  });

  var Contributor = Backbone.Model.extend();

  var Contributors = Backbone.Collection.extend({
    model: Contributor,
    initialize: function () {
      this.add(contributorList);
    }
  });

  var Badge = Backbone.Model.extend({
    defaults: {
      count: 0
    },
    initialize: function () {
      var self = this;
      utils.browserAction.setBadgeBackgroundColor({ "color": [100, 100, 100, 255] });


      self.on("change:count", function () {
        if (settings.get("showBadge").get("value")) {
          bgApp.setBadge(self.get("count"));
        }
      });

      settings.on("change:value", function (model, value) {
        if (model.get("id") == "showBadge") {
          self.onShowBadgeChange(value);
        }
      });
    },
    onShowBadgeChange: function (value) {
      if (value) {
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
