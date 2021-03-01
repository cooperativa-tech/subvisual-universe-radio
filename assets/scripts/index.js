import IcecastMetadataPlayer from "icecast-metadata-player";

const RADIO_URL = "http://94.61.227.207:8000/radiouniverso";

const onMetadata = (metadata) => {
  console.log("metadata", metadata);
};

const createCanvas = () => {
  const canvas = document.getElementById("canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  return canvas;
};

const createMediaPlayer = () => {
  const [audioElement, ...rest] = document.getElementsByTagName("audio");

  return new IcecastMetadataPlayer(RADIO_URL, {
    onMetadata,
    audioElement,
    metadataTypes: ["icy", "ogg"],
  });
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
  console.log(analyser);

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

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(255, 255, 255)";
    canvasCtx.beginPath();

    let sliceWidth = canvas.width / length;
    let barWidth = canvas.width / length;
    let x = 0;

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
      canvasCtx.fillStyle = `rgb(255, 255, 255)`;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
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
  let player;
  let animation;
  let audioElement = createAudioElement();

  const spinner = document.getElementById("loading");
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");

  const mopidy = new Mopidy({
    autoConnect: true,
    webSocketUrl: "ws://94.61.227.207:6680/mopidy/ws/",
  });

  mopidy.on("event", (data, props) => {
    console.log(data, props);
  });

  mopidy.on("state:online", async () => {
    const track = await mopidy.playback.getCurrentTrack();
    const currentSong = document.getElementById("currentSong");
    const currentartist = document.getElementById("currentArtist");
    const artists = track.artists.reduce(
      (acc, { name }) => (acc.length ? `${acc}, ${name}` : name),
      "",
    );
    currentSong.textContent = `${track.name}`;
    currentArtist.textContent = `${artists}`;
  });

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const pause = async () => {
    if (player) await player.stop();

    player.detachAudioElement();
    player = null;
    playButton.classList.remove("w-0");
    pauseButton.classList.add("w-0");
    if (animation) animation.stop();
  };

  const onPlay = async () => {
    if (!animation) {
      animation = createAnalyserAnimation(player);
      animation.start();
    }

    if (animation) animation.start();
  };

  const play = async () => {
    if (!player) {
      player = await createMediaPlayer();
      await player.play();
      console.log("here");
    } else if (player.state === "playing") {
      console.log("hu-hu");
      return;
    } else {
      await player.play();
    }
  };

  const updatePlayerButtons = () => {
    requestAnimationFrame(updatePlayerButtons);

    if (!player) {
      spinner.classList.add("w-0");
      playButton.classList.remove("w-0");
      pauseButton.classList.add("w-0");
    } else if (
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

  audioElement.addEventListener("pause", pause);
  audioElement.addEventListener("play", play);
  audioElement.addEventListener("playing", onPlay);
  playButton.addEventListener("click", play);
  pauseButton.addEventListener("click", pause);
  window.addEventListener("resize", resize);

  play();
  requestAnimationFrame(updatePlayerButtons);
};

window.addEventListener("load", start);
