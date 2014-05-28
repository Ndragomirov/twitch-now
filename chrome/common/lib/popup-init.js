(function (){
  var scripts = [
    "common/lib/utils.js",
    "common/lib/3rd/jquery-1.8.2.min.js",
    "common/lib/3rd/bootstrap.min.js",
    "common/lib/3rd/underscore.js",
    "common/lib/3rd/backbone.js",
    "common/lib/3rd/handlebars.js",
    "common/lib/3rd/prettydate.js",
    "common/lib/3rd/i18n.js",
    "common/dist/templates.js",
    "common/lib/handlebars-helpers.js",
    "common/lib/popup.js",
    "common/lib/routes.js",
    "common/lib/init.js",
  ];

  scripts = scripts.map(function (v){
    return "<script src='" + chrome.runtime.getURL(v) + "'></script>";
  }).join('');

  document.write(scripts);
})();

