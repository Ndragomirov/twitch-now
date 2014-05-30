(function (){
  var root = this;

  var that = {}

  var patchXHR = that.patchXHR = function (){

    if ( typeof window != "undefined" ) {
      console.log("\nPatching XHR Object\n");
      var requests = {};
      var guid = 0;
      var xhr = sinon.useFakeXMLHttpRequest();

      xhr.onCreate = function (xhr){

        guid = guid + 1;
        requests[guid] = xhr;
        xhr.guid = guid;

        setTimeout(function (){
          self.port.emit("XHR_PROXY", xhr);
        }, 1);
      };
      self.port.on("XHR_PROXY_RESPONSE", function (response){
        requests[response.guid].respond(response.status, response.headers, response.text);
      })
    }

  }

  that.patchXHR();
  root.xhrProxy = that;

}).call(this);
