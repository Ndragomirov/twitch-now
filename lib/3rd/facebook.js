(function ( d, s, id ) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if ( d.getElementById(id) ) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/ru_RU/all.js#xfbml=1&appId=171238279617589";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));