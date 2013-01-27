"use strict";

var Router = Backbone.Router.extend({
    routes: {
        "info"          : "info",
        "following"     : "following",
        "settings"      : "settings",
        "search"        : "search",
        "videos/:stream": "videos",
        "browse"        : "browseGames",
        "browse/:game"  : "browseStreams",
        "login"         : "login"
    },

    info: function () {
        $('.screen').hide();
        $('#info-screen').show();
    },

    settings: function () {
        $('.screen').hide();
        $('#settings-screen').show();
    },

    search: function () {
        $('.screen').hide();
        $('#search-screen').show();
    },

    login: function () {
        $('.screen').hide();
        $('#login-screen').show();
    },

    videos: function ( stream ) {
        stream = decodeURIComponent(stream);
        $('.screen').hide();
        $('#video-screen').show();
        app.views.videos.setStream(stream);
    },

    following    : function () {
        //redirect to login page
        if ( !b.twitchApi.isAuthorized() ) return  window.location.hash = '#login';
        $('.screen').hide();
        $('#stream-screen').show();
    },
    browseGames  : function () {
        $('.screen').hide();
        $('#browse-game-screen').show();
    },
    browseStreams: function ( game ) {
        game = decodeURIComponent(game);
        $('.screen').hide();
        $('#browse-game-streams-screen').show();
        app.views.browseStreams.setGame(game);
    }
});