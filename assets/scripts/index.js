import Mopidy from "mopidy-es6";
import IcecastMetadataPlayer from "icecast-metadata-player";

import createAnalyserAnimation from "./animation.js";

const RADIO_URL = "https://stream.radiouniverso.live/";
const RADIO_SOCKET = "wss://radiouniverso.live/ws/";

const start = () => {
  let animationLoop;
  let track = {};
  let artists = "";

  const album = document.getElementById("album");
  const spinner = document.getElementById("loading");
  const volumne = document.getElementById("loading");
  const playButton = document.getElementById("play");
  const pauseButton = document.getElementById("pause");
  const audioElement = document.getElementById("audio");
  const currentSong = document.getElementById("currentSong");
  const currentArtist = document.getElementById("currentArtist");

  const onLoad = () => {
    spinner.classList.remove("hidden");
    playButton.classList.add("hidden");
    pauseButton.classList.add("hidden");
  };

  const onPlay = () => {
    spinner.classList.add("hidden");
    playButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
  };

  const onStop = () => {
    spinner.classList.add("hidden");
    playButton.classList.remove("hidden");
    pauseButton.classList.add("hidden");
  };

  const onRetry = () => {
    if (player) player.stop();
  };

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const updateDomTrackMeta = async () => {
    artists = track.artists.reduce(
      (acc, { name }) => (acc.length ? `${acc}, ${name}` : name),
      "",
    );

    currentSong.textContent = `${track.name}`;
    currentArtist.textContent = `by: ${artists}`;
    document.title = `${track.name} - Radio Universo`;

    const images = await mopidy.library.getImages([track.album.uri]);
    album.src = images[track.album.uri][0].uri;
  };

  const pause = () => {
    if (player && player.stop) player.stop();
    else onStop();
  };

  const play = () => {
    if (!player || !player.state) {
      player = createMediaPlayer(audioElement, onLoad, onPlay, onStop, onRetry);
    }

    try {
      audioElement.play();
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

  let player = new IcecastMetadataPlayer(RADIO_URL, {
    audioElement,
    metadataTypes: [],
    onLoad,
    onPlay,
    onStop,
    retryTimeout: 3,
    onRetry,
  });

  let animation = createAnalyserAnimation(player, album);

  const mopidy = new Mopidy(RADIO_SOCKET);

  mopidy.on("event:trackPlaybackStarted", ({ tl_track }) => {
    if (tl_track) {
      track = tl_track.track;
      updateDomTrackMeta();
    }
  });

  mopidy.on("state:online", async () => {
    track = await mopidy.playback.getCurrentTrack();
    updateDomTrackMeta();
  });

  spinner.addEventListener("click", pause);
  playButton.addEventListener("click", play);
  pauseButton.addEventListener("click", pause);
  volume.addEventListener("change", ({ target: { value } }) => {
    audioElement.volume = value;
    audioElement.muted = false;
  });

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

  audioElement.addEventListener("canplay", () => {
    if (!animation) animation = createAnalyserAnimation(player, album);
    if (!animationLoop) requestAnimationFrame(draw);
  });

  play();
  audioElement.play().catch(pause);
};

window.addEventListener("load", start);
