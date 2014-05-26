(function (w, app){
  "use strict";

  var defaultRoute = function (fn){
    var decodedArgs = [].slice.call(arguments, 0).map(function (a){
      return decodeURIComponent(a);
    });
    return fn.apply(null, decodedArgs);
  };

  var Router = app.Router = Backbone.Router.extend({
    routes: {
      "topstreams"    : "topstreams",
      "info"          : "info",
      "following"     : "following",
      "settings"      : "settings",
      "search"        : "search",
      "videos/:stream": "videos",
      "browse"        : "browseGames",
      "browse/:game"  : "browseStreams"
    },

    topstreams: function (){
    },

    info: function (){
    },

    settings: function (){
    },

    search: function (){
    },

    videos: function (stream){
      stream = decodeURIComponent(stream);
      app.views.videos.setStream(stream);
    },

    following    : function (){
    },

    browseGames  : function (){
    },

    browseStreams: function (game){
      game = decodeURIComponent(game);
      app.views.browseStreams.setGame(game);
    }
  });

})(window, window.app);
