"use strict";

const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*))*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const TRACKS = Object.freeze({
  core: { idPrefix: "core", releasePrefix: "episode", digitWidth: 2 },
  supplemental: { idPrefix: "supplement", releasePrefix: "supplement", digitWidth: 2 },
  "rough-spots": { idPrefix: "rough", releasePrefix: "rough-spot", digitWidth: 3 },
});

function releaseIdentity({ track, id, version }) {
  const definition = TRACKS[track];
  if (!definition) throw new Error(`unsupported release track: ${track}`);
  const match = new RegExp(`^${definition.idPrefix}-(\\d{${definition.digitWidth}})$`).exec(id || "");
  if (!match) throw new Error(`episode id ${id} does not match the ${track} track`);
  if (typeof version !== "string" || !SEMVER_PATTERN.test(version)) throw new Error(`episode version must be semantic versioning: ${version}`);
  const releaseKey = `${definition.releasePrefix}-${match[1]}`;
  return { releaseKey, contentVersion: version, tag: `${releaseKey}/v${version}`, recordAsset: `${releaseKey}-v${version}.json` };
}

module.exports = { SEMVER_PATTERN, TRACKS, releaseIdentity };
