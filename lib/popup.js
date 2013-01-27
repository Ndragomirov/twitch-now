"use strict";

var b = chrome.extension.getBackgroundPage();

var app = _.extend({}, Backbone.Events);

app.preloader = $("<div id='preloader'><img src='../css/img/spinner.gif'/></div>");
app.twitchApi = b.twitchApi;
app.streamPreloader = $("<div id='preloader-stream'><img src='../css/img/spinner.gif'/></div>");
app.currentView = null;
app.views = {};
app.windowOpened = false;
app.container = $('#content');
app.router = new Router;

app.loadScripts = function () {
    //TODO move google-analytics here
};

app.lazyload = function () {
    var container = app.container;
    var height = container.height();
    var scrollTop = container.scrollTop();
    container.find('.lazy:visible:not([src])').each(function () {
        var t = $(this);
        var pos = t.position();
        if (pos.top >= scrollTop && pos.top <= scrollTop + height) {
            t.attr('src', t.attr('data-original'));
        }
    });
    setTimeout(function () {
        app.lazyload()
    }, 100);
};

app.init = function () {

    var views = app.views;

    views.menu = new Menu;

    views.topMenu = new TopMenu;

    views.browseStreams = new BrowseStreamListView({
        el:"#browse-game-streams-screen",
        collection:b.browsing
    });

    views.following = new StreamListView({
        el:"#stream-screen",
        collection:b.following
    });

    views.videos = new VideoListView({
        el:"#video-screen",
        collection:b.videos
    });

    views.settings = new SettingsView({
        collection:b.settings
    });

    views.search = new SearchView({
        el:"#search-screen",
        collection:b.search
    });

    views.browseGames = new GameListView({
        el:"#browse-game-screen",
        collection:b.games
    });

    views.login = new LoginView({
        model:b.twitchApi
    });

    $('.tip').tooltip();

    Backbone.history.start();

    this.router.on("all", function (r) {
        var route = r.split(":")[1];
        app.curView = app.views[route];
    });

    var route = b.twitchApi.isAuthorized() ? "following" : "browse";
    this.router.navigate(route, {trigger:true});

    $('#menu').find('[data-route="' + route + '"]').addClass("active");

    $("body")
        .on("click", function () {
            $('#context-menu').hide();
        })
        .on('click', '*[data-route]', function () {
            var route = $(this).attr('data-route');
            window.location.hash = '#' + route;
        })
        .one('mouseenter', function () {
            app.lazyload();
            app.loadScripts();
        })
        .on('click', '.js-tab', function () {
            var href = $(this).attr('data-href');
            chrome.tabs.create({ url:href });
            return false;
        })

        .on('click', '.js-window', function () {
            var windowOpts = JSON.parse($(this).attr('data-window-opts') || "{}");
            chrome.windows.create($.extend({url:$(this).attr('data-href')}, windowOpts));
            return false;
        })
};

Handlebars.registerHelper('h-checked', function (input, parent) {
    var v = input && parent ?
        input.id === parent.value :
        this.value;
    return  v ? 'checked' : '';
});

Handlebars.registerHelper('h-prettydate', function (v) {
    return humaneDate(v);
});

Handlebars.registerHelper('h-enc', function (v) {
    return encodeURIComponent(v);
});

Handlebars.registerHelper('h-selected', function (t, ctx) {
    return ctx.value === t.id ? 'selected' : '';
});

var DefaultView = Backbone.View.extend({
    app:app,
    initialize:function () {
        $(self).unload(function () {
            this.undelegateEvents();
            this.stopListening();
        }.bind(this));
    }
});

var TopMenu = DefaultView.extend({
    el:"#top-menu",
    events:{
        "click #refresh-btn":"refresh",
        "keyup #filterInput":"filter"
    },
    show:function () {
        this.$el.show();
    },
    hide:function () {
        this.$el.hide();
    },
    initialize:function () {
        DefaultView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.app.router, "route:info route:settings route:login route:search", this.hide.bind(this));
        this.listenTo(this.app.router, "route:following route:browseGames route:browseStreams", this.resetFilterVal.bind(this));
        this.listenTo(this.app.router, "route:following route:browseGames route:browseStreams", this.show.bind(this));
    },
    resetFilterVal:function () {
        this.$("#filterInput").val("").keyup();
        this.filter();
    },
    filter:function () {
        var fValue = this.$("#filterInput").val().toLowerCase();
        var rFilter = new RegExp(fValue);
        if (this.app.curView) {
            this.app.curView.$el.find(".stream").each(function (i, e) {
                $(e).toggle(!!$(e).text().toLowerCase().match(rFilter));
            });
        }
    },
    refresh:function () {
        this.resetFilterVal();
        this.app.curView && this.app.curView.update && this.app.curView.update();
    },
    expand:function () {
        this.$("#filter-bar").toggle();
    }
});

var Menu = DefaultView.extend({
    el:"#menu",
    events:{
        "click .menu-btn":"selectTab"
    },
    selectTab:function (e) {
        this.$(".menu-btn").removeClass("active");
        $(e.target).closest(".menu-btn").addClass("active");
    }
});

var ControlView = DefaultView.extend({
    render:function () {
        this.$el.html($(Handlebars.templates["control.html"](this.model.toJSON())));
        return this;
    }
});

