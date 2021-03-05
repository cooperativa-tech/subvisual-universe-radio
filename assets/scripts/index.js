const RADIO_URL = "https://stream.radiouniverso.live/";
const RADIO_SOCKET = "wss://radiouniverso.live/ws/";

const createCanvas = () => {
  const canvas = document.getElementById("canvas");

  canvas.width = window.innerWidth;
  canvas.height = 70;

  return canvas;
};

const createMediaPlayer = (audioElement, onLoad, onPlay, onStop) => {
  const player = new window.IcecastMetadataPlayer(RADIO_URL, {
    audioElement,
    metadataTypes: [],
    onLoad,
    onPlay,
    onStop,
  });

  return player;
};

const createAudioElement = () => {
  const audioElement = document.getElementById("audio");

  return audioElement;
};

const createAnalyser = () => {
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.95;

  return { analyser, audioCtx };
};

const createAnalyserAnimation = (player) => {
  const canvas = createCanvas();
  const canvasCtx = canvas.getContext("2d");
  const { analyser, audioCtx } = createAnalyser();

  const length = analyser.frequencyBinCount;
  let timeArray = new Uint8Array(length);
  let freqArray = new Uint8Array(length);

  let source = audioCtx.createMediaElementSource(player.audioElement);
  source.connect(analyser);
  source.connect(audioCtx.destination);

  const tick = () => {
    // analyser.getByteTimeDomainData(timeArray);
    analyser.getByteFrequencyData(freqArray);
  };

  const draw = () => {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.strokeStyle = "rgb(255, 255, 255)";

    // let sliceWidth = canvas.width / length;
    let barWidth = (canvas.width * window.devicePixelRatio) / length;
    let barX = 0;
    // let lineX = 0;

    for (let i = 0; i < length; i++) {
      // const v = timeArray[i];
      // const y = canvas.height / 2 + v;
      let progress = freqArray[i] / 240;
      let barHeight = progress * 70;
      let x = barX - barWidth / 2;
      // i === 0 ? canvasCtx.moveTo(lineX, y) : canvasCtx.lineTo(lineX, y);

      if (freqArray[i] > 0) {
        canvasCtx.fillStyle = `rgba(255,255,255, ${progress})`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      }

      // canvasCtx.fillStyle = `rgba(255,0,0, ${(freqArray[i] / 240) * 1})`;
      // canvasCtx.fillRect(barX, canvas.height - barHeight - 1, barWidth + 1, 2);

      barX += barWidth;
      // lineX += sliceWidth;
    }

    // canvasCtx.stroke();
  };

  return { draw, tick };
};

const start = () => {
  let animationLoop, updateLoop;
  let audioElement = createAudioElement();
  let player = {};
  let animation = null;

  const album = document.getElementById("album");
  const spinner = document.getElementById("loading");
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const currentSong = document.getElementById("currentSong");
  const currentartist = document.getElementById("currentArtist");

  let track = {};
  let artists = "";

  const mopidy = new Mopidy({ autoConnect: true, webSocketUrl: RADIO_SOCKET });

  const onLoad = () => {
    playButton.classList.add("w-0");
    pauseButton.classList.add("w-0");
    spinner.classList.remove("w-0");
  };

  const onPlay = () => {
    spinner.classList.add("w-0");
    playButton.classList.add("w-0");
    pauseButton.classList.remove("w-0");
  };

  const onStop = () => {
    spinner.classList.add("w-0");
    playButton.classList.remove("w-0");
    pauseButton.classList.add("w-0");
  };

  const updateDomTrackMeta = async () => {
    artists = track.artists.reduce(
      (acc, { name }) => (acc.length ? `${acc}, ${name}` : name),
      "",
    );

    currentSong.textContent = `${track.name}`;
    currentArtist.textContent = `${artists}`;

    const {
      album: { uri },
    } = track;
    const images = await mopidy.library.getImages([[uri]]);
    const [image] = images[uri];

    album.src = image.uri;
    // album.width = image.width;
    // album.height = image.height;
  };

  mopidy.on("event", (type, { tl_track }) => {
    if (type === "event:trackPlaybackStarted" && tl_track) {
      track = tl_track.track;
      updateDomTrackMeta();
    }
  });

  mopidy.on("state:online", async () => {
    track = await mopidy.playback.getCurrentTrack();
    updateDomTrackMeta();
  });

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const pause = () => {
    if (player && player.stop) player.stop();
    else onStop();
    if (animationLoop) {
      cancelAnimationFrame(animationLoop);
      animationLoop = null;
    }
  };

  const play = () => {
    if (!player || !player.state) {
      player = createMediaPlayer(audioElement, onLoad, onPlay, onStop);
    }

    try {
      if (!animation) animation = createAnalyserAnimation(player);

      player.play();
      if (!animationLoop) requestAnimationFrame(draw);
    } catch (error) {
      console.error(error);
    }
  };

  const draw = () => {
    animationLoop = requestAnimationFrame(draw);
    if (animation) animation.tick();
    if (animation) animation.draw();
  };

  spinner.addEventListener("click", pause);
  playButton.addEventListener("click", play);
  pauseButton.addEventListener("click", pause);
  window.addEventListener("resize", resize);
  window.addEventListener("blur", () => {
    if (animationLoop) {
      cancelAnimationFrame(animationLoop);
      animationLoop = null;
    }
  });
  window.addEventListener("focus", () => {
    if (!animationLoop) requestAnimationFrame(draw);
  });

  audioElement
    .play()
    .then(play)
    .catch(() => {
      //No autoplay for us
      onStop();
    });
};

window.addEventListener("load", start);
