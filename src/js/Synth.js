'use strict';

class Synth {

  inputMIDIDevice = null;
  outputMIDIDevice = null;

  audioCtx = null;
  gainNode = null;
  osc = null;
  lfo = null;
  modulationGain = null;
  delay = null;

  pressedNotes = [];

  _initializeAudioContext() {
    if (this.audioCtx) return;  // avoid initialization from running again

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this._initializeOsc();
  }

  _initializeConnections() {
    this.delay = new Delay(this.audioCtx);

    // Apply connections between audio nodes
    this.lfo.connect(this.osc.frequency);
    this.osc.connect(this.gainNode).connect(this.audioCtx.destination);

    this.osc.connect(this.gainNode).connect(this.delay.getDelay());
    this.delay.connect(this.audioCtx.destination);

    // Start oscillators
    this.osc.start();
  }

  _initializeOsc() {
    if (!this.audioCtx) throw Error("AudioContext not initialized.");

    this.osc = this.audioCtx.createOscillator();

    // Initalize Gain Node to control volume
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);

    // LFO
    this.lfo = new LFO(this.audioCtx);

    this._initializeConnections();
  }

  _listenToDevice(device) {
    this.inputMIDIDevice.addEventListener('midimessage', ev => {

      const [command, key, velocity] = ev.data; // parse MIDI event

      if (command === 144) {  // Note On, Ch. 1
        const indexOfNote = this.pressedNotes.indexOf(key);  // check if new note already in pressedNotes

        // Add note if Note On, remove note if Note Off
        if (velocity === 0) {
          if (indexOfNote !== -1) this.pressedNotes.splice(indexOfNote, 1);
        } else {
          if (indexOfNote === -1) this.pressedNotes.push(key);
        }

        // If there is any note pressed, sound the last pressed one; Mute otherwise
        if (this.pressedNotes.length) {
          const note = this.pressedNotes[this.pressedNotes.length - 1];
          this.osc.frequency.setValueAtTime(Math.pow(2, (note - 69) / 12) * 440, this.audioCtx.currentTime); // convert MIDI key number to frequency
          this.gainNode.gain.setTargetAtTime(0.5, this.audioCtx.currentTime, 0.001); // set volume on key press
        } else {
          this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.001); // set volume on key press
        }
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
