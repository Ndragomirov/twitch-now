console.log( "scripts added" );
var _gaq = _gaq || [];
_gaq.push( ['_setAccount', 'UA-21976825-4'] );
_gaq.push( ['_trackPageview'] );
var ga = document.createElement( 'script' );
ga.type = 'text/javascript';
ga.src = 'https://ssl.google-analytics.com/ga.js';
$( 'body' ).append( ga );
$( '#login-btn' ).click( function () {
    _gaq.push( ['_trackEvent', "login-btn", 'clicked'] );
} );
