(function (){

  var root = this;

  var constants = {
    twitchApi: {
      api          : "https://api.twitch.tv/kraken/oauth2/authorize",
      response_type: 'code',
      client_id    : 'nfsk9onrddch0sz4mfxjwykalhra6sr',
      client_secret: 'imouwsfvza6d4yt2on4eem1bkjxtwa9',
      scope        : 'user_follows_edit user_read',
      redirect_uri : 'http://ndragomirov.github.io/twitch-firefox.html'
    }
  };

  if ( typeof exports !== 'undefined' ) {
    exports.constants = constants;
  } else {
    root.constants = constants;
  }
}).call(this);