"use strict";

var app = {};

app.del = function ( /*keys*/ ) {
    for ( var i = 0; i < arguments.length; i++ ) {
        delete localStorage[arguments[i]];
    }
};

app.get = function ( key ) {
    return  localStorage.hasOwnProperty( key ) ?
        JSON.parse( localStorage[ key ] ) :
        undefined;
};

app.set = function ( key, val ) {
    localStorage[ key ] = JSON.stringify( val );
};

app.sendNotification = function () {
    //close all previous opened windows
    var notificationWindows = chrome.extension.getViews( {
        type: 'notification'
    } );
    notificationWindows.forEach( function ( window ) {
        window.close();
    } );
    var n = webkitNotifications.createHTMLNotification( "notification.html" );
    setTimeout( function () {
        n.cancel();
    }, 8000 );
    n.show();
};

app.clearBadge = function () {
    app.setBadge( "" );
};

app.setBadge = function ( text ) {
    text += "";
    text = text === "0" ? "" : text;
    chrome.browserAction.setBadgeText( {
        text: text
    } )
};

app.playSound = function ( path ) {
    new Audio( path ).play();
};

app.init = function () {
    app.clearBadge();
};

var defaultSettings = [
    {
        id    : "viewSort",
        desc  : "Sort streams by",
        type  : "select",
        select: true,
        opts  : [
            { id: "viewers|1", name: "viewers asc" },
            { id: "viewers|-1", name: "viewers desc"},
            { id: "name|1", name: "title A-Z" },
            { id: "name|-1", name: "title Z-A" },
            { id: "created_at|-1", name: "recent" }
        ],
        show  : true,
        value : "viewers|-1"
    },
    {
        id   : "openStreamIn",
        desc : "Open streams at",
        type : "radio",
        radio: true,
        opts : [
            {id: "oldlayout", name: "old layout"},
            {id: "newlayout", name: "new layout"},
            {id: "popout", name: "popout"}
        ],
        show : true,
        value: "newlayout"
    },
    {
        id   : "openChatIn",
        desc : "Open chat in",
        type : "radio",
        radio: true,
        opts : [
            {id: "newwindow", name: "new window"},
            {id: "newtab", name: "new tab"}
        ],
        show : true,
        value: "newwindow"
    },
    {
        id      : "showBadge",
        checkbox: true,
        desc    : "Show badge with live following streams count",
        type    : "checkbox",
        show    : true,
        value   : true
    },
    {
        id      : "showDesktopNotification",
        checkbox: true,
        desc    : "Show notifications when following streams go live",
        type    : "checkbox",
        show    : true,
        value   : true
    },
    {
        id   : "closeNotificationDelay",
        range: true,
        desc : "Autoclose notification after",
        type : "range",
        tip  : "sec",
        min  : 5,
        value: 8,
        max  : 60
    },
    {
        id      : "playNotificationSound",
        checkbox: true,
        show    : true,
        desc    : "Play sound notification",
        type    : "checkbox",
        value   : false
    },
    {
        id   : "notificationSound",
        type : "radio",
        desc : "Select the sound of notification",
        radio: true,
        show : true,
        opts : [
            {id: "../audio/ding.ogg", name: "ding"},
            {id: "../audio/chime.mp3", name: "chime"},
            {id: "../audio/click.wav", name: "click"}
        ],
        value: "../audio/ding.ogg"
    }
];

var Control = Backbone.Model.extend( {} );

var Settings = Backbone.Collection.extend( {
    model: Control,

    initialize: function () {
        var storedSettings = app.get( "settings" ) || [];
        var actualSettings = defaultSettings.map( function ( defaulControl ) {
            var saved = _.find( storedSettings, function ( storedControl ) {
                return storedControl.id === defaulControl.id
            } );
            defaulControl.value = saved ? saved.value : defaulControl.value;
            return defaulControl;
        } );
        this.add( actualSettings );
        this.on( "change", this.saveToStorage );
    },

    saveToStorage: function () {
        app.set( "settings", this.toJSON() );
    }
} );

