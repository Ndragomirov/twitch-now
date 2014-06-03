window.onerror = function (msg, url, line, column, err){
  var msgError = msg + " in " + url + " (line: " + line + ")";
  console.error(msgError);

  chrome.runtime.sendMessage({
    action: "stat",
    method: "sendEvent",
    args  : [
      "Errors",
      chrome.runtime.getManifest().version,
      {
        ua   : window.navigator.userAgent,
        msg  : msg,
        url  : url,
        line : line,
        trace: err && err.stack || ""
      }
    ]
  })
};