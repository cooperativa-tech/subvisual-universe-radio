const createCanvas = () => {
  const canvas = document.getElementById("canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  return canvas;
};

const createAnalyser = () => {
  let audioCtx = window.AudioContext
    ? new AudioContext()
    : new webkitAudioContext();
  let analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.95;

  return { analyser, audioCtx };
};

const createAnalyserAnimation = (player, album) => {
  const canvas = createCanvas();
  const canvasCtx = canvas.getContext("2d");
  const { analyser, audioCtx } = createAnalyser();

  const length = analyser.frequencyBinCount;
  let freqArray = new Uint8Array(length);
  const source = audioCtx.createMediaElementSource(player.audioElement);

  source.connect(analyser);
  source.connect(audioCtx.destination);

  const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.5, "rgba(0,0,0,0.4)");
  gradient.addColorStop(1, "rgba(0,0,0,1)");

  const tick = () => {
    analyser.getByteFrequencyData(freqArray);
  };

  const draw = () => {
    const albumSize = Math.max(canvas.width, canvas.height);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (album.src.length) {
      canvasCtx.globalAlpha = 0.2;
      canvasCtx.drawImage(
        album,
        canvas.width / 2 - albumSize / 2,
        canvas.height / 2 - albumSize / 2,
        albumSize,
        albumSize,
      );
      canvasCtx.globalAlpha = 1;
    }

    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.fillStyle = "rgba(255, 255, 255, 1)";

    let barX = 0;
    let barWidth = (canvas.width * window.devicePixelRatio) / length;
    let barMaxHeight = canvas.height / 10;

    for (let i = 0; i < length; i++) {
      let progress = freqArray[i] / 255;
      let barHeight = progress * barMaxHeight;
      let x = barX - barWidth / 2;

      if (freqArray[i] > 0) {
        canvasCtx.fillStyle = `rgba(255, 255, 255, ${progress})`;
        canvasCtx.fillRect(
          x,
          canvas.height * 0.75 - barHeight,
          barWidth,
          canvas.height,
        );
      }

      barX += barWidth;
    }
  };

  return { draw, tick, source, audioCtx };
};

export default createAnalyserAnimation;
