const RADIO_URL = "http://radiouniverso.live/radiouniverso";

const onMetadata = (metadata) => {};

const createCanvas = () => {
  const canvas = document.getElementById("canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  return canvas;
};

const createMediaPlayer = (audioElement) => {
  const player = new window.IcecastMetadataPlayer(RADIO_URL, {
    onMetadata,
    audioElement,
    metadataTypes: [],
  });

  return player;
};

const createAudioElement = () => {
  const [audioElement, ...rest] = document.getElementsByTagName("audio");

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
  let animation;
  const canvas = createCanvas();
  const canvasCtx = canvas.getContext("2d");
  const { analyser, audioCtx } = createAnalyser();

  const length = analyser.frequencyBinCount;
  let timeArray = new Uint8Array(length);
  let freqArray = new Uint8Array(length);

  let source = audioCtx.createMediaElementSource(player.audioElement);
  source.connect(analyser);
  source.connect(audioCtx.destination);

  const draw = () => {
    animation = requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(timeArray);
    analyser.getByteFrequencyData(freqArray);

    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.fillStyle = "rgb(255, 255, 255)";

    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = "rgb(255, 255, 255)";
    canvasCtx.beginPath();

    let sliceWidth = canvas.width / length;
    let barWidth = canvas.width / length;
    let x = 0;

    // const grd = canvasCtx.createLinearGradient(
    //   0,
    //   canvas.height - 120,
    //   0,
    //   canvas.height,
    // );
    // grd.addColorStop(1, "white");
    // grd.addColorStop(0, "red");

    // for (let i = 0; i < length; i++) {
    //   const v = timeArray[i] / 128.0;
    //   const y = v * (canvas.height / 2);
    //
    //   i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
    //   x += sliceWidth;
    // }
    //
    // canvasCtx.lineTo(canvas.width, canvas.height / 2);
    // canvasCtx.stroke();

    x = 0;
    for (let i = 0; i < length; i++) {
      let progress = i / length;
      let barHeight = freqArray[i] / 2;

      canvasCtx.fillStyle = "white";
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth + 2, barHeight);
      canvasCtx.fillStyle = "red";
      canvasCtx.fillRect(x, canvas.height - barHeight - 4, barWidth, 2);
      x += barWidth + 1;
    }
  };

  const start = () => {
    animation = requestAnimationFrame(draw);
  };

  const stop = () => {
    cancelAnimationFrame(animation);
  };

  return { start, stop };
};

const start = () => {
  let audioElement = createAudioElement();
  let player = {};
  let animation = null;

  const spinner = document.getElementById("loading");
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");

  let track = {};
  let artists = "";

  const mopidy = new Mopidy({
    autoConnect: true,
    webSocketUrl: "ws://94.61.227.207:6680/mopidy/ws/",
  });

  const updateDomTrackMeta = () => {
    const currentSong = document.getElementById("currentSong");
    const currentartist = document.getElementById("currentArtist");

    artists = track.artists.reduce(
      (acc, { name }) => (acc.length ? `${acc}, ${name}` : name),
      "",
    );

    currentSong.textContent = `${track.name}`;
    currentArtist.textContent = `${artists}`;
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

  const pause = async () => {
    if (player) await player.stop();
  };

  const play = async () => {
    if (player && player.state === "playing") {
      return;
    }

    if (!player.state) {
      player = createMediaPlayer(audioElement);
    }

    player.play();

    if (!animation) {
      animation = createAnalyserAnimation(player);
      animation.start();
    }
  };

  const updatePlayerButtons = () => {
    requestAnimationFrame(updatePlayerButtons);
    if (
      player.state === "loading" ||
      player.state === "retrying" ||
      player.state === "stopping"
    ) {
      playButton.classList.add("w-0");
      pauseButton.classList.add("w-0");
      spinner.classList.remove("w-0");
    } else if (player.state === "playing") {
      spinner.classList.add("w-0");
      playButton.classList.add("w-0");
      pauseButton.classList.remove("w-0");
    } else {
      spinner.classList.add("w-0");
      playButton.classList.remove("w-0");
      pauseButton.classList.add("w-0");
    }
  };

  spinner.addEventListener("click", pause);
  playButton.addEventListener("click", play);
  pauseButton.addEventListener("click", pause);
  window.addEventListener("resize", resize);

  play();
  requestAnimationFrame(updatePlayerButtons);
};

window.addEventListener("load", start);
