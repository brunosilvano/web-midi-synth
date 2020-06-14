'use strict';

class Synth {

  inputMIDIDevice = null;
  outputMIDIDevice = null;

  audioCtx = null;
  gainNode = null;
  osc = null;

  _initializeAudioContext() {
    if (this.audioCtx) return;  // avoid initialization from running again

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this._initializeOsc();
  }

  _initializeConnections() {
    // Apply connections between audio nodes
    this.osc.connect(this.gainNode).connect(this.audioCtx.destination);
  }

  _initializeOsc() {
    if (!this.audioCtx) throw Error("AudioContext not initialized.");

    this.osc = this.audioCtx.createOscillator();
    this.osc.start();

    // Initalize Gain Node to control volume
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);

    this._initializeConnections();
  }

  _listenToDevice(device) {
    this.inputMIDIDevice.addEventListener('midimessage', ev => {

      const [command, key, velocity] = ev.data; // parse MIDI event

      if (command === 144) {  // Note On, Ch. 1
        this.osc.frequency.setValueAtTime(Math.pow(2, (key - 69) / 12) * 440, this.audioCtx.currentTime); // convert MIDI key number to frequency
        this.gainNode.gain.setValueAtTime(velocity / 127, this.audioCtx.currentTime); // set volume on key press
      }

      // Loop back input data, to light up the MIDI controller keys
      if (this.outputMIDIDevice) this.outputMIDIDevice.send([command, key, velocity]);
    });
  }

  setInputMIDIDevice(device) {
    this.inputMIDIDevice = device;
    this._initializeAudioContext();
    this._listenToDevice(this.inputMIDIDevice);
  }

  setOutputMIDIDevice(device) {
    this.outputMIDIDevice = device;
    this._initializeAudioContext();
  }

}
