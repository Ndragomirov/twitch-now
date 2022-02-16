(function () {

    var root = this;

    var constants = {
        twitchApi: {
            api: "https://id.twitch.tv/oauth2/authorize",
            response_type: 'token',
            client_id: 'nfsk9onrddch0sz4mfxjwykalhra6sr',
            client_secret: 'imouwsfvza6d4yt2on4eem1bkjxtwa9',
            scope: 'user:read:follows',
            redirect_uri: 'http://ndragomirov.github.io/twitch-firefox.html'
        }
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = constants;
        }
        exports.constants = constants;
    } else {
        root.constants = constants;
    }
}).call(this);
