//based on https://github.com/IsSuEat/open-livestreamer-firefox-addon
//GPLV3

const { Cc, Ci } = require("chrome");
var self = require("sdk/self"),
  system = require("sdk/system");

var livestreamerPaths = {
  linux: [
    "/usr/local/bin/livestreamer",
    "/usr/bin/livestreamer"
  ],
  winnt: [
    "C:\\Program Files (x86)\\Livestreamer\\livestreamer.exe"
  ],
  mac  : [
    "/Applications/livestreamer.app"
  ]
}

function runLivestreamer(url, quality, lspath){
  var path
    , file
    , process
    ;

  lspath = lspath ? lspath.trim() : "";
  if ( isCorrectPath(lspath) ) {
    path = lspath;
  } else {
    path = getLivestreamerPath();
  }
  console.log("Using livestreamer path = " + path);
  if ( !path ) {
    return console.log("No livestreamer found");
  }
  file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  file.initWithPath(path);
  process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
  process.init(file);
  process.run(false, [url, quality], 2);
}

function isCorrectPath(p){
  var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile)
  try {
    file.initWithPath(p);
  } catch (e) {
    return null;
  }
  return file.exists();
}

function getLivestreamerPath(){
  var suggestedPaths = livestreamerPaths[system.platform];
  if ( !suggestedPaths ) {
    console.log("\nUnknown OS");
    return null;
  }

  for ( var i = 0; i < suggestedPaths.length; i++ ) {
    if ( isCorrectPath(suggestedPaths[i]) ) {
      return suggestedPaths[i];
    }
  }
  return null;
}

module.exports.runLivestreamer = runLivestreamer;