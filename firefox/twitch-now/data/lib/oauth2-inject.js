(function (){

  var sendMessage = function (msg){
    var data = JSON.stringify({value: msg, type: "OAUTH2"});

    if ( chrome && chrome.runtime ) {
      chrome.runtime.sendMessage(data);
    } else {
      document.defaultView.postMessage(data, "http://my-domain.org/");
    }
  }

  var send = function (){
    var url = window.location.href;
    var params = '?';
    var index = url.indexOf(params);
    if ( index > -1 ) {
      params = url.substring(index);
    }

    url = url.split("?")[0];

    params = params + "&from=" + encodeURIComponent(window.location.href);

    sendMessage({url: url, params: params});
  }

  send();

}).call(this);