var TwitchItemModel = Backbone.Model.extend( {
    idAttribute: "_id"
} );

var Video = TwitchItemModel.extend();

var Videos = Backbone.Collection.extend( {
    model     : Video,
    channel   : null,
    updateData: function () {
        console.log( "fetching channel videos", this.channel );
        twitchApi.send( "channelVideos", {channel: this.channel, limit: 20}, function ( err, res ) {
            if ( err ) {
                console.log( "API error", err );
                return this.trigger( "apierror" );
            }
            res.videos.forEach( function ( v ) {
                //video duration in min
                v.length = Math.ceil( v.length / 60 );
            } );
            this.reset( res.videos, {silent: true} );
            this.trigger( "update" );
        }.bind( this ) );
    }
} );

var Game = TwitchItemModel.extend();

var Games = Backbone.Collection.extend( {
    model: Game,

    favorite: function () {
        var favoriteGamesIds = app.get( "favorite_games" );
        favoriteGamesIds[this.get( "id" )] = 1;
        app.set( "favorite-games-ids", favoriteGamesIds );
        this.set( "favorite", true );
    },

    unfavorite: function () {
        var favoriteGamesIds = app.get( "favorite_games" );
        delete favoriteGamesIds[this.get( "id" )];
        app.set( "favorite-games-ids", favoriteGamesIds );
        this.set( "favorite", false );
    },

    updateData: function () {
        clearTimeout( this.timeout );
        twitchApi.send( "gamesTop", {}, function ( err, res ) {
            this.timeout = setTimeout( this.updateData.bind( this ), 5 * 60 * 1000 );
            if ( err ) {
                console.log( "GamesTop API error", err );
                return this.trigger( "apierror" );
            }
            res.top.forEach( function ( g ) {
                g._id = g.game._id;
            } );
            this.reset( res.top, {silent: true} );
            this.trigger( "update" );
        }.bind( this ) );
    }
} );

var Stream = TwitchItemModel.extend( {

    initialize: function () {
        var channelName = this.get( "channel" ).name;
        var links = {
            oldlayout: "http://www.twitch.tv/ID/old",
            newlayout: "http://www.twitch.tv/ID/new",
            chat     : "http://www.twitch.tv/chat/embed?channel=ID&popout_chat=true",
            popout   : "http://www.twitch.tv/ID/popout"
        };
        for ( var i in links ) {
            links[i] = links[i].replace( /ID/, channelName );
        }
        this.set( "links", links, {silent: true} );
    },

    follow: function ( cb ) {
        cb = cb || $.noop;
        var target = this.get( "channel" ).name;
        twitchApi.send( "follow", {target: target}, function ( err, res ) {
            console.log( "follow", err, res );
            if ( err ) return cb( err );
            this.trigger( "follow", this.attributes );
            cb();
        }.bind( this ) );
    },

    unfollow: function ( cb ) {
        cb = cb || $.noop;
        var target = this.get( "channel" ).name;
        twitchApi.send( "unfollow", {target: target}, function ( err, res ) {
            console.log( "unfollow", err, res );
            cb();
        } );
    },

    openStream: function () {
        var openIn = settings.get( "openStreamIn" ).get( "value" );
        var href = this.get( "links" )[openIn];
        chrome.tabs.create( { url: href } );
    },

    openChat: function () {
        var openIn = settings.get( "openChatIn" ).get( "value" );
        var href = this.get( "links" ).chat;
        var windowOpts = {
            "type"   : "popup",
            "focused": true,
            "width"  : 400
//            "height" : 600
        };

        if ( openIn == "newwindow" ) {
            chrome.windows.create( $.extend( {url: href}, windowOpts ) );
        } else {
            chrome.tabs.create( { url: href } );
        }
    }
} );

