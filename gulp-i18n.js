var through = require('through2')
  , path = require('path')
  , gutil = require('gulp-util')
  , File = gutil.File
  ;

module.exports = function (file){
  var locales = {};
  var latestFile;
  var latestMod;
  var joinedFile;

  function endStream(cb){
    joinedFile = latestFile.clone({contents: false});
    joinedFile.path = path.join(latestFile.base, file);
    joinedFile.contents = new Buffer(JSON.stringify(locales, null, 2));
    this.push(joinedFile);
    cb();
  }

  function localesToJSON(file, encoding, callback){
    if ( file.isNull() ) {
      this.push(file); // Do nothing if no contents
      return callback();
    }

    if ( file.isStream() ) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Stream not supported!'));
      return callback();
    }

    if ( file.isBuffer() ) {
      locales[file.path.split("/").slice(-2, -1)[0]] = JSON.parse(file.contents.toString());
    }

    // set latest file if not already set,
    // or if the current file was modified more recently.
    if ( !latestMod || file.stat && file.stat.mtime > latestMod ) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    return callback();
  }

  return through.obj(localesToJSON, endStream);
};