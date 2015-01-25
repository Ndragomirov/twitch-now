(function (){

  var root = this;

  var constants = {
    twitchApi: {
      api          : "https://api.twitch.tv/kraken/oauth2/authorize",
      response_type: 'token',
      client_id    : 'ktea279xbjlnqmbg1j5htw3zbdssxel',
      client_secret: 'da30i8e60ippr4nd6penj65s5ildauj',
      scope        : 'user_follows_edit user_read',
      redirect_uri : 'http://ndragomirov.github.io/twitch-opera.html'
    }
  };

  if ( typeof exports !== 'undefined' ) {
    if ( typeof module !== 'undefined' && module.exports ) {
      exports = module.exports = constants;
    }
    exports.constants = constants;
  } else {
    root.constants = constants;
  }
}).call(this);