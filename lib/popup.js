(function ( w ) {
    "use strict";

    var app = window.app = _.extend( {}, Backbone.Events );
    var b = app.b = chrome.extension.getBackgroundPage();
    var gm = chrome.i18n.getMessage;


    app.twitchApi = b.twitchApi;
    app.currentView = null;
    app.views = {};
    app.windowOpened = false;

    app.resetScroll = function () {
        app.container.scrollTop( 0 );
    }

    app.lazyload = function () {
        var container = app.container;
        var height = container.height();
        var scrollTop = container.scrollTop();
        container.find( '.lazy:visible:not([src])' ).each( function () {
            var t = $( this );
            var pos = t.position();
            if ( pos.top >= scrollTop && pos.top <= scrollTop + height ) {
                t.attr( 'src', t.attr( 'data-original' ) );
            }
        } );
        setTimeout( function () {
            app.lazyload()
        }, 100 );
    };

    app.init = function () {
        new DonateView;
        new ContributorListView( {
            el        : ".contributor-list",
            collection: b.contributors
        } )

        app.container = $( '#content' );
        app.preloader = $( "<div id='preloader'><img src='../css/img/spinner.gif'/></div>" );
        app.streamPreloader = $( "<div id='preloader-stream'><img src='../css/img/spinner.gif'/></div>" );

        i18n.replace( document.body );
        i18n.observe( document.body );

        var views = app.views;
        this.router = new this.Router;

        views.menu = new Menu;

        views.topMenu = new TopMenu;

        views.browseStreams = new BrowseStreamListView( {
            el        : "#browse-game-streams-screen",
            collection: b.browsing
        } );

        views.topstreams = new StreamListView( {
            el        : "#topstreams-screen",
            collection: b.topstreams
        } );

        views.following = new StreamListView( {
            el        : "#stream-screen",
            collection: b.following
        } );

        views.videos = new VideoListView( {
            el        : "#video-screen",
            collection: b.videos
        } );

        views.settings = new SettingsView( {
            collection: b.settings
        } );

        views.search = new SearchView( {
            el        : "#search-screen",
            collection: b.search
        } );

        views.browseGames = new GameListView( {
            el        : "#browse-game-screen",
            collection: b.games
        } );

        var userView = new UserView( {
            model: b.user
        } )

        $( '.tip' ).tooltip();

        Backbone.history.start();

        this.router.on( "all", function ( r ) {
            var route = r.split( ":" )[1];
            app.curView = app.views[route];
            app.resetScroll();
            if ( route == "topstreams" ) {
                app.views.topstreams.update();
            }
        } );

        var route = b.twitchApi.isAuthorized() ? "following" : "browse";
        this.router.navigate( route, {trigger: true} );

        $( '#menu' ).find( '[data-route="' + route + '"]' ).addClass( "active" );

        $( "body" )
            .on( "click", function () {
                $( '#context-menu' ).hide();
            } )
            .on( 'click', '*[data-route]', function () {
                var route = $( this ).attr( 'data-route' );
                window.location.hash = '#' + route;
            } )
            .one( 'mouseenter', function () {
                app.lazyload();
            } )
            .on( 'click', '.js-tab', function () {
                var href = $( this ).attr( 'data-href' );
                chrome.tabs.create( { url: href } );
                return false;
            } )

            .on( 'click', '.js-window', function () {
                var windowOpts = JSON.parse( $( this ).attr( 'data-window-opts' ) || "{}" );
                chrome.windows.create( $.extend( {url: $( this ).attr( 'data-href' )}, windowOpts ) );
                return false;
            } )
    };

    var DefaultView = Backbone.View.extend( {
        app       : app,
        template  : "",
        render    : function () {
            this.$el.empty().html( $( Handlebars.templates[this.template]( this.model.toJSON() ) ) );

            return this;
        },
        initialize: function () {
            $( self ).unload( function () {
                this.undelegateEvents();
                this.stopListening();
            }.bind( this ) );
        }
    } );

    var UserView = DefaultView.extend( {
        el        : "#user-info",
        events    : {
            "click #logout-btn": "logout",
            "click #login-btn" : "login"
        },
        template  : "user.html",
        initialize: function () {
            DefaultView.prototype.initialize.apply( this, arguments );
            this.listenTo( this.model, "change", this.render );
            this.render();
        },
        login     : function () {
            this.model.login();
        },
        logout    : function () {
            this.model.logout();
        }
    } )

    var TopMenu = DefaultView.extend( {
        el            : "#top-menu",
        events        : {
            "click #refresh-btn": "refresh",
            "keyup #filterInput": "filter"
        },
        show          : function () {
            this.$el.show();
        },
        hide          : function () {
            this.$el.hide();
        },
        initialize    : function () {
            DefaultView.prototype.initialize.apply( this, arguments );
            this.listenTo( this.app.router, "route:following route:browseGames route:browseStreams", this.resetFilterVal.bind( this ) );
        },
        resetFilterVal: function () {
            this.$( "#filterInput" ).val( "" ).keyup();
            this.filter();
        },
        filter        : function () {
            var fValue = this.$( "#filterInput" ).val().toLowerCase();
            var rFilter = new RegExp( fValue );
            if ( this.app.curView ) {
                this.app.curView.$el.find( ".stream" ).each( function ( i, e ) {
                    $( e ).toggle( !!$( e ).text().toLowerCase().match( rFilter ) );
                } );
            }
        },
        refresh       : function () {
            this.resetFilterVal();
            this.app.curView && this.app.curView.update && this.app.curView.update();
        },
        expand        : function () {
            this.$( "#filter-bar" ).toggle();
        }
    } );

    var Menu = DefaultView.extend( {
        el       : "#menu",
        events   : {
            "click .menu-btn": "selectTab"
        },
        selectTab: function ( e ) {
            this.$( ".menu-btn" ).removeClass( "active" );
            $( e.target ).closest( ".menu-btn" ).addClass( "active" );
        }
    } );

    var ControlView = DefaultView.extend( {
        template: "control.html"
    } );

    var SettingsView = DefaultView.extend( {
        el    : "#settings-screen",
        events: {
            "click input[data-id=\"notificationSound\"]": "playSound",
            "change input[type=\"range\"]"              : "rangeHelper",
            "change input, select"                      : "serialize"
        },

        changeThemeType: function ( value ) {
            $( "body" ).toggleClass( "white-version", value !== "dark" );
        },

        changeWindowHeight: function ( value ) {
//            value = parseInt(value, 10);
//            $( "html" ).height( value );
//            $( "#content" ).height( value - 30 );
        },

        onModelChange: function ( model, options ) {
            var v = model.get( "value" );

            switch (model.get( "id" )) {
                case "themeType":
                    this.changeThemeType( model.get( "value" ) );
                    break;

                case "windowHeight":
                    console.log( "windowHeight", v );
                    this.changeWindowHeight( model.get( "value" ) );
                    break;

                default:
                    break;
            }
        },

        playSound  : function ( e ) {
            var sound = new Audio();
            sound.src = $( e.target ).val();
            sound.play();
        },
        rangeHelper: function ( e ) {
            var t = $( e.target );
            t.siblings( ".range-helper" ).find( ".range-helper-value" ).html( t.val() );
        },
        initialize : function () {
            DefaultView.prototype.initialize.apply( this, arguments );
            this.$container = this.$el.find( "#settings-container" );
            this.changeThemeType( this.collection.get( "themeType" ).get( "value" ) );
            this.changeWindowHeight( this.collection.get( "windowHeight" ).get( "value" ) );
            this.listenTo( this.collection, "change", this.onModelChange );
            this.render();
        },
        serialize  : function () {
            var controls = [];
            this.$container.find( 'input, select' ).each( function ( e ) {
                var t = $( this ),
                    value,
                    type = t.attr( 'data-type' ),
                    controlId = t.attr( 'data-id' );

                //пропускаем radio инпуты без аттрибута checked
                if ( type == 'radio' ) {
                    if ( t.prop( "checked" ) ) {
                        value = t.val();
                    } else {
                        return;
                    }
                }
                if ( type == 'checkbox' ) {
                    value = t.prop( 'checked' );
                }
                else if ( type == 'range' ) {
                    value = parseInt( t.val(), 10 );
                }
                else {
                    value = t.val();
                }
                controls.push( {id: controlId, value: value} );
            } );
            this.collection.update( controls, {add: false, remove: false} );
        },
        render     : function () {
            var views = this.collection.map( function ( control ) {
                return new ControlView( {model: control} ).render().$el;
            }, this );
            this.$container.empty().html( views );
            return this;
        }
    } );

    var GameView = DefaultView.extend( {
        events: {
            "contextmenu .stream": "showMenu"
        },

        menuEl: '#context-menu',

        showMenu: function ( e ) {
            var self = this;
            var menuEl = $( this.menuEl );
            var y = e.clientY;
            var x = e.clientX;
            var height = menuEl.height();
            var m = this.model.toJSON();
            m.authorized = app.twitchApi.isAuthorized();

            if ( y + height > $( document.body ).height() ) {
                y -= height;
            }

            menuEl
                .off()
                .empty()
                .html( $( Handlebars.templates["contextgamemenu.html"]( m ) ) )
                .css( {top: y, left: x} )
                .show();
            return false;
        },
        template: "game.html"
    } );

    var VideoView = DefaultView.extend( {
        template: "video.html"
    } );

    var StreamView = DefaultView.extend( {
        template  : "stream.html",
        menuEl    : '#context-menu',
        events    : {
            "contextmenu .stream": "showMenu",
            "click .stream"      : "openStream"
        },
        openStream: function () {
            this.model.openStream();
        },
        openChat  : function () {
            this.model.openChat();
        },
        showMenu  : function ( e ) {
            var self = this;
            var y = e.clientY;
            var x = e.clientX;
            var menuEl = $( this.menuEl );
            var height = menuEl.height();
            var m = this.model.toJSON();
            m.authorized = app.twitchApi.isAuthorized();

            if ( y + height > $( document.body ).height() ) {
                y -= height;
            }

            menuEl
                .off()
                .empty()
                .html( $( Handlebars.templates["contextstreammenu.html"]( m ) ) )
                .css( {top: y, left: x} )
                .on( 'click', '.js-notify', function () {
                    self.model.notify( Math.random() < 0.5 );
                } )
                .on( 'click', '.js-open-chat', function () {
                    self.model.openChat();
                } )
                .on( 'click', '.js-open-stream', function ( e ) {
                    console.log( $( e.target ).attr( "data-type" ) );
                    self.model.openStream( $( e.target ).attr( "data-type" ) );
                } )
                .on( 'click', '.js-follow', function () {
                    self.follow();
                } )
                .on( 'click', '.js-unfollow', function () {
                    self.unfollow();
                } )
                .show();
            return false;
        },
        unfollow  : function () {
            var preloader = this.app.streamPreloader;
            this.$el.append( preloader );
            this.model.unfollow( function () {
                preloader.detach();
            } );
        },
        follow    : function () {
            var preloader = this.app.streamPreloader;
            this.$el.append( preloader );
            this.model.follow( function () {
                preloader.detach();
            } );
        },
        initialize: function () {
            DefaultView.prototype.initialize.apply( this, arguments );
            this.listenTo( this.model, "change", this.render );
        }
    } );

    var ListView = DefaultView.extend( {
        template   : "screenmessage.html",
        messages   : {
            "apierror"       : gm( "m48" ),
            "novideo"        : gm( "m49" ),
            "nosearchresults": gm( "m50" )
        },
        itemView   : null, // single item view
        initialize : function () {
            DefaultView.prototype.initialize.apply( this, arguments );
            this.container = this.$el.find( ".screen-content" );
            this.listenTo( this.collection, "add update sort remove", this.render );
            this.listenTo( this.collection, "reset", this.render );
            this.listenTo( this.collection, "apierror", this.showError );
            this.render();
        },
        showMessage: function ( text ) {
            this.container.html( Handlebars.templates[this.template]( {
                text: text
            } ) );
        },
        showError  : function () {
            this.showMessage( this.messages.apierror );
        },
        update     : function () {
            this.collection.updateData();
            this.container.empty().append( this.app.preloader );
        },
        render     : function () {
            var views = this.collection.map( function ( item ) {
                return new this.itemView( {model: item} ).render().$el;
            }, this );
            this.container.empty().html( views );
        }
    } );

    var GameListView = ListView.extend( {
        itemView: GameView

    } );

    var StreamListView = ListView.extend( {
        itemView: StreamView
    } );

    var SearchView = ListView.extend( {
        events  : {
            "keyup #searchInput": "onkeyup",
            "click #search"     : "search"
        },
        itemView: StreamView,
        onkeyup : function ( e ) {
            if ( e.keyCode == 13 ) {
                this.search();
            }
        },
        search  : function () {
            this.collection.query = this.$el.find( "#searchInput" ).val();
            this.update();
        },
        render  : function () {
            if ( this.collection.length ) {
                ListView.prototype.render.apply( this, arguments );
            } else {
                this.showMessage( this.messages.nosearchresults );
            }
        }
    } );

    var VideoListView = ListView.extend( {
        itemView : VideoView,
        setStream: function ( channel ) {
            this.collection.channel = channel;
            this.update();
        },
        render   : function () {
            if ( this.collection.length ) {
                ListView.prototype.render.apply( this, arguments );
            } else {
                this.showMessage( this.messages.novideo );
            }
        }
    } );

    var BrowseStreamListView = StreamListView.extend( {
        setGame: function ( game ) {
            this.collection.game = game;
            this.update();
        }
    } );

    var DonateView = Backbone.View.extend( {
        app       : app,
        el        : "#help-screen",
        events    : {
            "click .btn-close-screen": "hide"
        },
        initialize: function () {

        },
        show      : function () {
            this.$el.show();
        },
        hide      : function () {
            this.$el.hide();
        }
    } );

    var ContributorView = DefaultView.extend( {
        template: "contributor.html"
    } );

    var ContributorListView = DefaultView.extend( {
        initialize: function () {
            DefaultView.prototype.initialize.apply( this, arguments );
            this.render();
        },
        render    : function () {
            var views = this.collection.map( function ( item ) {
                return new ContributorView( {model: item} ).render().$el;
            }, this );

            this.$el.empty().html( views );
        }
    } );


})( window );