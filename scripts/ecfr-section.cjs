"use strict";

// eCFR has a public HTML reader, but source validation deliberately uses only
// the versioner XML API.  Keeping this parser separate makes that boundary
// explicit and keeps HTML/whole-part fallbacks from slipping into validation.
const { URL } = require("node:url");

function fail(message) { throw new Error(`eCFR section validation failed: ${message}`); }

function exactEcfrTarget(source) {
  const citation = new URL(source.url);
  if (citation.hostname.toLowerCase().replace(/^www\./, "") !== "ecfr.gov") fail("citation must remain on ecfr.gov");
  const match = citation.pathname.match(/^\/current\/title-(\d+)\/(?:[^/]+\/)*part-(\d+)\/(?:[^/]+\/)*section-(\d+(?:\.\d+)?)\/?$/i);
  if (!match || citation.search || citation.hash) fail("citation URL must identify one current title, part, and section without parameters");
  const [, title, part, section] = match;
  let date;
  if (source.validation_url) {
    const legacy = new URL(source.validation_url);
    if (legacy.hostname.toLowerCase().replace(/^www\./, "") !== "ecfr.gov") fail("validation_url must remain on ecfr.gov");
    const legacyMatch = legacy.pathname.match(/^\/api\/versioner\/v1\/full\/(\d{4}-\d{2}-\d{2})\/title-(\d+)\.xml$/i);
    if (!legacyMatch) fail("validation_url must use the official versioner title XML endpoint");
    const allowed = new Set(["part", "section"]);
    for (const key of legacy.searchParams.keys()) if (!allowed.has(key)) fail(`validation_url contains unsupported query parameter ${key}`);
    if (legacyMatch[2] !== title || legacy.searchParams.get("part") !== part) fail("validation_url title or part does not match cited eCFR section");
    if (legacy.searchParams.has("section") && legacy.searchParams.get("section") !== section) fail("validation_url section does not match cited eCFR section");
    date = legacyMatch[1];
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(source.ecfr_date || "")) {
    date = source.ecfr_date;
  } else {
    fail("an eCFR validation_url or ecfr_date is required to pin the effective date");
  }
  // Date parsing avoids accepting syntactically plausible but impossible API
  // targets (the endpoint's date is part of the evidence identity).
  if (Number.isNaN(Date.parse(`${date}T00:00:00Z`))) fail("validation date is invalid");
  const endpoint = new URL(`https://www.ecfr.gov/api/versioner/v1/full/${date}/title-${title}.xml`);
  endpoint.searchParams.set("part", part); endpoint.searchParams.set("section", section);
  return { title, part, section, date, validation_url: endpoint.toString() };
}

function decodeXml(value) {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&(?:amp|lt|gt|quot|apos);/g, (entity) => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": "\"", "&apos;": "'" }[entity])).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizedSection(value) { return String(value || "").replace(/[§\s]/g, "").replace(/^section/i, "").trim(); }

function extractEcfrSection(xml, target) {
  if (typeof xml !== "string" || !xml.trim()) fail("XML body is empty");
  const sections = [];
  const blocks = xml.matchAll(/<SECTION\b[^>]*>([\s\S]*?)<\/SECTION>/gi);
  for (const block of blocks) {
    const raw = block[0];
    const number = raw.match(/<(?:SECTNO|SECTIONNO)\b[^>]*>([\s\S]*?)<\/(?:SECTNO|SECTIONNO)>/i)?.[1] || raw.match(/\bN\s*=\s*["']([^"']+)["']/i)?.[1];
    if (normalizedSection(number) === target.section) sections.push({ raw, number: decodeXml(number || "") });
  }
  if (sections.length !== 1) fail(sections.length ? `ambiguous requested section ${target.section}` : `requested section ${target.section} is missing`);
  const text = decodeXml(sections[0].raw);
  if (!text) fail("requested section has no extractable text");
  return { text, identity: { title: target.title, part: target.part, section: target.section, date: target.date, section_number: sections[0].number } };
}

module.exports = { exactEcfrTarget, extractEcfrSection };
