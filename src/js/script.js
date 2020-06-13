'use strict';

// Listen to input from specific device
function listenToDevice(device) {
  device.addEventListener('midimessage', e => {
    const [command, key, velocity] = e.data;
    console.log(`${command}, ${key}, ${velocity}`);
    osc.frequency.setValueAtTime(Math.pow(2, (key - 69) / 12) * 440, audioCtx.currentTime);
  });
}

// Load MIDI devices
window.navigator.requestMIDIAccess()
  .then(access => {
    const devices = Array.from(access.inputs.values());
    console.log(devices);
    listenToDevice(devices[0]);
  });

// Initialize AudioContect
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Initialize oscillator
let osc = audioCtx.createOscillator();
osc.type = 'sine';
osc.frequency.setValueAtTime(440, audioCtx.currentTime);
osc.start();

// UI controls
function startOsc() {
  osc.connect(audioCtx.destination);
}

function stopOsc() {
  osc.disconnect(audioCtx.destination);
}
