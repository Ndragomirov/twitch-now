"use strict";
var b = chrome.extension.getBackgroundPage();
var ids = b.following.addedStreams;

var streams = b.following.getNewStreams();

var streamsToShow = streams.splice( 0, 5 );

var StreamView = Backbone.View.extend( {
    template: "notificationstream.html",

    events: {
        "click .stream": "openStream"
    },

    openStream: function () {
        self.close();
        this.model.openStream();
    },

    render: function () {
        this.$el.empty().html( Handlebars.templates[this.template]( this.model.toJSON() ) );
        return this;
    }
} );

var NotificationView = Backbone.View.extend( {

    template: "notification.html",

    el: "#output",

    initialize: function () {
        this.render();
    },

    render: function () {
        var views = streamsToShow.map( function ( stream ) {
            return new StreamView( {model: stream } ).render().$el;
        } );

        this.$el.find( '.streams' ).html( views );
        this.$el.find( '.more' ).html( Handlebars.templates[this.template]( this.model ) );
    }
} );

new NotificationView( {
    model: {
        more: streams.length,
        live: streamsToShow.length == 1 ? "is live now" : "are live now"
    }
} );