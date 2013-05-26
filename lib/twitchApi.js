(function ( w ) {
    "use strict";
    var that = w.twitchApi = _.extend( {}, Backbone.Events );
    var providerOpts = {
        client_id    : 'b4sj5euottb8mm7pc1lfvi84kvzxqxk',
        client_secret: '2m42qpmxfy5l2ik4c93s0qco4vzfgr0',
        api_scope    : 'user_follows_edit user_read'
    };

    var provider = that.provider = new OAuth2( 'twitch', providerOpts );

    //forces to save provider data to localstorage
    provider.updateLocalStorage();

    that.setSyncToken = function ( tkn ) {
        chrome.storage.sync.set( {'accessToken': tkn}, function () {
            console.log( "setting sync token", tkn );
        } );
    };

    that.getSyncToken = function ( cb ) {
        chrome.storage.sync.get( 'accessToken', function ( item ) {
            console.log( "getting sync token", item.accessToken );
            return cb( item.accessToken );
        } );
    };

    that.onTokenChange = function () {
        chrome.storage.onChanged.addListener( function ( changes, namespace ) {
            var key = "accessToken";
            if ( namespace === "sync" && key in changes ) {
                console.log( "sync access token change, new val", changes[key].newValue );
                that.setLocalToken( changes[key].newValue );
                that.initialize();
            }
        } );
    };

    that.initialize = function () {
        that.basePath = "https://api.twitch.tv/kraken";
        that.userName = "";
        that.defaultAjaxOpts = {
            timeout : 10 * 1000,
            dataType: "json",
            headers : {
                "Accept"       : "application/vnd.twitchtv.v3+json",
                "Client-ID"    : providerOpts.client_id,
                "Authorization": " OAuth " + provider.getAccessToken()
            }
        };
        that.trigger( "init" );
    }
    ;

    that.setLocalToken = function ( tkn ) {
        if ( !tkn ) return;
        console.log( "set local token to", tkn );
        var p = app.get( "oauth2_twitch" );
        p.accessToken = tkn;
        app.set( "oauth2_twitch", p );
        that.trigger( "authorize" );
    };

    that.revoke = function () {
        console.log( "revoking" );
        provider.clearAccessToken();
        that.defaultAjaxOpts.headers.Authorization = "";
        that.userName = "";
        that.trigger( "revoke" );
    };

    that.isAuthorized = function () {
        return provider.hasAccessToken();
    };

    that.getUserName = function ( cb ) {
        var userName = that.userName;
        var req = {
            url: that.basePath + "/"
        };
        if ( userName ) return cb( null, userName );

        $.ajax( $.extend( true, req, that.defaultAjaxOpts ) )
            .fail( function () {
                return cb( "cant get current username" );
            } )
            .done( function ( res ) {
                that.userName = userName = res.token.user_name;
                return cb( null, userName );
            } );
    };

    that.authorize = function () {
        if ( provider.hasAccessToken() ) return that.trigger( "authorize" );
        provider.authorize( function () {
            that.setSyncToken( provider.getAccessToken() );
            that.trigger( "authorize" );
        } );
    };

    that.getFollowed = function ( cb ) {
        var reqCompleted = 0;
        var totalRequests = 2;
        var errors = 0;

        var liveStreams = [];

        var callback = function ( err ) {
            reqCompleted++;
            if ( err ) errors++;
            if ( reqCompleted == totalRequests ) {
                if ( err > 0 ) {
                    return cb( "err" );
                } else {
                    return cb( null, {streams: liveStreams} );
                }
            }
        }

        var getLiveStreams = function ( res ) {
            return res.streams.filter( function ( s ) {
                return s.hasOwnProperty( "viewers" );
            } );
        }

        var getChannelIds = function ( res ) {
            return res.follows.map( function ( c ) {
                return c.channel.name;
            } );
        }

        for ( var i = 0; i < totalRequests; i++ ) {
            var offset = i * 100;

            that.send( "follows", {limit: 100, offset: offset}, function ( err, res ) {
                if ( err ) return callback( err );
                var channels = getChannelIds( res );
                if ( channels == 0 ) return callback();

                that.send( "streams", {limit: 100, channel: channels.join( "," )}, function ( err, res ) {
                    if ( err ) return callback( err );
                    liveStreams = liveStreams.concat( getLiveStreams( res ) );
                    callback();
                } );
            } );
        }
    };

    that.send = function ( methodName, opts, cb ) {

        //a workaround solution for twitch followed bug
        if ( methodName == "followed" ) return that.getFollowed( cb );
        var requestOpts = that[methodName]();

        var getUserName = requestOpts.url.match( /:user/ ) ?
            that.getUserName :
            function ( fn ) {
                return fn()
            };

        if ( requestOpts.url.match( /:target/ ) ) {
            requestOpts.url = requestOpts.url.replace( /:target/, opts.target );
        }

        if ( requestOpts.url.match( /:channel/ ) ) {
            requestOpts.url = requestOpts.url.replace( /:channel/, opts.channel );
        }

        getUserName( function ( err, userName ) {
            cb = cb || $.noop;
            if ( err ) return cb( err );
            requestOpts.url = that.basePath + requestOpts.url;
            requestOpts.url = requestOpts.url.replace( /:user/, userName );
            requestOpts = $.extend( true, requestOpts, {data: opts}, that.defaultAjaxOpts );
            $.ajax( requestOpts )
                .done( function ( data ) {
                    that.trigger( "done:" + methodName );
                    cb( null, data );
                } )
                .fail( function ( xhr ) {
                    if ( xhr.status == 401 ) {
                        that.revoke();
                    }
                    that.trigger( "fail:" + methodName );
                    cb( "err" + methodName );
                } )
        } );

    };

    that.base = function () {
        return {
            type: "GET",
            url : "/"
        }
    };

    that.authUser = function () {
        return {
            type: "GET"
        }
    };

    that.channelVideos = function () {
        return {
            type: "GET",
            url : "/channels/:channel/videos"
        }
    };

    that.searchStreams = function () {
        return {
            type: "GET",
            url : "/search/streams",
            data: {
                limit: 50
            }
        }
    };

    that.gamesTop = function () {
        return {
            type: "GET",
            url : "/games/top",
            data: {
                limit: 50
            }
        }
    };

    that.follows = function () {
        return {
            type : "GET",
            url  : "/users/:user/follows/channels",
            limit: 100
        }
    };

    that.follow = function () {
        return {
            type: "PUT",
            url : "/users/:user/follows/channels/:target"
        }
    };

    that.unfollow = function () {
        return {
            type: "DELETE",
            url : "/users/:user/follows/channels/:target"
        }
    };

    that.followed = function () {
        return {
            type: "GET",
            url : "/streams/followed",
            data: {
                limit: 100
            }
        }
    };

    that.streams = function () {
        return {
            type : "GET",
            url  : "/streams",
            limit: 50
        }
    };
    that.onTokenChange();

    that.getSyncToken( function ( token ) {
        that.setLocalToken( token );
        that.initialize();
    } );

})( window );