
let mediaStreamSource;
let detectVolumeProcessorNode;

window.onload = () => {
  audioNode = document.querySelector('audio');

  audioNode.addEventListener('play' , (e) =>  {
    if (detectVolumeProcessorNode) {
      detectVolumeProcessorNode.port.postMessage('play');
    } else {
      const context = new AudioContext();
      context.audioWorklet.addModule('processors.js').then(() => {
        detectVolumeProcessorNode = new AudioWorkletNode(context, 'detect-volume', {parameterData: {averaging: 0.95}});
        mediaStreamSource = context.createMediaElementSource(audioNode);
        mediaStreamSource.connect(detectVolumeProcessorNode)
        mediaStreamSource.connect(context.destination);

        detectVolumeProcessorNode.port.onmessage = (event) => {
          document.querySelector('#audio-value').innerHTML = event.data;
        };
      
      });
    }
  });

  audioNode.addEventListener('pause' , (e) =>  {
    detectVolumeProcessorNode.port.postMessage('pause');
  });
}
