(function (){
  var root = this;
  var that = root.lytics = {};

  function isObject(obj){
    return obj === Object(obj);
  }

  var Lytics = function (trackingId){
    this.service = analytics.getService('twitch-chrome-extension');
    this.tracker = this.service.getTracker(trackingId);
    this.listen();
  }

  Lytics.prototype.listen = function (){
    var self = this;
    if ( chrome && chrome.runtime ) {
      chrome.runtime.onMessage.addListener(function (req, sender, sendResponse){
        if ( req.action !== "stat" )
          return;

        if ( self.tracker[req.method] ) {
          var args = req.args = req.args || [];
          args = args.map(function (a){
            return isObject(a) ? JSON.stringify(a) : a;
          })
          self.tracker[req.method].apply(self.tracker, args || []);
        }
      });
    }
  }

  that.init = function (trackingId){
    return new Lytics(trackingId);
  }
}).call(this);