var StreamCollection = Backbone.Collection.extend( {

    model: Stream,

    twitchApi: twitchApi,

    initialize: function () {
        this.setComparator();
        settings.get( "viewSort" ).on( "change:value", function () {
            this.setComparator();
        }.bind( this ) );
    },

    parse: function ( data ) {
        var res = data.streams;

//        res.forEach(function ( s ) {
//            weird caching of preview images
//            s.preview = s.preview.replace("?w=320&h=200", "?w=160&h=100");
//        });
        return res;
    },

    setComparator: function () {
        var curSort = settings.get( "viewSort" ).get( "value" ).split( "|" );
        var prop = curSort[0];
        var reverse = parseInt( curSort[1], 10 );

        this.comparator = function ( a, b ) {
            return a.get( prop ) > b.get( prop ) ? 1 * reverse
                : a.get( prop ) < b.get( prop ) ? -1 * reverse : 0;
        };
        this.sort();
    }
} );

var FollowingCollection = StreamCollection.extend( {
    initialize: function () {
        setInterval( function () {
            this.notified = [];
        }.bind( this ), 1000 * 60 * 60 );
        SearchCollection.prototype.initialize.call( this );
    },
    notified  : [], //store notified streams id here
    updateData: function () {
        var idsBeforeUpdate = this.pluck( "_id" );
        var idsAfterUpdate;

        clearTimeout( this.timeout );

        twitchApi.send( "followed", {}, function ( err, res ) {

            this.timeout = setTimeout( this.updateData.bind( this ), 3 * 60 * 1000 );

            if ( err ) {
                console.log( "Following API error", err );
                return this.trigger( "apierror" );
            }
            res = this.parse( res );
            this.update( res, {silent: true} );

            idsAfterUpdate = this.pluck( "_id" );
            this.addedStreams = _.difference( idsAfterUpdate, idsBeforeUpdate, this.notified );
            this.notified = _.union( this.addedStreams, this.notified );
            this.trigger( "update" );
        }.bind( this ) );
    }
} );

var BrowsingCollection = StreamCollection.extend( {
    game      : null,
    updateData: function () {
        console.log( "fetching game streams", this.game );
        twitchApi.send( "streams", {game: this.game, limit: 50}, function ( err, res ) {
            if ( err ) {
                console.log( "Following API error", err );
                return this.trigger( "apierror" );
            }
            res = this.parse( res );
            this.reset( res, {silent: true} );
            this.trigger( "update" );
        }.bind( this ) );
    }
} );

var SearchCollection = StreamCollection.extend( {
    query     : null,
    updateData: function () {
        twitchApi.send( "searchStreams", {query: this.query, limit: 50}, function ( err, res ) {
            if ( err ) {
                console.log( "Following API error", err );
                return this.trigger( "apierror" );
            }
            this.reset( res.streams, {silent: true} );
            this.trigger( "update" );
        }.bind( this ) );
    }
} );

var settings = new Settings;

var following = new FollowingCollection;
var browsing = new BrowsingCollection;

var videos = new Videos;
var games = new Games;
var search = new SearchCollection;

var notify = function () {

    if ( following.addedStreams.length > 0 ) {
        if ( settings.get( "showDesktopNotification" ).get( "value" ) ) {
            app.sendNotification();
        }
        if ( settings.get( "playNotificationSound" ).get( "value" ) ) {
            app.playSound( settings.get( "notificationSound" ).get( "value" ) );
        }
    }

    if ( settings.get( "showBadge" ).get( "value" ) ) {
        app.setBadge( following.length );
    }
};

browsing.on( "follow", function ( stream ) {
    following.add( stream );
    following.addedStreams = [stream._id];
    notify();
} );

following.on( "update", notify );

settings.get( "showBadge" ).on( "change:value", function ( model, value ) {
    if ( value ) {
        app.setBadge( following.length );
    } else {
        app.clearBadge();
    }
} );

twitchApi.on( "revoke", function () {
    following.reset();
    app.clearBadge();
} );

twitchApi.on( "init", function () {
    following.updateData();
    games.updateData();
} );

app.init();