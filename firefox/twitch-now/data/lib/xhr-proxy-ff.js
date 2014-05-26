(function (){
  "use strict";

  var root = this;

  var patchXHR = function (){

    //content-script
    if ( typeof window != "undefined" ) {

      console.log("Patching XHR Object");

      var server = root.sinon.fakeServer.create();

      server.respondWith(function (xhr){
        console.log(xhr);
        //      self.postMessage({xhr: xhr, type: "XHR_PROXY"});
        self.port.emit("XHR_PROXY", {xhr: xhr, type: "XHR_PROXY"});
        xhr.respond(200, { "Content-Type": "application/json", "Content-Length": 2 }, "{}");
      });

      server.autoRespond = true;

    }

  }

  patchXHR();

}).call(this);