var SettingsView = DefaultView.extend({
    el:"#settings-screen",
    events:{
        "click input[data-id=\"notificationSound\"]":"playSound",
        "change input[type=\"range\"]":"rangeHelper",
        "click #save-settings-btn":"serialize"
    },
    playSound:function (e) {
        var sound = new Audio();
        sound.src = $(e.target).val();
        sound.play();
    },
    rangeHelper:function (e) {
        var t = $(e.target);
        t.siblings(".range-helper").find(".range-helper-value").html(t.val());
    },
    initialize:function () {
        DefaultView.prototype.initialize.apply(this, arguments);
        this.$container = this.$el.find("#settings-container");
        this.render();
    },
    serialize:function () {
        var controls = [];
        this.$container.find('input, select').each(function (e) {
            var t = $(this),
                value,
                type = t.attr('data-type'),
                controlId = t.attr('data-id');

            //пропускаем radio инпуты без аттрибута checked
            if (type == 'radio') {
                if (t.prop("checked")) {
                    value = t.val();
                } else {
                    return;
                }
            }
            if (type == 'checkbox') {
                value = t.prop('checked');
            }
            else if (type == 'range') {
                value = parseInt(t.val(), 10);
            }
            else {
                value = t.val();
            }
            controls.push({id:controlId, value:value});
        });
        this.collection.update(controls, {add:false, remove:false});
    },
    render:function () {
        var views = this.collection.map(function (control) {
            return new ControlView({model:control}).render().$el;
        }, this);
        this.$container.empty().html(views);
        return this;
    }
});

var LoginView = DefaultView.extend({
    el:"#login-screen",
    events:{
        "click #login-btn":"auth"
    },
    initialize:function () {
        DefaultView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, "authorize", this.redirect);
    },
    redirect:function () {
        this.app.navigate("following", {trigger:true});
    },
    auth:function () {
        this.model.authorize();
    }
});

var GameView = DefaultView.extend({
    render:function () {
        this.$el.html($(Handlebars.templates["game.html"](this.model.toJSON())));
        return this;
    }
});

var VideoView = DefaultView.extend({
    render:function () {
        this.$el.html($(Handlebars.templates["video.html"](this.model.toJSON())));
        return this;
    }
});

var StreamView = DefaultView.extend({
    menuEl:$('#context-menu'),
    events:{
        "contextmenu .stream":"showMenu",
        "click .stream":"openStream"
    },
    openStream:function () {
        this.model.openStream();
    },
    openChat:function () {
        this.model.openChat();
    },
    showMenu:function (e) {
        var self = this;
        var y = e.clientY;
        var x = e.clientX;
        var height = this.menuEl.height();
        var m = this.model.toJSON();
        m.authorized = app.twitchApi.isAuthorized();

        if (y + height > $(document.body).height()) {
            y -= height;
        }

        this.menuEl
            .off()
            .empty()
            .html($(Handlebars.templates["contextmenu.html"](m)))
            .css({top:y, left:x})
            .on('click', '.js-open-chat', function () {
                self.openChat();
            })
            .on('click', '.js-follow', function () {
                self.follow();
            })
            .show();
        return false;
    },
    follow:function () {
        var preloader = this.app.streamPreloader;
        this.$el.append(preloader);
        this.model.follow(function () {
            preloader.detach();
        });
    },
    initialize:function () {
        DefaultView.prototype.initialize.apply(this, arguments);
        this.listenTo(this.model, "change", this.render);
    },
    render:function () {
        this.$el.empty().html($(Handlebars.templates["stream.html"](this.model.toJSON())));
        return this;
    }
});

var ListView = DefaultView.extend({
    messages:{
        "apierror":"Unable to load streams. Check your internet connection and try to update it manually.",
        "novideo":"No videos are available for this channel",
        "nosearchresults":"No search results"
    },
    itemView:null, // single item view
    initialize:function () {
        DefaultView.prototype.initialize.apply(this, arguments);
        this.container = this.$el.find(".screen-content");
        this.listenTo(this.collection, "add update sort", this.render);
        this.listenTo(this.collection, "apierror", this.showError);
        this.render();
    },
    showMessage:function (text) {
        this.container.html(Handlebars.templates["screenmessage.html"]({
            text:text
        }));
    },
    showError:function () {
        this.showMessage(this.messages.apierror);
    },
    update:function () {
        this.collection.updateData();
        this.container.empty().append(this.app.preloader);
    },
    render:function () {
        var views = this.collection.map(function (item) {
            return new this.itemView({model:item}).render().$el;
        }, this);
        this.container.empty().html(views);
    }
});

var GameListView = ListView.extend({
    itemView:GameView
});

var StreamListView = ListView.extend({
    itemView:StreamView
});

var SearchView = ListView.extend({
    events:{
        "keyup #searchInput":"onkeyup",
        "click #search":"search"
    },
    itemView:StreamView,
    onkeyup:function (e) {
        if (e.keyCode == 13) {
            this.search();
        }
    },
    search:function () {
        this.collection.query = this.$el.find("#searchInput").val();
        this.update();
    },
    render:function () {
        if (this.collection.length) {
            ListView.prototype.render.apply(this, arguments);
        } else {
            this.showMessage(this.messages.nosearchresults);
        }
    }
});

var VideoListView = ListView.extend({
    itemView:VideoView,
    setStream:function (channel) {
        this.collection.channel = channel;
        this.update();
    },
    render:function () {
        if (this.collection.length) {
            ListView.prototype.render.apply(this, arguments);
        } else {
            this.showMessage(this.messages.novideo);
        }
    }
});

var BrowseStreamListView = StreamListView.extend({
    setGame:function (game) {
        this.collection.game = game;
        this.update();
    }
});

app.init();