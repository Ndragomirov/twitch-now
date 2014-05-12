var CPA = (function (){
  var service = analytics.getService('twitch_now_ext');
  var tracker = service.getTracker('UA-21976825-4');

  chrome.runtime.onMessage.addListener(function (req, sender, sendResponse){
    if ( req.action !== "stat" )
      return;

    var returnValue = false;
    var args = req.args || [];

    if ( req.method === "isTrackingPermitted" ) {
      args.push(sendResponse);
      returnValue = true;
    }

    CPA[req.method] && CPA[req.method].apply(CPA, args);
    return returnValue;
  });

  return {
    changePermittedState: function CPA_changePermittedState(permitted){
      service.getConfig().addCallback(function (config){
        config.setTrackingPermitted(permitted);
      });
    },

    isTrackingPermitted: function CPA_isTrackingPermitted(callback){
      service.getConfig().addCallback(function (config){
        callback(config.isTrackingPermitted());
      });
    },

    sendEvent: function CPA_sendEvent(category, action, label, valueCount){
      var args = [];

      for ( var i = 0, len = Math.min(arguments.length, 4); i < len; i++ ) {
        if ( i === 3 ) {
          if ( typeof valueCount === "boolean" ) {
            valueCount = Number(valueCount);
          } else if ( typeof valueCount !== "number" ) {
            valueCount = parseInt(valueCount, 10) || 0;
          }

          args.push(valueCount);
        } else {
          if ( typeof arguments[i] !== "string" ) {
            args.push(JSON.stringify(arguments[i]));
          } else {
            args.push(arguments[i]);
          }
        }
      }

      tracker.sendEvent.apply(tracker, args);
    },

    sendAppView: function CPA_sendAppView(viewName){
      tracker.sendAppView(viewName);
    }
  };
})();

window.onerror = function (msg, url, line, column, err){
  var msgError = msg + " in " + url + " (line: " + line + ")";
  console.error(msgError);

  CPA.sendEvent("Errors", chrome.runtime.getManifest().version, {
    msg  : msg,
    url  : url,
    line : line,
    trace: err && err.stack || ""
  });
};
