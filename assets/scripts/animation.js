const createAnalyser = () => {
  let audioCtx = window.AudioContext
    ? new AudioContext()
    : new webkitAudioContext();
  let analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.95;

  return { analyser, audioCtx };
};

const createAnalyserAnimation = (audioElement, canvas) => {
  const canvasCtx = canvas.getContext("2d");
  const { analyser, audioCtx } = createAnalyser();

  const length = analyser.frequencyBinCount;
  let freqArray = new Uint8Array(length);
  const source = audioCtx.createMediaElementSource(audioElement);

  source.connect(analyser);
  source.connect(audioCtx.destination);

  let gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(0.6, "rgba(0,0,0,0.9)");
  gradient.addColorStop(1, "rgba(0,0,0,1)");

  const resize = () => {
    gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(0,0,0,0.4)");
    gradient.addColorStop(0.6, "rgba(0,0,0,0.9)");
    gradient.addColorStop(1, "rgba(0,0,0,1)");
    draw();
  };

  const tick = () => {
    analyser.getByteFrequencyData(freqArray);
  };

  const draw = () => {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    canvasCtx.fillStyle = gradient;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

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

  return { draw, tick, resize, source, audioCtx };
};

export default createAnalyserAnimation;
