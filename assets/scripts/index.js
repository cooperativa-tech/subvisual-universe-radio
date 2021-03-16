import Mopidy from "mopidy-es6";
import IcecastMetadataPlayer from "icecast-metadata-player";

import createAnalyserAnimation from "./animation.js";

const RADIO_URL = "https://stream.radiouniverso.live/";
const RADIO_SOCKET = "wss://radiouniverso.live/ws/";

const start = () => {
  let animationLoop;
  let track = {};
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

  let player;
  let animation = createAnalyserAnimation(audioElement, canvas);

  const mopidy = new Mopidy(RADIO_SOCKET);

  mopidy.on("event:trackPlaybackStarted", async ({ tl_track }) => {
    if (tl_track) {
      track = tl_track.track;
      await updateDomTrackMeta();
    }
  });

  mopidy.on("state:online", async () => {
    track = await mopidy.playback.getCurrentTrack();
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
    totalTrackTime = track.length;
    timePosition = timePosition + 1000;
    let progress = timePosition / totalTrackTime;

    totalTime.textContent = toReadableString(totalTrackTime);
    currentTime.textContent = toReadableString(timePosition);
    progressBar.style.transform = `scaleX(${progress})`;

    if (mopidy.playback) {
      timePosition = await mopidy.playback.getTimePosition();
    }
  };

  const onLoad = () => {
    spinner.classList.remove("hidden");
    playButton.classList.add("hidden");
    pauseButton.classList.add("hidden");
  };

  const onPlay = () => {
    if (audioElement.paused) return onStop();

    spinner.classList.add("hidden");
    playButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
    pauseButton.focus();
  };

  const onStop = () => {
    player.stop().finally(() => {
      spinner.classList.add("hidden");
      playButton.classList.remove("hidden");
      pauseButton.classList.add("hidden");
      playButton.focus();
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

    const images = await mopidy.library.getImages([track.album.uri]);
    const [{ uri }] = images[track.album.uri];

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
      audioElement.play().finally(player.play).catch(pause);
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
  playButton.addEventListener("click", play);
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
    if (!animation) animation = createAnalyserAnimation(player, album);
    if (!animationLoop) requestAnimationFrame(draw);
  });

  requestAnimationFrame(draw);
  updateTimeLoop = setInterval(incrementTimer, 1000);
  try {
    audioElement.play().finally(play).catch(pause);
  } catch (error) {
    pause();
    console.error(error);
  }
};

window.addEventListener("load", start);
