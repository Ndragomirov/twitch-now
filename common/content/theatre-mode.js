(function (){

  var theatreBtnSelector = '.js-control-theatre';

  function waitUntilVisible(selector, callback){
    var tm = setInterval(function (){
      var el = document.querySelector(selector);
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
    var hash = window.location.search;
    var ref = document.referrer || "";
    if ( /mode=theater/i.test(ref) ) {
      waitUntilVisible(theatreBtnSelector, function (){
        turnOn();
      })
    }
  })
})();