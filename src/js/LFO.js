'use strict';

class LFO {

  audioCtx = null;
  modulationGain = null;
  osc = null;

  constructor(audioContext) {
    if (!audioContext) throw Error('No AudioContext provided to LFO constructor.');
    this.audioCtx = audioContext;

    this.osc = this.audioCtx.createOscillator();
    this.modulationGain = this.audioCtx.createGain();

    this.osc.connect(this.modulationGain);

    this.osc.start();
  }

  connect(modulationTarget) {
    this.modulationGain.connect(modulationTarget);
  }

  setAmount(gain) {
    this.modulationGain.gain.setValueAtTime(gain, this.audioCtx.currentTime);
  }

  setFrequency(frequency) {
    this.osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
  }

}
