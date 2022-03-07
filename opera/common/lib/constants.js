(function (){

  var root = this;

  var constants = {
    twitchApi: {
      api          : "https://id.twitch.tv/oauth2/authorize",
      response_type: 'token',
      client_id    : 'nhrhocc8g5gfm8w98oi9ozuuo4ser2',
      client_secret: '2ovjqj5of99gpmkdjyiyyz6mgvdo79',
      scope        : 'openid user:read:follows user:read:email',
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