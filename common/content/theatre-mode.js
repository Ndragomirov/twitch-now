(function (){

  var theatreBtnSelector = '.qa-theatre-mode-button';
  const MAX_TRIES = 400;

  function waitUntilVisible(selector, callback){
    var tries = 0;
    var tm = setInterval(function (){
      var el = document.querySelector(selector);
      if ( ++tries > MAX_TRIES ) {
        clearInterval(tm);
        callback("timeout error");
      }

      if ( el && el.offsetHeight > 0 ) {
        clearInterval(tm);
        callback();
      }
    }, 50)
  }

  function wait(fn, callback){
    if ( fn() ) {
      return callback();
    } else {
      setTimeout(function (){
        wait(fn, callback)
      }, 250);
    }
  }

  function turnOn(){
    var turnOnBtn = document.querySelector(theatreBtnSelector);
    if ( turnOnBtn ) {
      turnOnBtn.click();
    }
  }

  document.addEventListener("DOMContentLoaded", function (){
    var hash = window.location.search; // no iframes
    var ref = document.referrer || ""; //inside player's iframe
    if ( /mode=theater/i.test(ref) || /mode=theater/i.test(hash) ) {
      waitUntilVisible(theatreBtnSelector, function (err){
        if ( !err ) {
          turnOn();
        }
      })
    }
  })
})();