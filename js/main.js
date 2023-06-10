window.addEventListener("load", initializePlayer);

function initializePlayer() {

  const el = function(selector) {
    return document.querySelector(selector);
  }
  const musicContainer = el(".music-container"),
  playBtn = el(".play"),
  prevBtn = el(".prev"),
  nextBtn = el(".next"),
  progress = el(".progress"),
  progressContainer = el(".progress-container"),
  volBtn = el(".vol-btn i"),
  volSlider = el("input.vol-slider"),
  playRepeatBtn = el(".play-repeat-mode i"),
  currentTimeLabel = el(".current-time"),
  durationTimeLabel = el(".duration-time"),
  audio = new Audio(), 
  ext = ".mp3",
  dir = "music/";

  let songTitle = el(".song-title"),
  songArtiste = el(".song-artiste"),
  songCover = el(".cover-art");

  // Song playlist info. 
  const playlist = [{
    "track": 1,
    "title": "Tempo",
    "artiste": "KB",
    "file": "KB_Tempo",
    "cover": "images/tomorrowwelive.jpg",
  },
    {
    "track": 2,
    "title": "Round Cake",
    "artiste": "M.I Abaga",
    "file": "M.I_Abaga_-_Round_Cake_(Freestyle)",
    "cover": "images/sound-bars.jpg",
},{
    "track": 3,
    "title": "Pray to God",
    "artiste": "Cavin Harris feat. HAIM",
    "file": "Calvin_Harris_-_Pray_to_God_ft._HAIM",
    "cover": "images/lion-black.jpg",
},{
    "track": 4,
    "title": "All Is Bright",
    "artiste": "116 feat. Wande, 1k Phew, Derek Minor",
    "file": "116_-_All_Is_Bright_feat._Wande,_1K_Phew,_Derek Minor",
    "cover": "images/earth-peace.jpg",
  }]
  
  // KeepTrack of song
  let songIndex = 0;
  
  // Audio Object reference
  audio.src = dir+playlist[0].file+ext;
  
  // // Song Info 
  // songTitle = playlist[songIndex].title;
  // songArtiste = playlist[songIndex].artiste;
  // songCover = playlist[songIndex].cover;
  
  // Event listeners
  nextBtn.addEventListener("click", nextSong);
  prevBtn.addEventListener("click", prevSong);
  audio.addEventListener("timeupdate", UpdateAudioTimeline);
  audio.addEventListener("ended", nextSong);
  volSlider.addEventListener("change", changeVolume);
  volSlider.addEventListener("input", changeVolume);

  // Next song
  function nextSong() {
    songIndex++;
    if(songIndex >= playlist.length) {
      songIndex = 0;
    }
    audio.currentTime = 0;
    songTitle.innerText = playlist[songIndex].title;
    songArtiste.innerText = playlist[songIndex].artiste;
    songCover.src = playlist[songIndex].cover;
    audio.src = dir+playlist[songIndex].file+ext;
    playSong();
  }

  // Previous song
  function prevSong() {
    songIndex--;
    if (songIndex < 0) {
      songIndex = playlist.length - 1;
    }
    audio.currentTime = 0;
    songTitle.innerText = playlist[songIndex].title;
    songArtiste.innerText = playlist[songIndex].artiste;
    songCover.src = playlist[songIndex].cover;
    audio.src = dir+playlist[songIndex].file+ext;
    playSong();

  }

  // Play Song
  function playSong() {
    musicContainer.classList.add("play");
    playBtn.querySelector("i.fa").classList.remove("fa-play");
    playBtn.querySelector("i.fa").classList.add("fa-pause");
    audio.play();
  }

  // Pause Song
  function pauseSong() {
    musicContainer.classList.remove("play");
    playBtn.querySelector("i.fa").classList.add("fa-play");
    playBtn.querySelector("i.fa").classList.remove("fa-pause");
    audio.pause();
  }

  // Update progress bar
  function UpdateAudioTimeline() {
    const currentTime  = audio.currentTime;
    const progressPercent = (currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeLabel.innerText = formatTime(this.currentTime)
    
  }
  // change volume function
  function changeVolume() {
    audio.volume = volSlider.value / 100;
  }

  // Format time function
  function formatTime(time) {
    let secs = Math.floor(time % 60),
    mins = Math.floor(time / 60) % 60,
    hours = Math.floor(time / 3600);

    secs = secs < 10 ? `0${secs}` : secs;
    mins = mins < 10 ? `0${mins}` : mins;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) {
        return `${mins}:${secs}`;
    }
    return `${hours}:${mins}:${secs}`;
}

  // Update timeline when user clicks progressbar
  progressContainer.addEventListener("click", function(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  });

  // Play/pause audio
  playBtn.addEventListener("click", function() {
    const isPlaying = musicContainer.classList.contains("play");
    if(isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  });

  // volume btn is clicked
  volBtn.addEventListener("click", function() {
    if(!volBtn.classList.contains("fa-volume-up") || audio.muted) {
      // unmute audio by setting vol to 50%
      volBtn.classList.replace("fa-volume-off", "fa-volume-up");
      audio.volume = 0.5;
    } else {
      // mute audio entire
      volBtn.classList.replace("fa-volume-up", "fa-volume-off");
      audio.volume = 0.0;
    }
    volSlider.value = audio.volume;
  });

  audio.addEventListener("loadeddata", function() {
    durationTimeLabel.innerText = formatTime(this.duration);
  });
}