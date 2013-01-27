OAuth2.adapter( 'twitch', {
    authorizationCodeURL: function ( config ) {
        return ('https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&' +
            'client_id={{CLIENT_ID}}&' +
            'redirect_uri={{REDIRECT_URI}}&' +
            'scope={{API_SCOPE}}')
            .replace( '{{API_SCOPE}}', config.apiScope )
            .replace( '{{CLIENT_ID}}', config.clientId )
            .replace( '{{REDIRECT_URI}}', this.redirectURL( config ) );
    },

    redirectURL: function ( config ) {
        return 'http://ndragomirov.github.com/twitch.html';
    },

    parseAuthorizationCode: function ( url ) {
        var error = url.match( /[&\?]error=([^&]+)/ );
        if ( error ) {
            throw 'Error getting authorization code: ' + error[1];
        }
        return url.match( /[&\?]code=([\w\/\-]+)/ )[1];
    },

    accessTokenURL: function () {
        return 'https://api.twitch.tv/kraken/oauth2/token';
    },

    accessTokenMethod: function () {
        return 'POST';
    },

    accessTokenParams: function ( authorizationCode, config ) {
        return {
            code: authorizationCode,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            redirect_uri: this.redirectURL(config),
            grant_type: 'authorization_code'
          };
    },

    parseAccessToken: function ( response ) {
        console.log( "parse response", response );
        var parsedResponse = JSON.parse( response );
        return {
            accessToken: parsedResponse.access_token,
            expiresIn  : Number.MAX_VALUE
        };
    }
} );
