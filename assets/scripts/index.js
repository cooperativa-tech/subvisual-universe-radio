import IcecastMetadataPlayer from "icecast-metadata-player";
import { io } from "socket.io-client";

import createAnalyserAnimation from "./animation.js";

const RADIO_URL = "https://stream.radiouniverso.live/radiouniverso";
const RADIO_SOCKET = "wss://radiouniverso.live/ws/";

const start = () => {
  let animationLoop;
  let track = {};
  let listeners, listenerPeak;
  let artists = "";
  let timePosition = 0;
  let totalTrackTime = 0;
  let updateTimeLoop;

  const mute = document.getElementById("mute");
  const album = document.getElementById("album");
  const canvas = document.getElementById("canvas");
  const spinner = document.getElementById("loading");
  const volume = document.getElementById("volume");
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const audioElement = document.getElementById("audio");
  const progressBar = document.getElementById("progress");
  const volumeOn = document.getElementById("volumeOn");
  const volumeOff = document.getElementById("volumeOff");
  const totalTime = document.getElementById("totalTime");
  const currentSong = document.getElementById("currentSong");
  const currentTime = document.getElementById("currentTime");
  const currentArtist = document.getElementById("currentArtist");
  const currentListeners = document.getElementById("currentListeners");

  spinner.classList.add("hidden");
  playButton.classList.remove("hidden");

  let player;
  let animation;

  const socket = io("ws.radiouniverso.live");
  socket.on("data", (data) => {
    track = data.current;
    listeners = data.listeners;
    listenerPeak = data.listenerPeak;
    timePosition = data.current.timePosition;

    clearInterval(updateTimeLoop);
    updateTimeLoop = setInterval(incrementTimer, 1000);
    updateDomTrackMeta();
  });

  const toReadableString = (milis) => {
    const minutes = Math.floor(milis / 1000 / 60);
    const seconds = Math.floor((milis / 1000) % 60);

    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  };

  const incrementTimer = async () => {
    totalTrackTime = track.length || 0;
    timePosition = timePosition + 1000;
    let progress = timePosition / totalTrackTime;
    progress = progress === Infinity ? 0 : progress;

    totalTime.textContent = toReadableString(totalTrackTime);
    currentTime.textContent = toReadableString(timePosition);
    progressBar.style.transform = `scaleX(${progress})`;
  };

  const onLoad = () => {
    spinner.classList.remove("hidden");
    playButton.classList.add("hidden");
    pauseButton.classList.add("hidden");
  };

  const onPlay = async () => {
    if (audioElement.paused) return onStop();
    if (!animation) animation = createAnalyserAnimation(audioElement, canvas);
    spinner.classList.add("hidden");
    playButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
  };

  const onStop = () => {
    player.stop().finally(() => {
      audioElement.pause();
      spinner.classList.add("hidden");
      playButton.classList.remove("hidden");
      pauseButton.classList.add("hidden");
    });
  };

  const onRetry = () => {
    if (player) player.stop();
  };

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (animation) requestAnimationFrame(animation.resize);
  };

  const updateDomTrackMeta = async () => {
    artists = track.artists.reduce(
      (acc, { name }) => (acc.length ? `${acc}, ${name}` : name),
      "",
    );

    currentSong.textContent = `${track.name}`;
    currentArtist.textContent = artists;
    document.title = `${track.name} - Radio Universo`;
    currentListeners.textContent = `listeners ${listeners}, peak ${listenerPeak}`;

    const { uri } = track.image;

    album.src = uri;
    canvas.style.filter = "blur(12px)";
    canvas.style.backgroundImage = `url(${uri})`;
    audioElement.poster = uri;
  };

  const play = () => {
    if (!player) {
      player = new IcecastMetadataPlayer(RADIO_URL, {
        audioElement,
        metadataTypes: [],
        onLoad,
        onPlay,
        onStop,
        retryTimeout: 3,
        onRetry,
      });
    }

    try {
      player.play();
    } catch (error) {
      console.error(error);
    }
  };

  const draw = () => {
    animationLoop = requestAnimationFrame(draw);
    if (animation) animation.tick();
    if (animation) animation.draw();
  };

  spinner.addEventListener("click", onStop);
  playButton.addEventListener("click", () => play());
  pauseButton.addEventListener("click", onStop);
  window.addEventListener("resize", resize);

  volume.addEventListener("change", ({ target: { value } }) => {
    audioElement.volume = value;
    audioElement.muted = false;
  });

  mute.addEventListener("click", () => {
    const muted = !audioElement.muted;
    audioElement.muted = muted;

    if (muted) {
      volumeOn.classList.add("hidden");
      volumeOff.classList.remove("hidden");
    } else {
      volumeOn.classList.remove("hidden");
      volumeOff.classList.add("hidden");
    }
  });

  window.addEventListener("blur", () => {
    if (animationLoop) {
      cancelAnimationFrame(animationLoop);
      animationLoop = null;
    }
  });

  window.addEventListener("focus", () => {
    if (!animationLoop) requestAnimationFrame(draw);
  });

  audioElement.addEventListener("canplay", () => {
    if (!animationLoop) requestAnimationFrame(draw);
  });

  requestAnimationFrame(draw);
  updateTimeLoop = setInterval(incrementTimer, 1000);

  try {
    play();
  } catch (error) {
    console.error(error);
    onLoad();
  }
};

window.addEventListener("load", start);
