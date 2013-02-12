(function ( w, app ) {
    "use strict";

    var defaultRoute = function ( fn ) {
        var decodedArgs = [].slice.call( arguments, 0 ).map( function ( a ) {
            return decodeURIComponent( a );
        } );
        return fn.apply( null, decodedArgs );
    };

    var Router = app.Router = Backbone.Router.extend( {
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
            $( '.screen' ).hide();
            $( '#info-screen' ).show();
        },

        settings: function () {
            $( '.screen' ).hide();
            $( '#settings-screen' ).show();
        },

        search: function () {
            $( '.screen' ).hide();
            $( '#search-screen' ).show();
        },

        login: function () {
            $( '.screen' ).hide();
            $( '#login-screen' ).show();
        },

        videos: function ( stream ) {
            stream = decodeURIComponent( stream );
            $( '.screen' ).hide();
            $( '#video-screen' ).show();
            app.views.videos.setStream( stream );
        },

        following    : function () {
            //redirect to login page
            if (!app.b.twitchApi.isAuthorized()) return  window.location.hash = '#login';
            $( '.screen' ).hide();
            $( '#stream-screen' ).show();
        },
        browseGames  : function () {
            $( '.screen' ).hide();
            $( '#browse-game-screen' ).show();
        },
        browseStreams: function ( game ) {
            game = decodeURIComponent( game );
            $( '.screen' ).hide();
            $( '#browse-game-streams-screen' ).show();
            app.views.browseStreams.setGame( game );
        }
    } );

})( window, window.app );
