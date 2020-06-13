'use strict';

let ouputMIDIDevice = null;

// Listen to input from specific device
function listenToDevice(device) {
  device.addEventListener('midimessage', e => {
    const [command, key, velocity] = e.data;
    if (command === 144) {  // Note On, Ch. 1
      osc.frequency.setValueAtTime(Math.pow(2, (key - 69) / 12) * 440, audioCtx.currentTime); // convert MIDI key number to frequency
      gainNode.gain.setValueAtTime(velocity / 127, audioCtx.currentTime); // set volume on key press
    }
    console.log(`${command}, ${key}, ${velocity}`);

    // Loop MIDI back to turn on keys' lights
    ouputMIDIDevice.send([command, key, velocity]);
  });
}

// Load MIDI devices
window.navigator.requestMIDIAccess()
  .then(access => {
    const inputDevices = Array.from(access.inputs.values());
    console.log(`Input devices: ${inputDevices}`);
    listenToDevice(inputDevices[0]);

    const outputDevices = Array.from(access.outputs.values());
    console.log(`Output devices: ${outputDevices}`);
    ouputMIDIDevice = outputDevices[0];
  })
  .catch(err => console.error(`Unable to get MIDI devices: ${err}`));

// Initialize AudioContext
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Initialize oscillator
let osc = audioCtx.createOscillator();
osc.type = 'sine';
osc.frequency.setValueAtTime(440, audioCtx.currentTime);
osc.start();

// Initalize Gain Node to control volume
let gainNode = audioCtx.createGain();
gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

// Apply connections
osc.connect(gainNode).connect(audioCtx.destination);
