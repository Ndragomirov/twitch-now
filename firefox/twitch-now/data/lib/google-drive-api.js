(function ( w ) {
    "use strict";
    var that = w.googleDriveApi = _.extend( {}, Backbone.Events );
    var providerOpts = {
        client_id    : '937519784043-0d14fecjnjqb4ka8m0khsjt1c0v0evvg.apps.googleusercontent.com',
        client_secret: '_r7h-KVjJUh_XS1EFYZM8UeJ',
        api_scope    : 'https://www.googleapis.com/auth/drive'
    };

    var provider = that.provider = new OAuth2( 'googleDrive', providerOpts );

    that.authorize = function () {
//        if ( provider.hasAccessToken() ) return that.trigger( "authorize" );
        provider.authorize( function () {
            that.trigger( "authorize" );
        } );
    };

    that.uploadFile = function () {

    };

    that.downloadFile = function () {

    };

    that.authorize();

})( window );