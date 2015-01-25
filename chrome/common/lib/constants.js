(function (){

  var root = this;

  var constants = {
    twitchApi: {
      api          : "https://api.twitch.tv/kraken/oauth2/authorize",
      response_type: 'token',
      client_id    : 'b4sj5euottb8mm7pc1lfvi84kvzxqxk',
      client_secret: '2m42qpmxfy5l2ik4c93s0qco4vzfgr0',
      scope        : 'user_follows_edit user_read',
      redirect_uri : 'http://ndragomirov.github.io/twitch.html'
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