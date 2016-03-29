(function (w, app){
  "use strict";

  var Router = app.Router = Backbone.Router.extend({
    routes: {
      "topstreams"          : "topstreams",
      "info"                : "info",
      "following"           : "following",
      "followedgames"       : "followedGames",
      "user"                : "user",
      "user/notifications"  : "notifications",
      "user/languages"      : "",
      "settings"            : "settings",
      "search"              : "search",
      "videos/:stream"      : "videos",
      "browse"              : "browseGames",
      "browse/:game/streams": "gameStreamsView",
      "browse/:game/videos" : "gameVideosView"
    },

    videos: function (stream){
      app.views.videos.setStream(decodeURIComponent(stream));
    }
  });

})(window, window.app);
