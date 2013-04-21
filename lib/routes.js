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
            "topstreams"    : "topstreams",
            "info"          : "info",
            "following"     : "following",
            "settings"      : "settings",
            "search"        : "search",
            "videos/:stream": "videos",
            "browse"        : "browseGames",
            "browse/:game"  : "browseStreams"
        },

        topstreams: function () {
            $( '.screen' ).hide();
            $( '#topstreams-screen' ).show();
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

        videos: function ( stream ) {
            stream = decodeURIComponent( stream );
            $( '.screen' ).hide();
            $( '#video-screen' ).show();
            app.views.videos.setStream( stream );
        },

        following    : function () {
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
