(function (w){
  "use strict";

  var app = window.app = _.extend({}, Backbone.Events);
  var b = app.b = utils._getBackgroundPage();

  app.twitchApi = b.twitchApi;
  app.currentView = null;
  app.views = {};
  app.windowOpened = false;

  app.resetScroll = function (){
    app.container.scrollTop(0);
  }

  app.lazyload = function (){
    var height = app.scroller.height();
    var scrollTop = app.scroller.scrollTop();
    app.scroller.find('.lazy').filter(':visible').each(function (){
      var t = $(this);
      var pos = t.position();
      if ( pos.top >= scrollTop && pos.top <= scrollTop + height ) {
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
      app.curView = app.views[viewName];
      $('.screen').hide();
      $('#filterInput:visible, #searchInput:visible').focus();
      app.curView.$el.show();
      app.resetScroll();
    }
  }

  app.init = function (){
    app.container = $('#content');
    app.scroller = app.container.find(".scroller");
    app.preloader = $("<div id='preloader'><img src='../img/spinner.gif'/></div>");
    app.streamPreloader = $("<div id='preloader-stream'><img src='../img/spinner.gif'/></div>");

    i18n.setGetMessageFn(utils.i18n.getMessage);
    i18n.replace(document.body);
    i18n.observe(document.body);

    var views = app.views;
    this.router = new this.Router;

    views.menu = new Menu;

    views.topMenu = new TopMenu;

    var _baron = baron({
      root    : '#content',
      scroller: '.scroller',
      bar     : '.scroller__bar',
      barOnCls: 'baron'
    }).autoUpdate().controls({
        delta: 120
      })

    Backbone.history.start();

    this.router.on("all", function (r){
      var route = r.split(":")[1];
      console.log("ROUTE", route);
      if ( route ) {
        app.setCurrentView(route);
      }
    });

    var extGameView = new ExtendedGameView({
      model: b.gameLobby.game,
      el   : ".game"
    })

    views.gameLobbyStreams = new StreamListView({
      el        : "#gamelobby-streams-screen",
      collection: b.gameLobby.streams
    });

    views.gameLobbyVideos = new VideoListView({
      el        : "#gamelobby-videos-screen",
      collection: b.gameLobby.videos
    })

    views.gameLobby = new GameLobbyView({
      model     : b.gameLobby,
      gameView  : extGameView,
      streamView: views.gameLobbyStreams,
      videoView : views.gameLobbyVideos
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

    views.userView = new UserView({
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
        utils.tabs.create({ url: href });
        e.preventDefault();
      })

      .on('click', '.js-window', function (e){
        var windowOpts = JSON.parse($(this).attr('data-window-opts') || "{}");
        utils.windows.create($.extend({url: $(this).attr('data-href')}, windowOpts));
        e.preventDefault();
      })

    $('.tip').tooltip();
  };

  var DefaultView = Backbone.View.extend({
    app       : app,
    template  : "",
    render    : function (){
      this.$el.empty().html($(Handlebars.templates[this.template](this.model.toJSON())));
      return this;
    },
    initialize: function (){
      $(self).unload(function (){
        this.undelegateEvents();
        this.stopListening();
      }.bind(this));
    }
  });

  var UserView = DefaultView.extend({
    el        : "#user-info",
    events    : {
      "click #logout-btn": "logout",
      "click #login-btn" : "login"
    },
    template  : "user.html",
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
      "click #refresh-btn": "refresh",
      "keyup #filterInput": "filter"
    },
    show          : function (){
      this.$el.show();
    },
    hide          : function (){
      this.$el.hide();
    },
    initialize    : function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.app.router, "route", this.resetFilterVal);
    },
    resetFilterVal: function (){
      this.$("#filterInput").val("").keyup();
      this.filter();
    },
    filter        : function (){
      var fValue = this.$("#filterInput").val().toLowerCase();
      fValue = fValue.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      var rFilter = new RegExp(fValue);
      if ( this.app.curView ) {
        this.app.curView.$el.find(".js-filterable").each(function (i, e){
          $(e).toggle(!!$(e).text().toLowerCase().match(rFilter));
        });
      }
    },
    refresh       : function (){
      this.resetFilterVal();
      this.app.curView && this.app.curView.update && this.app.curView.update();
    }
  });

  var Menu = DefaultView.extend({
    el       : "#menu",
    events   : {
      "click .menu-btn": "selectTab"
    },
    selectTab: function (e){
      this.$(".menu-btn").removeClass("active");
      $(e.target).closest(".menu-btn").addClass("active");
    }
  });

  var InfoView = DefaultView.extend({

  });

  var ControlView = DefaultView.extend({
    template: "control.html"
  });

  var SettingsView = DefaultView.extend({
    el    : "#settings-screen",
    events: {
      "click input[data-id=\"notificationSound\"]": "playSound",
      "change input[type=\"range\"]"              : "rangeHelper",
      "change input, select"                      : "serialize"
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

      switch (model.get("id")) {
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

    playSound  : function (e){
      b.bgApp.playSound($(e.target).val());
    },
    rangeHelper: function (e){
      var t = $(e.target);
      t.siblings(".range-helper").find(".range-helper-value").html(t.val());
    },
    initialize : function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.setDefaultTab(this.collection.get("defaultTab").get("value"));
      this.$container = this.$el.find("#settings-container");
      this.collection.forEach(function (m){
        this.onModelChange(m);
      }.bind(this));
      this.listenTo(this.collection, "change", this.onModelChange);
      this.render();
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
    events: {
      "contextmenu .stream": "showMenu"
    },

    showMenu: function (e){
      var m = this.model.toJSON();
      m.authorized = app.twitchApi.isAuthorized();

      var menu = new MenuView({
        model: m
      })

      return menu.showMenu("contextgamemenu.html", {y: e.clientY, x: e.clientX});
    },
    template: "game.html"
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
    template: "video.html"
  });

  var StreamView = DefaultView.extend({
    template  : "stream.html",
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
      menu.showMenu("contextstreammenu.html", {y: e.clientY, x: e.clientX});

      menu.$el
        .on('click', '.js-open-chat', function (){
          self.model.openChat();
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
      var preloader = this.app.streamPreloader;
      this.$el.append(preloader);
      this.model.unfollow(function (){
        preloader.detach();
      });
    },
    follow    : function (){
      var preloader = this.app.streamPreloader;
      this.$el.append(preloader);
      this.model.follow(function (){
        preloader.detach();
      });
    },
    initialize: function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.listenTo(this.model, "change", this.render);
    }
  });

  var ListView = DefaultView.extend({
    template   : "screenmessage.html",
    messages   : {
      "autherror"      : "__MSG_m73__",
      "apierror"       : "__MSG_m48__",
      "novideo"        : "__MSG_m49__",
      "nosearchresults": "__MSG_m50__"
    },
    itemView   : null, // single item view
    initialize : function (){
      DefaultView.prototype.initialize.apply(this, arguments);
      this.container = this.$el.find(".screen-content");
      this.listenTo(this.collection, "add update sort remove reset", this.render);
      this.listenTo(this.collection, "apierror", this.showMessage.bind(this, this.messages.apierror));
      this.listenTo(this.collection, "autherror", this.showMessage.bind(this, this.messages.autherror));
      this.render();
    },
    showMessage: function (text){
      this.container.html(Handlebars.templates[this.template]({
        text: text
      }));
    },
    update     : function (){
      this.collection.updateData();
      this.container.empty().append(this.app.preloader);
    },
    render     : function (){
      var views = this.collection.map(function (item){
        return new this.itemView({model: item}).render().$el;
      }, this);
      this.container.empty().html(views);
    }
  });

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
    },
    render  : function (){
      if ( this.collection.length ) {
        ListView.prototype.render.apply(this, arguments);
      } else {
        this.showMessage(this.messages.nosearchresults);
      }
    }
  });

  var VideoListView = ListView.extend({
    itemView : VideoView,
    setStream: function (channel){
      this.collection.channel = channel;
      this.update();
    },
    render   : function (){
      if ( this.collection.length ) {
        ListView.prototype.render.apply(this, arguments);
      } else {
        this.showMessage(this.messages.novideo);
      }
    }
  });

  var ExtendedGameView = DefaultView.extend({
    template          : "gameextended.html",
    initialize        : function (){
      this.listenTo(this.app.router, "route", this.toggle);
      this.listenTo(this.app.router, "route", this.toggleActiveButton);
      DefaultView.prototype.initialize.apply(this, arguments);
      this.render();
    },
    toggleActiveButton: function (r){
      var $buttons = this.$el.find(".button").removeClass("active");
      if ( /gamelobbystreams/i.exec(r) ) {
        $buttons.eq(0).addClass("active");
      }

      if ( /gamelobbyvideos/i.exec(r) ) {
        $buttons.eq(1).addClass("active");
      }
    },
    toggle            : function (r){
      if ( /gamelobby/i.exec(r) ) {
        this.show();
      } else {
        this.hide();
      }
    },
    show              : function (){
      this.$el.show();
      $("#content").css({top: 154});
    },
    hide              : function (){
      this.$el.hide();
      $("#content").css({top: 31});
    }
  })

  var GameLobbyView = DefaultView.extend({
    initialize: function (options){
      this.gameView = options.gameView;
      this.videoView = options.videoView;
      this.streamView = options.streamView;
      this.listenTo(this.model.game, "change:game", this.update);
    },

    update: function (){
      this.gameView.render();
      this.videoView.update();
      this.streamView.update();
    },

    setGame: function (game){
      this.model.setGame(game);
    }
  })

  var DonationView = DefaultView.extend({
    template: "donation.html"
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
    template: "contributor.html"
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