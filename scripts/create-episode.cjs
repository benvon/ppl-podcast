#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { TRACKS, releaseIdentity } = require("./release-identity.cjs");

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) throw new Error(`Unexpected argument: ${key}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${key}`);
    values[key.slice(2)] = value;
    index += 1;
  }
  for (const key of ["id", "slug", "title", "track"]) if (!values[key]) throw new Error(`--${key} is required.`);
  if (!SAFE_SLUG.test(values.slug)) throw new Error("--slug must be lowercase kebab-case.");
  if (!TRACKS[values.track]) throw new Error("--track must be core, supplemental, or rough-spots.");
  try { releaseIdentity({ track: values.track, id: values.id, version: "0.1.0" }); }
  catch (error) { throw new Error(`Invalid --id for ${values.track}: ${error.message}`); }
  return values;
}

function main() {
  const values = parseArgs(process.argv.slice(2));
  const root = path.resolve(__dirname, "..");
  const source = path.join(root, "templates");
  const destination = path.join(root, "episodes", `${values.id}-${values.slug}`);
  if (fs.existsSync(destination)) throw new Error(`Episode directory already exists: ${destination}`);
  fs.mkdirSync(destination, { recursive: true });
  const substitutions = { "{{EPISODE_ID}}": values.id, "{{SLUG}}": values.slug, "{{TITLE}}": values.title, "{{TRACK}}": values.track };
  for (const name of fs.readdirSync(source)) {
    if (name === "README.md") continue;
    const input = fs.readFileSync(path.join(source, name), "utf8");
    let output = input;
    for (const [needle, value] of Object.entries(substitutions)) output = output.split(needle).join(value);
    fs.writeFileSync(path.join(destination, name), output, { mode: 0o644 });
  }
  console.log(`Created ${path.relative(root, destination)}`);
}

try { main(); } catch (error) { console.error(`Episode scaffold failed: ${error.message}`); process.exitCode = 1; }
