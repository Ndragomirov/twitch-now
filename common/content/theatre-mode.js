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

  function turnOn(){
    var turnOnBtn = document.querySelector(theatreBtnSelector);
    if ( turnOnBtn ) {
      turnOnBtn.click();
    }
  }

  document.addEventListener("DOMContentLoaded", function (){
    var hash = window.location.search;
    if ( /mode=theater/i.test(hash) ) {
      waitUntilVisible(theatreBtnSelector, function (){
        turnOn();
      })
    }
  })
})();