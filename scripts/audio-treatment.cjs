"use strict";

// Treatment definitions are declarative so the renderer can record exactly
// which local post-processing produced a candidate without treating a voice
// effect as a second synthetic speaker or an OpenAI request.
const CLEAN_TREATMENT = Object.freeze({
  id: "clean",
  version: 1,
  filter: null,
});

const VHF_AM_TREATMENT = Object.freeze({
  id: "vhf-am",
  version: 3,
  // A restrained communications-radio approximation: narrower bandwidth,
  // modest compression, and a light bit-reduction blend add radio texture
  // without background hiss or enough distortion to obscure a study call.
  filter: "highpass=f=400,lowpass=f=2600,acompressor=threshold=-20dB:ratio=3:attack=10:release=120:makeup=2,acrusher=bits=10:mix=0.264:mode=lin:aa=0,alimiter=limit=0.86:level=disabled",
});

const AUDIO_TREATMENTS = Object.freeze({
  clean: CLEAN_TREATMENT,
  "vhf-am": VHF_AM_TREATMENT,
});

function audioTreatment(id = "clean") {
  const treatment = AUDIO_TREATMENTS[id];
  if (!treatment) throw new Error(`Unsupported audio treatment: ${id}`);
  return treatment;
}

function treatmentForSpeakerLabel(label) {
  if (label === undefined || label === null) return "clean";
  if (label === "RADIO") return "vhf-am";
  throw new Error(`Unsupported speaker treatment label: ${label}`);
}

function audioTreatmentManifestRecord(id) {
  const treatment = audioTreatment(id);
  return { id: treatment.id, version: treatment.version, filter: treatment.filter };
}

module.exports = { AUDIO_TREATMENTS, audioTreatment, audioTreatmentManifestRecord, treatmentForSpeakerLabel };
