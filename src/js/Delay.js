'use strict';

class Delay {

  audioCtx = null;
  delay = null;
  feedback = null;

  constructor(audioContext) {
    if (!audioContext) throw Error('No AudioContext provided to Delay constructor.');
    this.audioCtx = audioContext;

    this.delay = this.audioCtx.createDelay();
    this.delay.delayTime.setValueAtTime(0.5, this.audioCtx.currentTime);
    this.feedback = this.audioCtx.createGain();
    this.feedback.gain.setValueAtTime(0.8, this.audioCtx.currentTime);

    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
  }

  connect(delayTarget) {
    return this.delay.connect(delayTarget);
  }

  setFeedback(gain) {
    this.feedback.gain.setValueAtTime(gain, this.audioCtx.currentTime);
  }

  setTime(time) {
    this.delay.delayTime.setValueAtTime(time, this.audioCtx.currentTime);
  }

  getDelay() {
    return this.delay;
  }

}
