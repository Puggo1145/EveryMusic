// class VolumeProcessor extends AudioWorkletProcessor {
//   process(inputs, outputs, parameters) {
//     if (!inputs || !inputs[0] || !inputs[0][0]) { 
//       return true;
//     }
    
//     const input = inputs[0][0];
//     let sum = 0;
//     for (let i = 0; i < input.length; i++) {
//       sum += input[i] ** 2;
//     }
//     const rms = Math.sqrt(sum / input.length);
//     this.port.postMessage({ rms });
//     return true;
//   }
// }
// registerProcessor('volume-processor', VolumeProcessor);
