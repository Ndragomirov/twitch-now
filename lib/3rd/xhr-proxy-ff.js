(function (){
  var root = this;
  var unsafeWindow = root.unsafeWindow;


  var that = {};

  var patchXHR = that.patchXHR = function (){

//    content-script
    if ( typeof window != "undefined" ) {


      var requests = {};

      var guid = 0;

      console.log("\nPatching XHR Object\n");

//      var server = root.sinon.fakeServer.create();

//      window.wrappedJSObject.XMLHttpRequest = root.XMLHttpRequest;
//      unsafeWindow.XMLHttpRequest = root.XMLHttpRequest;

      var xhr = sinon.useFakeXMLHttpRequest();

      xhr.onCreate = function (xhr){

        guid = guid + 1;
        requests[guid] = xhr;
        xhr.guid = guid;

        setTimeout(function (){
//          console.log("\n\nSINON XHR:", xhr);
          self.port.emit("XHR_PROXY", xhr);
        }, 1);
      };

//      server.respondWith(function (xhr){
//        console.log("\n\nSINON XHR:", xhr);
//        self.postMessage({xhr: xhr, type: "XHR_PROXY"});
//        self.port.emit("XHR_PROXY", {xhr: xhr, type: "XHR_PROXY"});
//        xhr.respond(200, { "Content-Type": "application/json", "Content-Length": 2 }, "{}");
//      });


      self.port.on("XHR_PROXY_RESPONSE", function (response){
        requests[response.guid].respond(response.status, response.headers, response.text);
      })

//      server.autoRespond = true;

    }

  }

  root.setInterval(function(){

  })

  that.patchXHR();


  var handleRequest = that.handleRequest = function (xhr){

  }

  root.xhrProxy = that;

}).call(this);
