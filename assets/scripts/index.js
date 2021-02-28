// import * as Mopidy from "mopidy";
import IcecastMetadataPlayer from "icecast-metadata-player";

const WIDTH = 1000;
const HEIGHT = 200;

const RADIO_URL = "http://94.61.227.207:8000/radiouniverso";

const onMetadata = (metadata) => {
  console.log("metadata", metadata);
};

const createMediaPlayer = () => {
  const [audioElement, ...rest] = document.getElementsByTagName("audio");

  return new IcecastMetadataPlayer(RADIO_URL, {
    onMetadata,
    audioElement,
    metadataTypes: ["icy", "ogg"],
  });
};

const start = () => {
  const canvas = document.getElementById("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const [audioElement, ...rest] = document.getElementsByTagName("audio");
  let player = null;
  const canvasCtx = canvas.getContext("2d");
  let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let analyser = audioCtx.createAnalyser();
  analyser.fftSize = 4096;
  let animation;

  const draw = () => {
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(0, 0, 0)";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(255, 255, 255)";
    canvasCtx.beginPath();

    let sliceWidth =
      (canvas.width * window.devicePixelRatio * 2) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * canvas.height) / 4 + canvas.height / 4;

      i === 0 ? canvasCtx.moveTo(x, y) : canvasCtx.lineTo(x, y);
      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    animation = requestAnimationFrame(draw);
  };

  const resize = () => {
    console.log(window.innerWidth);
    console.log(window.innerHeight);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const pause = async () => {
    if (player) await player.stop();

    player.detachAudioElement();
    player = null;
    if (animation) cancelAnimationFrame(animation);
  };

  const onPlay = async () => {
    let source = audioCtx.createMediaElementSource(player.audioElement);
    source.connect(analyser);
    source.connect(audioCtx.destination);

    if (animation) cancelAnimationFrame(animation);

    animation = requestAnimationFrame(draw);
  };

  const play = async () => {
    if (!player) {
      player = await createMediaPlayer();
      player.audioElement.addEventListener("playing", onPlay);
      await player.play();
    } else if (player.state === "playing") {
      return;
    } else {
      await player.play();
    }
  };

  audioElement.addEventListener("pause", pause);
  audioElement.addEventListener("play", play);
  window.addEventListener("resize", resize);
  play();
};

window.addEventListener("load", start);
