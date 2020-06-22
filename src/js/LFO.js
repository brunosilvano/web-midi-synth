'use strict';

class LFO {
  audioCtx = null;
  modulationGain = null;
  osc = null;

  constructor(audioContext) {
    if (!audioContext) throw Error('Not AudioContext provided to LFO constructor.');
    this.audioCtx = audioContext;

    this.osc = this.audioCtx.createOscillator();
    this.modulationGain = this.audioCtx.createGain();
    this.modulationGain.gain.value = 100; // TODO: move to variable value that can be set by a method

    this.osc.connect(this.modulationGain);

    this.osc.start();
  }

  connect(modulationTarget) {
    this.modulationGain.connect(modulationTarget);
  }
}
