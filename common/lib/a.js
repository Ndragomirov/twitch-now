analytics.init('UA-21976825-4');

window.onerror = function (msg, url, line, column, err){
  var msgError = msg + " in " + url + " (line: " + line + ")";
  console.error(msgError);

  analytics({
    t : "event",
    ec: "Errors",
    ea: utils.runtime.getVersion(),
    el: {
      ua   : window.navigator.userAgent,
      msg  : msg,
      url  : url,
      line : line,
      trace: err && err.stack || ""
    }
  });
};