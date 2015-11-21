(function (w){
  "use strict";

  var app = window.app = _.extend({}, Backbone.Events);
  var b = app.b = utils._getBackgroundPage();
  var _baron;

  app.twitchApi = b.twitchApi;
  app.currentView = null;
  app.views = {};
  app.windowOpened = false;

  app.resetScroll = function (){
    app.container.scrollTop(0);
    _baron.update();
  }

  app.lazyload = function (){
    var collection = $('.lazy-container').filter(":visible").find(".lazy");
    collection.each(function (){
      var t = $(this);
      if ( t.visible(true) ) {
        t.attr('src', t.attr('data-original'));
        t.removeClass('lazy');
      }
    });
    setTimeout(function (){
      app.lazyload()
    }, 100);
  }

  app.setCurrentView = function (viewName){
    if ( app.views[viewName] ) {
      if ( app.curView && typeof app.curView.onhide == 'function' ) {
        app.curView.onhide();
      }
      $('.screen').hide();
      app.curView = app.views[viewName];
      $('#filterInput:visible, #searchInput:visible').focus();
      app.curView.$el.show();
      if ( app.curView.lazyrender ) {
        app.curView.lazyrender();
      }
      if ( app.curView.onshow ) {
        app.curView.onshow();
      }
      app.resetScroll();
    }
  }

  app.init = function (){
    app.container = $('#content');
    app.scroller = app.container.find(".scroller");
    app._scroller = document.querySelector(".scroller");
    app.scrollerBar = document.querySelector(".scroller__bar");
    app.preloader = $("<div id='preloader'><img src='../img/spinner.gif'/></div>");
    app.streamPreloader = $("<div id='preloader-stream'><img src='../img/spinner.gif'/></div>");

    i18n.setGetMessageFn(utils.i18n.getMessage);
    i18n.replace(document.body);
    i18n.observe(document.body);

    var views = app.views;
    this.router = new this.Router;


    app.scroller.on("scroll", function (){
      if ( app._scroller.scrollTop + app._scroller.offsetHeight == app._scroller.scrollHeight ) {
        if ( app.curView && app.curView.loadNext && $("#filterInput").val().length == 0 ) {
          app.curView.loadNext();
        }
      }
    })

    views.menu = new Menu;

    views.topMenu = new TopMenu;

    _baron = baron({
      root    : '#content',
      scroller: '.scroller',
      bar     : '.scroller__bar',
      barOnCls: 'baron'
    }).autoUpdate();

    Backbone.history.start();

    this.router.on("all", function (r){
      var route = r.split(":")[1];
      console.log("ROUTE", route);
      if ( route ) {
        app.setCurrentView(route);
      }
    });

    views.notifications = new ChannelNotificationListView({
      el        : "#notifications-screen",
      collection: b.notifications
    })

    views.followedGames = new GameListView({
      el        : "#followed-game-screen",
      collection: b.followedgames
    })

    views.gameLobby = new GameLobbyView({
      el   : "#gamelobby",
      route: "gameLobby",
      model: b.gameLobby
    })

    views.info = new InfoView({
      el: "#info-screen"
    });

    views.topstreams = new StreamListView({
      el        : "#topstreams-screen",
      collection: b.topstreams
    });

    views.following = new StreamListView({
      el        : "#stream-screen",
      collection: b.following
    });

    views.videos = new VideoListView({
      el        : "#video-screen",
      collection: b.videos
    });

    views.search = new SearchView({
      el        : "#search-screen",
      collection: b.search
    });

    views.browseGames = new GameListView({
      el        : "#browse-game-screen",
      collection: b.games
    });

    new UserView({
      model: b.user
    });

    views.settings = new SettingsView({
      collection: b.settings
    });

    new DonationListView({
      el        : ".donation-list",
      collection: b.donations
    })

    new ContributorListView({
      el        : ".contributor-list",
      collection: b.contributors
    })

//    app.lazyload();

    $("body")
      .on('click', '*[data-route]', function (){
        var route = $(this).attr('data-route');
        window.location.hash = '#' + route;
      })
      .one('mouseenter', function (){
        app.lazyload();
      })
      .on('click', '.js-tab', function (e){
        var href = $(this).attr('data-href');
        utils.tabs.create({url: href});
        e.preventDefault();
      })

      .on('click', '.js-window', function (e){
        var windowOpts = JSON.parse($(this).attr('data-window-opts') || "{}");
        utils.windows.create($.extend({url: $(this).attr('data-href')}, windowOpts));
        e.preventDefault();
      })

    $('.tip').tooltip();

    console.log(window.location.href);
  };

  var DefaultView = Backbone.View.extend({
    app          : app,
    template     : "",
    render       : function (){
      this.$el.empty().html($(Handlebars.templates[this.template](this.model.toJSON())));
      return this;
    },
    onshow       : function (){

    },
    onhide       : function (){

    },
    onunload     : function (){

    },
    initialize   : function (){
      $(self).unload(function (){
        this.undelegateEvents();
        this.stopListening();
        this.onunload();
      }.bind(this));
    },
    showPreloader: function (){
      this.$el.append(this.app.streamPreloader);
    },
    hidePreloader: function (){
      this.app.streamPreloader.detach();
    }
  });

  var LazyRenderView = DefaultView.extend({
    isRendered: false,
    lazyrender: function (){
      if ( !this.isRendered ) {
        this.render();
        this.isRendered = true;
      }
    }
  })

  var UserView = DefaultView.extend({
    el        : "#user-info",
    events    : {
      "click #logout-btn": "logout",
      "click #login-btn" : "login"
    },
    template  : "user",
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, "change", this.render);
      this.render();
    },
    login     : function (){
      this.model.login();
    },
    logout    : function (){
      this.model.logout();
    }
  })

  var TopMenu = DefaultView.extend({
    el            : "#top-menu",
    events        : {
      "click #refresh-btn"  : "refresh",
      "keyup #filterInput"  : "filter"
    },
    show          : function (){
      this.$el.show();
    },
    hide          : function (){
      this.$el.hide();
    },
    initialize    : function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.$filterInput = this.$("#filterInput");
      this.listenTo(this.app.router, "route", this.resetFilterVal);
    },
    resetFilterVal: function (){
      this.$filterInput.val("").keyup();
      this.filter();
    },
    filter        : function (){
      var fValue = this.$filterInput.val().toLowerCase();
      fValue = fValue.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      var rFilter = new RegExp(fValue);
      if ( this.app.curView ) {
        this.app.curView.$el.find(".js-filterable").each(function (i, e){
          $(e).toggle(!!$(e).text().toLowerCase().match(rFilter));
        });
        _baron.update();
      }
    },
    refresh       : function (){
      this.resetFilterVal();
      this.app.curView && this.app.curView.update && this.app.curView.update();
    }
  });

  var Menu = DefaultView.extend({
    el           : "#menu",
    events       : {
      "click .menu-btn": "selectTab"
    },
    initialize   : function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.app.router, "route", this.onRouteChange.bind(this));
    },
    onRouteChange: function (route, r1){
      console.log("_route", route, r1);
      if ( /user/i.test(Backbone.history.fragment) ) {
        this.$el.find(".menu-btn").removeClass("active");
      }
    },
    selectTab    : function (e){
      this.$el.find(".menu-btn").removeClass("active");
//      this.$el.find(".menu-btn[data-route=" + route + "]").addClass("active");
      $(e.target).closest(".menu-btn").addClass("active");
    }
  });

  var InfoView = DefaultView.extend({});

  var ControlView = DefaultView.extend({
    template: "control"
  });

  var SettingsView = LazyRenderView.extend({
    el    : "#settings-screen",
    events: {
      "click input[data-id=\"notificationSound\"]"      : "playSound",
      "click input[data-id=\"customNotificationSound\"]": "uploadSound",
      "change input[type=\"range\"]"                    : "rangeHelper",
      "change input, select"                            : "serialize"
    },

    setDefaultTab: function (value){
      app.router.navigate(value, {trigger: true});
      $('#menu').find('[data-route="' + value + '"]').addClass("active");
    },

    changeThemeType: function (value){
      $("body").toggleClass("white-version", value !== "dark");
    },

    toggleSimpleView: function (value){
      $("body").toggleClass("simple-version", value);
    },

    onModelChange: function (model, options){
      var v = model.get("value");

      switch ( model.get("id") ) {
        case "simpleView":
          this.toggleSimpleView(model.get("value"))
          break;

        case "themeType":
          this.changeThemeType(model.get("value"));
          break;

        default:
          break;
      }
    },

    uploadSound: function (e){
      utils.tabs.create({url: utils.runtime.getURL("common/html/upload")});
    },

    playSound  : function (e){
      b.bgApp.playSound(b.settings.getNotificationSoundSource(), b.settings.get("notificationVolume").get("value") / 100);
    },
    rangeHelper: function (e){
      var t = $(e.target);
      t.siblings(".range-helper").find(".range-helper-value").html(t.val());
    },
    initialize : function (){
      LazyRenderView.prototype.initialize.apply(this, arguments);
      this.setDefaultTab(this.collection.get("defaultTab").get("value"));
      this.$container = this.$el.find("#settings-container");
      this.collection.forEach(function (m){
        this.onModelChange(m);
      }.bind(this));
      this.listenTo(this.collection, "change", this.onModelChange);
//      this.render();
    },
    serialize  : function (){
      var controls = [];
      this.$container.find('input, select').each(function (e){
        var t = $(this),
          value,
          type = t.attr('data-type'),
          controlId = t.attr('data-id');

        if ( type == 'radio' ) {
          if ( t.prop("checked") ) {
            value = t.val();
          } else {
            return;
          }
        }
        if ( type == 'checkbox' ) {
          value = t.prop('checked');
        }
        else if ( type == 'range' ) {
          value = parseInt(t.val(), 10);
        }
        else {
          value = t.val();
        }
        controls.push({id: controlId, value: value});
      });
      this.collection.set(controls, {add: false, remove: false});
    },
    render     : function (){
      var views = this.collection.map(function (control){
        return new ControlView({model: control}).render().$el;
      }, this);
      this.$container.empty().html(views);
      return this;
    }
  });

  var GameView = DefaultView.extend({
    template: "game",
    events  : {
      "contextmenu .stream": "showMenu"
    },

    unfollow: function (){
      var self = this;
      self.showPreloader();
      this.model.unfollow(function (){
        self.hidePreloader();
      });
    },
    follow  : function (){
      var self = this;
      self.showPreloader();
      self.model.follow(function (){
        self.hidePreloader();
      });
    },

    showMenu: function (e){
      var m = this.model.toJSON();
      var self = this;
      m.authorized = app.twitchApi.isAuthorized();

      var menu = new MenuView({
        model: m
      })

      menu.showMenu("contextgamemenu", {y: e.clientY, x: e.clientX});

      menu.$el
        .on('click', '.js-follow-game', function (){
          self.follow();
        })
        .on('click', '.js-unfollow-game', function (){
          self.unfollow();
        })

      return false;
    }
  });

  var MenuView = DefaultView.extend({
    template  : "",
    el        : "#context-menu",
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      $("body").on("click", this.hide.bind(this));
    },
    hide      : function (){
      this.$el.hide();
    },
    showMenu  : function (tmpl, coords){
      var menuEl = $(this.el);
      var y = coords.y;
      var x = coords.x;
      var height = menuEl.height();

      if ( y + height > $(document.body).height() ) {
        y -= height;
      }

      menuEl
        .off()
        .empty()
        .html($(Handlebars.templates[tmpl](this.model)))
        .css({top: y, left: x})
        .show();
      return false;
    }
  })

  var VideoView = DefaultView.extend({
    template: "video"
  });


  var StreamView = DefaultView.extend({
    template  : "stream",
    menuEl    : '#context-menu',
    events    : {
      "contextmenu .stream": "showMenu",
      "click .stream"      : "openStream"
    },
    openStream: function (){
      this.model.openStream();
    },
    openChat  : function (){
      this.model.openChat();
    },
    showMenu  : function (e){
      var self = this;
      var m = this.model.toJSON();
      m.authorized = app.twitchApi.isAuthorized();

      var menu = new MenuView({
        model: m
      })
      menu.showMenu("contextstreammenu", {y: e.clientY, x: e.clientX});

      menu.$el
        .on('click', '.js-open-chat', function (){
          self.model.openChat();
        })
        .on('click', '.js-open-in-multitwitch', function (){
          self.model.openMultitwitch();
        })
        .on('click', '.js-open-stream', function (e){
          self.model.openStream($(e.target).attr("data-type"));
        })
        .on('click', '.js-follow', function (){
          self.follow();
        })
        .on('click', '.js-unfollow', function (){
          self.unfollow();
        })

      return false;
    },
    unfollow  : function (){
      var self = this;
      self.showPreloader();
      this.model.unfollow(function (){
        self.hidePreloader();
      });
    },
    follow    : function (){
      var self = this;
      self.showPreloader();
      self.model.follow(function (){
        self.hidePreloader();
      });
    },
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, "change", this.render);
    }
  });

  var ListView = LazyRenderView.extend({
    template   : "screenmessage",
    messages   : {
      "auth"           : {
        text: "__MSG_m73__"
      },
      "api"            : {
        text: "__MSG_m48__"
      },
      "nostreams"      : {
        header: "Your Following streams tab is empty.",
        text  : "Only live following streams will be shown here."
      },
      "novideo"        : {
        text: "__MSG_m49__"
      },
      "nosearchresults": {
        text: "__MSG_m50__"
      },
      "nosearchquery"  : {
        text: "No search query"
      },
      "nofollowedgames": {
        header: "Your Following games tab is empty.",
        text  : "No one is streaming your favorites games now."
      }
    },
    itemView   : null, // single item view
    initialize : function (opts){
      LazyRenderView.prototype.initialize.apply(this, arguments);
      this.container = opts.container || this.$el.find(".screen-content");
      this.listenTo(this.collection, "add update sort remove reset", this.render);
      this.listenTo(this.collection, "_error", this.showMessage.bind(this));
      this.listenTo(this.collection, "addarray", this.render.bind(this));
    },
    onunload   : function (){
      this.collection.trigger('unload');
    },
    showMessage: function (type){
      if ( this.messages[type] ) {
        var text = this.messages[type];
        this.container.empty().html(Handlebars.templates[this.template](text));
      }
    },
    loadNext   : function (){
      if ( this.collection.loadNext ) {
        this.collection.loadNext();
      }
    },
    update     : function (){
      this.container.empty().append(this.app.preloader);
      this.collection.update();
    },
    render     : function (models){
      //if ( this.collection.lastErrorMessage ) {
      //  this.container.empty();
      //  this.showMessage(this.collection.lastErrorMessage);
      //} else {
      var elementsToRender = models ? models : this.collection;
      var views = elementsToRender.map(function (item){
        return new this.itemView({model: item}).render().$el;
      }, this);
      if ( models ) {
        this.container.append($(document.createDocumentFragment()).html(views));
      } else {
        this.container.empty().html(views);
      }
      //}
    }
  });

  var ChannelNotificationView = DefaultView.extend({
    template   : "channelnotification",
    events     : {
      "click .channel-logo": "openProfile"
    },
    openProfile: function (){
      this.model.openProfilePage();
    }
  })

  var ChannelNotificationListView = ListView.extend({
    itemView      : ChannelNotificationView,
    events        : {
      "click .undo-message a"       : "undo",
      "change .screen-content input": "serialize",
      "click .dropdown-menu a"      : "toggle"
    },
    initialize    : function (){
      this.$undoMessage = this.$el.find(".undo-message");
      this.$selectMenuBtn = this.$el.find(".dropdown .btn");
      this.listenTo(this.collection, "add update remove reset", this.toggleDropdown.bind(this));
      this.toggleDropdown();
      ListView.prototype.initialize.apply(this, arguments);
    },
    toggleDropdown: function (){
      this.$selectMenuBtn.toggleClass("disabled", this.collection.length == 0);
    },
    update        : function (){
      this.$selectMenuBtn.addClass("disabled");
      this.$undoMessage.css({visibility: "hidden"});
      ListView.prototype.update.apply(this, arguments);
    },

    onhide   : function (){
      this.$undoMessage.css({visibility: "hidden"});
    },
    onshow   : function (){
      //update once on view show if not updated before
      if ( !this.collection.length ) {
        this.update();
      }
    },
    undo     : function (){
      this.collection.restore();
      this.$undoMessage.css({visibility: "hidden"});
    },
    toggle   : function (e){
      var type = $(e.currentTarget).data("notification-type");
      var val = $(e.currentTarget).data("notification-value") == "1" ? true : false;
      this.$el
        .find(".screen-content input[data-notification-type='" + type + "']")
        .prop("checked", val);

      this.$undoMessage.css({visibility: "visible"});
      this.collection.store();
      this.serialize();
    },
    serialize: function (){
      var attributes = [];
      this.$el.find(".screen-content [data-channel-id]")
        .map(function (i, e){
          e = $(e);
          attributes.push({
            _id             : parseInt(e.attr("data-channel-id")),
            notificationOpts: {
              desktop: e.find("input[data-notification-type='desktop']").prop("checked"),
              sound  : e.find("input[data-notification-type='sound']").prop("checked")
            }
          });
        })
      this.collection.set(attributes, {add: false, remove: false, silent: true});
      this.collection.saveToStorage();
    }
  })

  var GameListView = ListView.extend({
    itemView: GameView
  });

  var StreamListView = ListView.extend({
    itemView: StreamView
  });

  var SearchView = ListView.extend({
    events  : {
      "keyup #searchInput": "onkeyup",
      "click #search"     : "search"
    },
    itemView: StreamView,
    onkeyup : function (e){
      if ( e.keyCode == 13 ) {
        this.search();
      }
    },
    search  : function (){
      this.collection.query = this.$el.find("#searchInput").val();
      this.update();
    }
  });

  var VideoListView = ListView.extend({
    itemView : VideoView,
    setStream: function (channel){
      this.lazyrender();
      this.collection.channel = channel;
      this.update();
    }
  });

  var ExtendedGameView = DefaultView.extend({
    template          : "gameextended",
    events            : {
      "click .game-follow": "follow"
    },
    render            : function (){
      DefaultView.prototype.render.apply(this, arguments);
      this.toggleActiveButton(this.view);
    },
    setCurrentView    : function (game, view){
      this.view = view;
      this.toggleActiveButton(this.view);
    },
    toggleActiveButton: function (view){
      var $buttons = this.$el.find(".button").removeClass("active");
      if ( /streams$/i.exec(view) ) {
        $buttons.eq(0).addClass("active");
      }

      if ( /videos$/i.exec(view) ) {
        $buttons.eq(1).addClass("active");
      }
    },
    follow            : function (){
      this.$el.find(".game-follow").addClass("active");
      this.model.follow();
    },
    initialize        : function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.app.router, "route:gameLobby", this.setCurrentView.bind(this));
    }
  })

  var GameLobbyView = DefaultView.extend({

    initialize      : function (opts){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.app.router, "route:gameLobby", this.toggleActiveView.bind(this));
      this.listenTo(this.app.router, "route", this.toggle.bind(this));

      this.gameView = new ExtendedGameView({
        el   : "#gamelobby-game",
        model: this.model.game
      })

      this.streamView = new StreamListView({
        el        : "#gamelobby-streams",
        collection: b.gameLobby.streams
      });

      this.videoView = new VideoListView({
        el        : "#gamelobby-videos",
        collection: b.gameLobby.videos
      })

      this.gameView.render();
      this.videoView.render();
      this.streamView.render();
      this.listenTo(this.model.game, "change", this.update);
    },
    toggle          : function (r){
      if ( /gamelobby/i.exec(r) ) {
        $("#content").css({top: 154});
      } else {
        $("#content").css({top: 31});
      }
    },
    loadNext        : function (){
      this.videoView.loadNext();
      this.streamView.loadNext();
    },
    toggleActiveView: function (game, view){
      this.$el.find(".tabs [tab-id]").hide();
      this.$el.find(".tabs [tab-id='" + view + "']").show();
    },
    update          : function (){
      this.gameView.render();
      this.videoView.update();
      this.streamView.update();
    },
    setGame         : function (game){
      this.model.setGame(game);
    }
  })

  var DonationView = DefaultView.extend({
    template: "donation"
  });

  var DonationListView = DefaultView.extend({
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.collection, "reset", this.render);
      this.render();
    },
    render    : function (){
      var views = this.collection.map(function (item){
        return new DonationView({model: item}).render().$el;
      }, this);

      this.$el.empty().html(views);
    }
  });

  var ContributorView = DefaultView.extend({
    template: "contributor"
  });

  var ContributorListView = DefaultView.extend({
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.collection, "reset", this.render);
      this.render();
    },
    render    : function (){
      var views = this.collection.map(function (item){
        return new ContributorView({model: item}).render().$el;
      }, this);

      this.$el.empty().html(views);
    }
  });
})(window);