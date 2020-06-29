'use strict';

class AD {

  audioCtx = null;
  envelope = null;
  attackTime = 0.1;
  decayTime = 0.1;

  constructor(audioContext) {
    if (!audioContext) throw Error('No AudioContext provided to AD constructor.');
    this.audioCtx = audioContext;

    this.envelope = this.audioCtx.createGain();
    this.envelope.gain.setValueAtTime(0, this.audioCtx.currentTime);
  }

  connect(modulationTarget) {
    return this.envelope.connect(modulationTarget);
  }

  triggerOn() {
    const triggerStartTime = this.audioCtx.currentTime;
    this.envelope.gain.cancelScheduledValues(triggerStartTime);
    this.envelope.gain.setValueAtTime(this.envelope.gain.value, triggerStartTime);
    this.envelope.gain.linearRampToValueAtTime(1.0, triggerStartTime + this.attackTime);
    this.envelope.gain.linearRampToValueAtTime(0, triggerStartTime + this.attackTime + this.decayTime);
  }

  getInput() {
    return this.envelope;
  }

  setAttackTime(time) {
    this.attackTime = time;
  }

  setDecayTime(time) {
    this.decayTime = time;
  }

}
