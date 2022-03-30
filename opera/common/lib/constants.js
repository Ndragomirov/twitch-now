(function (){

  var root = this;

  var constants = {
    twitchApi: {
      api          : "https://id.twitch.tv/oauth2/authorize",
      response_type: 'token',
      client_id    : 'wan7tdfzghu0uiisb8xoa1f4rgzsz6',
      client_secret: 'da30i8e60ippr4nd6penj65s5ildauj',
      scope        : 'user:read:follows',
      redirect_uri : 'https://ndragomirov.github.io/twitch-opera.html'
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
