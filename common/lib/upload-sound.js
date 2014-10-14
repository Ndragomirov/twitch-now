(function (){
  var root = this
    , uploadButton = document.querySelector('#uploadSound')
    , toggleButton = document.querySelector('#toggleSound')
    , playIcon = document.querySelector(".icon-play2")
    , pauseIcon = document.querySelector(".icon-pause2")
    , output = document.querySelector('#output')
    , audio = new Audio()
    ;

  /**
   *  Reads file and returns data-url
   * @param opts.file
   * @param opts.maxSize (in KBytes)
   * @param cb
   * @return {*}
   */
  var readFile = function (opts, cb){
    var file = opts.file;
    var maxSize = opts.maxSize;
    var fileReader = new FileReader();

    if ( maxSize && ( file.size / 1024 ) > maxSize ) {
      return cb("Max file size is " + maxSize + " kb");
    }

    fileReader.onloadend = function (){
      return cb(null, this.result);
    };

    fileReader.onabort = fileReader.onerror = function (){
      switch (this.error.code) {
        case FileError.NOT_FOUND_ERR:
          cb("File not found!");
          break;
        case FileError.SECURITY_ERR:
          cb("Security error!");
          break;
        case FileError.NOT_READABLE_ERR:
          cb("File not readable!");
          break;
        case FileError.ENCODING_ERR:
          cb("Encoding error in file!");
          break;
        default:
          cb("An error occured while reading the file!");
          break;
      }

    };
    fileReader.readAsDataURL(file);
  };

  function showPauseButton(){
    pauseIcon.style.display = "block";
    playIcon.style.display = "none";
  }

  function showPlayButton(){
    pauseIcon.style.display = "none";
    playIcon.style.display = "block";
  }

  toggleButton.addEventListener('click', function (){
    if ( audio.src ) {
      if ( audio.paused ) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  })

  audio.addEventListener("play", function (){
    showPauseButton();
  })

  audio.addEventListener("pause", function (){
    showPlayButton();
  })

  uploadButton.addEventListener('change', function (e){
    var file = this.files[0];
    if ( file ) {
      readFile({file: file, maxSize: 200}, function (err, res){
        output.textContent = err ? err : "sound uploaded";

        if ( !err ) {
          audio.src = "";
          audio.src = res;
          audio.play();
          localStorage["customSound"] = res;
        }

      });
    }
  });

  showPlayButton();

}).call(this);