'use strict';

const synth = new Synth();

window.onload = () => {

  const inputMIDISelect = document.getElementById('inputMIDISelect');
  const outputMIDISelect = document.getElementById('outputMIDISelect');

  let inputMIDIDevices = [];
  let outputMIDIDevices = [];

  // Load MIDI devices
  window.navigator.requestMIDIAccess()
    .then(midiAccess => {

      inputMIDIDevices = Array.from(midiAccess.inputs.values());
      outputMIDIDevices = Array.from(midiAccess.outputs.values());

      // Populate input select element
      for (let inputDevice of inputMIDIDevices) {
        let option = document.createElement('option');
        option.value = inputDevice.id;
        option.innerText = inputDevice.name;
        inputMIDISelect.appendChild(option);
      }

      // Populate output select element
      for (let outputDevice of outputMIDIDevices) {
        let option = document.createElement('option');
        option.value = outputDevice.id;
        option.innerText = outputDevice.name;
        outputMIDISelect.appendChild(option);
      }
    })
    .catch(err => console.error(`Unable to get MIDI devices: ${err}`));

  // Update synth MIDI devices
  inputMIDISelect.addEventListener('change', ev => {
    const id = ev.target.value;
    synth.setInputMIDIDevice(inputMIDIDevices.filter(device => device.id === id)[0]);
  });

  outputMIDISelect.addEventListener('change', ev => {
    const id = ev.target.value;
    synth.setOutputMIDIDevice(outputMIDIDevices.filter(device => device.id === id)[0]);
  });

}
