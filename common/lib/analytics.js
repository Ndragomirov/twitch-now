(function (){
  var root = this;
  var XMLHttpRequest = root.XMLHttpRequest || require("net/xhr").XMLHttpRequest;
  var localStorage = root.localStorage || require("sdk/simple-storage").storage;

  var that = root.analytics = {};

  function merge(){
    var obj = {},
      i = 0,
      il = arguments.length,
      key;
    for ( ; i < il; i++ ) {
      for ( key in arguments[i] ) {
        if ( arguments[i].hasOwnProperty(key) ) {
          obj[key] = arguments[i][key];
        }
      }
    }
    return obj;
  }

  function isObject(obj){
    return obj === Object(obj);
  }

  function serialize(obj){
    if ( !isObject(obj) ) return obj;
    var pairs = [];
    for ( var key in obj ) {
      if ( null != obj[key] ) {
        pairs.push(encodeURIComponent(key)
          + '=' + encodeURIComponent(obj[key]));
      }
    }
    return pairs.join('&');
  }

  that.data = {
    v  : 1,
    cid: Math.random()
  }

  that.getParams = function (){
    var data = {};
    var action = arguments[0];
    var argNames = actionMap[action];
    var argValues = arguments.slice(1);
    for ( var i = 0; i < argNames.length; i++ ) {
      if ( typeof argValues[i] !== "undefined" ) {
        data[argNames[i]] == argValues[i];
      }
    }
    return data;
  }

  that.init = function (trackingId){
    that.data.tid = trackingId;
  }

  //https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#page
  that.send = function (args){
    var data = merge({}, that.data, args);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://www.google-analytics.com/collect", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(serialize(data));
    xhr.onload = function() {};
  }

}).call(this);