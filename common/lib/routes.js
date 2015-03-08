(function (w, app){
  "use strict";

  var Router = app.Router = Backbone.Router.extend({
    routes: {
      "topstreams"          : "topstreams",
      "info"                : "info",
      "following"           : "following",
      "followedgames"       : "followedGames",
      "user"                : "user",
      "settings"            : "settings",
      "search"              : "search",
      "videos/:stream"      : "videos",
      "browse"              : "browseGames",
      "browse/:game/streams": "gameLobbyStreams",
      "browse/:game/videos" : "gameLobbyVideos"
    },

    videos: function (stream){
      app.views.videos.setStream(decodeURIComponent(stream));
    },

    gameLobbyStreams: function (game){
      app.views.gameLobby.setGame(decodeURIComponent(game));
    },

    gameLobbyVideos: function (game){
      app.views.gameLobby.setGame(decodeURIComponent(game));
    }
  });

})(window, window.app);
