//https://github.com/IsSuEat/open-livestreamer-firefox-addon
//GPLV3

const { Cc, Ci } = require("chrome");
var self = require("sdk/self"),
  system = require("sdk/system");

function runLivestreamer(args){
  var path,
    file,
    process;
  path = getLivestreamerPath();
  file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
  file.initWithPath(path);
  process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
  process.init(file);
  process.run(false, args, args.length);
}

function getLivestreamerPath(){
  var path,
    file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);

  if ( system.platform == "linux" ) {
    path = "/usr/local/bin/livestreamer";
  } else if ( system.platform == "winnt" ) {
    path = "C:\\Program Files (x86)\\Livestreamer\\livestreamer.exe";
  } else if ( system.platform == "mac" ) {
    path = "/Applications/livestreamer.app";
  }
  file.initWithPath(path);
  if ( file.exists() ) {
    return path;
  }
}

module.exports.runLivestreamer = runLivestreamer;