#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const net = require("net");
const path = require("path");
const YAML = require("yaml");

const DEFAULT_MODEL = "gpt-5.6-terra";
const MAX_REDIRECTS = 5;
const MAX_BYTES = 1_000_000;
const FETCH_TIMEOUT_MS = 20_000;
const RELEVANCE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["verdict", "confidence", "rationale", "locator_assessment", "claim_assessments"],
  properties: {
    verdict: { type: "string", enum: ["supports", "partially_supports", "does_not_support", "insufficient_evidence"] },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    rationale: { type: "string" },
    locator_assessment: {
      type: "object",
      additionalProperties: false,
      required: ["verdict", "rationale"],
      properties: {
        verdict: { type: "string", enum: ["supports", "partially_supports", "does_not_support", "insufficient_evidence"] },
        rationale: { type: "string" },
      },
    },
    claim_assessments: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["claim_id", "verdict", "rationale"],
        properties: {
          claim_id: { type: "string" },
          verdict: { type: "string", enum: ["supports", "partially_supports", "does_not_support", "insufficient_evidence"] },
          rationale: { type: "string" },
        },
      },
    },
  },
};

function parseArgs(argv) {
  const options = { llm: false, requireLlm: false, dryRun: false, model: DEFAULT_MODEL };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--llm") { options.llm = true; continue; }
    if (argument === "--require-llm") { options.llm = true; options.requireLlm = true; continue; }
    if (argument === "--dry-run") { options.dryRun = true; continue; }
    if (!argument.startsWith("--")) throw new Error(`Unexpected argument: ${argument}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}`);
    options[argument.slice(2)] = value;
    index += 1;
  }
  if (!options.sources || !options.claims) throw new Error("--sources and --claims are required.");
  if (!/^[a-z0-9][a-z0-9.-]*$/.test(options.model)) throw new Error("--model contains unsupported characters.");
  return options;
}

function loadYaml(file, expectedKey) {
  const document = YAML.parseDocument(fs.readFileSync(file, "utf8"));
  if (document.errors.length) throw new Error(`Invalid YAML in ${file}: ${document.errors[0].message}`);
  const value = document.toJS();
  if (!value || !Array.isArray(value[expectedKey])) throw new Error(`${file} must contain a ${expectedKey} array.`);
  return value;
}

function assertSafeUrl(value) {
  let url;
  try { url = new URL(value); } catch (_) { throw new Error("invalid URL"); }
  if (url.protocol !== "https:") throw new Error("only HTTPS URLs are permitted");
  if (url.username || url.password || url.port) throw new Error("credential-bearing URLs and explicit ports are not permitted");
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) throw new Error("local hosts are not permitted");
  if (net.isIP(hostname)) throw new Error("IP-address URLs are not permitted");
  return url;
}

function canonicalHostname(url) {
  return url.hostname.toLowerCase().replace(/^www\./, "");
}

function citationTargetErrors(source) {
  const errors = [];
  const locator = typeof source.locator === "string" ? source.locator.trim() : "";
  if (!locator || /^(chapter|ch\.?|section|sec\.?|task|part|page)\s*\d*\.?\s*$/i.test(locator)) {
    errors.push("locator must identify a specific section, task, paragraph, or page; a document or chapter title alone is insufficient");
  }

  let url;
  try { url = assertSafeUrl(source.url); } catch (error) { errors.push(error.message); return errors; }
  const host = url.hostname.toLowerCase();
  const pathName = url.pathname.toLowerCase();
  const isPdf = pathName.endsWith(".pdf");
  const isEcfr = host === "ecfr.gov" || host.endsWith(".ecfr.gov");
  const isFaa = host === "faa.gov" || host.endsWith(".faa.gov");
  const isSpecificFaaHtmlEndpoint = /\/(?:chap(?:ter)?\d+[_-]section[_-]\d+|section[_-]\d+|part[_-]\d+|appendix[_-][a-z0-9]+)\.html?$/i.test(pathName);

  if (isPdf) {
    if (!/^#page=[1-9]\d*(?:[&].*)?$/i.test(url.hash)) errors.push("PDF citations must include a #page=N fragment");
    if (!/\b(?:p(?:age)?\.?\s*\d+|pp\.\s*\d+)/i.test(locator)) errors.push("PDF citation locator must include the cited page number");
  } else if (isEcfr) {
    if (!/\/section-\d+(?:\.\d+)?\/?$/i.test(pathName)) errors.push("eCFR citations must use the exact /section-N.N URL");
  } else if (isFaa && !url.hash && !isSpecificFaaHtmlEndpoint) {
    errors.push("FAA HTML citations must include a specific section anchor or endpoint; use a PDF with #page=N when no stable FAA HTML section anchor exists");
  }
  if (isFaa && (pathName === "/" || /^\/(?:regulations_policies|training_testing|air_traffic)\/?$/i.test(pathName))) {
    errors.push("FAA landing pages are not valid material-claim citations");
  }
  return errors;
}

function validationTargetErrors(source) {
  if (!source.validation_url) return [];
  const errors = [];
  let citationUrl; let validationUrl;
  try { citationUrl = assertSafeUrl(source.url); validationUrl = assertSafeUrl(source.validation_url); }
  catch (error) { return [error.message]; }
  if (canonicalHostname(citationUrl) !== "ecfr.gov" || canonicalHostname(validationUrl) !== "ecfr.gov") {
    errors.push("validation_url is permitted only for an eCFR citation and must remain on ecfr.gov");
    return errors;
  }
  if (!/^\/api\/versioner\/v1\/full\/\d{4}-\d{2}-\d{2}\/title-\d+\.xml$/i.test(validationUrl.pathname) || !/^\d+$/.test(validationUrl.searchParams.get("part") || "")) {
    errors.push("eCFR validation_url must use the official versioner full-title XML endpoint with a numeric part query");
  }
  return errors;
}

async function readBoundedBody(response) {
  const contentLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BYTES) return { text: "", truncated: true };
  const reader = response.body && response.body.getReader();
  if (!reader) return { text: "", truncated: false };
  const chunks = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_BYTES) { await reader.cancel(); return { text: Buffer.concat(chunks).toString("utf8"), truncated: true }; }
    chunks.push(Buffer.from(value));
  }
  return { text: Buffer.concat(chunks).toString("utf8"), truncated: false };
}

function htmlToText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
}

function htmlTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? htmlToText(match[1]).slice(0, 300) : null;
}

async function fetchSource(sourceUrl, { fetchImpl = fetch, timeoutMs = FETCH_TIMEOUT_MS } = {}) {
  let current = assertSafeUrl(sourceUrl);
  const citedAuthorityHost = canonicalHostname(current);
  const redirects = [];
  for (let count = 0; count <= MAX_REDIRECTS; count += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(current, { redirect: "manual", signal: controller.signal, headers: { "User-Agent": "ppl-study-podcast-source-validator/1.0" } });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) throw new Error(`redirect status ${response.status} without Location header`);
        const next = new URL(location, current);
        assertSafeUrl(next.toString());
        if (canonicalHostname(next) !== citedAuthorityHost) {
          throw new Error(`redirect left the cited authority domain (${citedAuthorityHost} to ${canonicalHostname(next)})`);
        }
        redirects.push(next.toString()); current = next; continue;
      }
      const { text, truncated } = await readBoundedBody(response);
      const contentType = (response.headers.get("content-type") || "").split(";")[0].toLowerCase();
      const isHtml = contentType === "text/html" || contentType === "application/xhtml+xml";
      const isText = isHtml || contentType.startsWith("text/") || contentType === "application/json";
      return {
        requested_url: sourceUrl,
        final_url: current.toString(),
        status: response.status,
        content_type: contentType || null,
        redirects,
        title: isHtml ? htmlTitle(text) : null,
        excerpt: isText ? (isHtml ? htmlToText(text) : text.replace(/\s+/g, " ").trim()).slice(0, 12000) : null,
        truncated,
      };
    } finally { clearTimeout(timer); }
  }
  throw new Error(`redirect limit (${MAX_REDIRECTS}) exceeded`);
}

function responseText(response) {
  for (const item of response.output || []) for (const content of item.content || []) if (content.type === "output_text" && typeof content.text === "string") return content.text;
  throw new Error("Responses API returned no output text.");
}

async function assessRelevance({ model, source, claims, fetched }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required for --llm. Load it from your environment; do not place it in a command argument or repository file.");
  const excerpt = source.relevance_excerpt || fetched.excerpt;
  if (!excerpt) return { status: "not_assessed", reason: "The fetched resource has no safely extracted text. Add a concise relevance_excerpt to sources.yaml after reviewing the source." };
  const input = {
    source: { id: source.id, title: source.title, document_id: source.document_id || null, locator: source.locator || null, final_url: fetched.final_url, excerpt: excerpt.slice(0, 12000) },
    claims: claims.map((claim) => ({ id: claim.id, statement: claim.statement, type: claim.type })),
  };
  const body = {
    model,
    instructions: "You assess citation relevance for a private-pilot study resource. Use only the supplied source excerpt and claims. Do not infer missing facts. First assess whether the excerpt substantively matches the cited locator; a document-level match is not enough. Then, for every claim, decide whether the excerpt supports it, partially supports it, does not support it, or is insufficient evidence. This is an advisory relevance classification, not flight instruction or a factual source of authority.",
    input: JSON.stringify(input),
    text: { format: { type: "json_schema", name: "source_relevance", strict: true, schema: RELEVANCE_SCHEMA } },
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  let response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", { method: "POST", signal: controller.signal, headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } finally { clearTimeout(timer); }
  if (!response.ok) throw new Error(`Responses API returned HTTP ${response.status}.`);
  const parsed = JSON.parse(await response.text());
  const assessment = JSON.parse(responseText(parsed));
  return { status: "assessed", model, assessment, usage: parsed.usage || null };
}

function writeYaml(file, value) {
  fs.writeFileSync(file, YAML.stringify(value), "utf8");
}

function publicLinkRecord(link) {
  if (!link || !Object.hasOwn(link, "excerpt")) return link;
  const { excerpt, ...rest } = link;
  return {
    ...rest,
    excerpt_characters: excerpt ? excerpt.length : 0,
    excerpt_sha256: excerpt ? crypto.createHash("sha256").update(excerpt).digest("hex") : null,
  };
}

function validateClaimMappings(ledger, claimInventory) {
  const errors = [];
  const sourceIds = new Set();
  for (const source of ledger.sources) {
    if (!source.id) { errors.push("source ledger contains a source without an id"); continue; }
    if (sourceIds.has(source.id)) errors.push(`source ledger contains duplicate source id ${source.id}`);
    sourceIds.add(source.id);
  }
  const sourcesById = new Map(ledger.sources.map((source) => [source.id, source]));
  const claimIds = new Set();
  for (const claim of claimInventory.claims) {
    if (!claim.id) { errors.push("claim inventory contains a claim without an id"); continue; }
    if (claimIds.has(claim.id)) errors.push(`claim inventory contains duplicate claim id ${claim.id}`);
    claimIds.add(claim.id);
  }
  const claimsById = new Map(claimInventory.claims.map((claim) => [claim.id, claim]));
  for (const source of ledger.sources) {
    for (const claimId of source.supports_claims) {
      const claim = claimsById.get(claimId);
      if (!claim) errors.push(`source ${source.id} maps unknown claim ${claimId}`);
      else if (!Array.isArray(claim.sources) || !claim.sources.includes(source.id)) errors.push(`source ${source.id} supports claim ${claimId}, but that claim does not declare the source`);
    }
  }
  for (const claim of claimInventory.claims) {
    if (!claim.id) continue;
    if (!Array.isArray(claim.sources) || !claim.sources.length) {
      errors.push(`claim ${claim.id} has no declared sources`);
      continue;
    }
    for (const sourceId of claim.sources) {
      const source = sourcesById.get(sourceId);
      if (!source) errors.push(`claim ${claim.id} declares unknown source ${sourceId}`);
      else if (!source.supports_claims.includes(claim.id)) errors.push(`claim ${claim.id} declares source ${sourceId}, but that source does not support the claim`);
    }
    const supportingSources = ledger.sources.filter((source) => source.supports_claims.includes(claim.id));
    if (!supportingSources.length) errors.push(`claim ${claim.id} is not supported by any source ledger entry`);
  }
  return { valid: errors.length === 0, errors };
}

function validateClaimAssessments(relevance, expectedClaimIds) {
  if (!relevance || relevance.status !== "assessed") return { valid: false, reason: "LLM relevance was not assessed", missing_assessment_ids: expectedClaimIds, unexpected_assessment_ids: [], duplicate_assessment_ids: [], unsupported_assessment_ids: [] };
  const assessments = relevance.assessment.claim_assessments || [];
  const counts = new Map();
  for (const assessment of assessments) counts.set(assessment.claim_id, (counts.get(assessment.claim_id) || 0) + 1);
  const expected = new Set(expectedClaimIds);
  const missing = expectedClaimIds.filter((claimId) => !counts.has(claimId));
  const unexpected = assessments.map((assessment) => assessment.claim_id).filter((claimId) => !expected.has(claimId));
  const duplicate = [...counts].filter(([, count]) => count > 1).map(([claimId]) => claimId);
  const unsupported = assessments.filter((assessment) => expected.has(assessment.claim_id) && ["does_not_support", "insufficient_evidence"].includes(assessment.verdict)).map((assessment) => assessment.claim_id);
  return { valid: !missing.length && !unexpected.length && !duplicate.length && !unsupported.length, missing_assessment_ids: missing, unexpected_assessment_ids: unexpected, duplicate_assessment_ids: duplicate, unsupported_assessment_ids: unsupported };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const sourcesPath = path.resolve(options.sources); const claimsPath = path.resolve(options.claims);
  const outputPath = path.resolve(options.output || path.join(path.dirname(sourcesPath), "link-validation.yaml"));
  const ledger = loadYaml(sourcesPath, "sources"); const claimInventory = loadYaml(claimsPath, "claims");
  const claimsById = new Map(claimInventory.claims.map((claim) => [claim.id, claim]));
  const invalid = ledger.sources.filter((source) => !source.id || !source.url || !Array.isArray(source.supports_claims));
  if (invalid.length) throw new Error("Each source must have id, url, and supports_claims.");
  const claimMapping = validateClaimMappings(ledger, claimInventory);
  if (!claimMapping.valid) {
    for (const error of claimMapping.errors) console.error(`Claim mapping failed: ${error}`);
    const report = { schema_version: 1, validator: "scripts/validate-source-links.cjs", checked_at_utc: new Date().toISOString(), sources_file: path.relative(process.cwd(), sourcesPath), claims_file: path.relative(process.cwd(), claimsPath), llm_requested: options.llm, llm_model: options.llm ? options.model : null, claim_mapping: claimMapping, results: [] };
    writeYaml(outputPath, report);
    console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
    process.exitCode = 1;
    return;
  }
  if (options.dryRun) {
    console.log(`Validated input shape and claim mappings for ${ledger.sources.length} sources and ${claimInventory.claims.length} claims; no network or API requests made.`);
    return;
  }
  const results = [];
  for (const source of ledger.sources) {
    const linkedClaims = source.supports_claims.map((id) => claimsById.get(id)).filter(Boolean);
    const missingClaims = source.supports_claims.filter((id) => !claimsById.has(id));
    const entry = { source_id: source.id, title: source.title, checked_at_utc: new Date().toISOString(), linked_claim_ids: source.supports_claims, missing_claim_ids: missingClaims, citation_target: { valid: true, errors: [] } };
    try {
      entry.citation_target.errors = [...citationTargetErrors(source), ...validationTargetErrors(source)];
      entry.citation_target.valid = entry.citation_target.errors.length === 0;
      if (!entry.citation_target.valid) throw new Error(`Deep-citation validation failed: ${entry.citation_target.errors.join("; ")}`);
      entry.link = await fetchSource(source.validation_url || source.url);
      entry.link.citation_url = source.url;
      entry.link.validation_url = source.validation_url || source.url;
      entry.link.valid = entry.link.status >= 200 && entry.link.status < 400;
    } catch (error) { entry.link = { valid: false, error: error.message }; }
    results.push(entry);
  }
  const deterministicValid = results.every((entry) => entry.citation_target.valid && entry.link.valid && !entry.missing_claim_ids.length);
  for (let index = 0; index < results.length; index += 1) {
    const source = ledger.sources[index]; const entry = results[index];
    const linkedClaims = source.supports_claims.map((id) => claimsById.get(id)).filter(Boolean);
    if (!options.llm) {
      entry.relevance = { status: "not_requested" };
      entry.claim_assessments = { valid: null, status: "not_requested" };
    } else if (!deterministicValid) {
      entry.relevance = { status: "not_assessed", reason: "LLM relevance was not requested because deterministic source validation failed." };
      entry.claim_assessments = validateClaimAssessments(entry.relevance, linkedClaims.map((claim) => claim.id));
    } else if (!linkedClaims.length) {
      entry.relevance = { status: "not_assessed", reason: "No mapped claims for this source." };
      entry.claim_assessments = validateClaimAssessments(entry.relevance, []);
    } else {
      try { entry.relevance = await assessRelevance({ model: options.model, source, claims: linkedClaims, fetched: entry.link }); }
      catch (error) { entry.relevance = { status: "not_assessed", reason: `LLM relevance failed: ${error.message}` }; }
      entry.claim_assessments = validateClaimAssessments(entry.relevance, linkedClaims.map((claim) => claim.id));
    }
    console.log(`${source.id}: ${entry.link.valid ? "link OK" : "link FAILED"}${entry.relevance.status === "assessed" ? `; relevance ${entry.relevance.assessment.verdict}` : ""}`);
  }
  const reportResults = results.map((result) => ({ ...result, link: publicLinkRecord(result.link) }));
  const report = { schema_version: 1, validator: "scripts/validate-source-links.cjs", checked_at_utc: new Date().toISOString(), sources_file: path.relative(process.cwd(), sourcesPath), claims_file: path.relative(process.cwd(), claimsPath), llm_requested: options.llm, llm_model: options.llm ? options.model : null, claim_mapping: claimMapping, results: reportResults };
  writeYaml(outputPath, report);
  const unresolved = !claimMapping.valid || results.some((entry) => !entry.citation_target.valid || !entry.link.valid || entry.missing_claim_ids.length || (options.requireLlm && entry.relevance.status !== "assessed") || (options.requireLlm && entry.relevance.status === "assessed" && ["does_not_support", "insufficient_evidence"].includes(entry.relevance.assessment.verdict)) || (options.requireLlm && entry.relevance.status === "assessed" && ["does_not_support", "insufficient_evidence"].includes(entry.relevance.assessment.locator_assessment.verdict)) || (options.requireLlm && !entry.claim_assessments.valid));
  console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
  if (unresolved) process.exitCode = 1;
}

if (require.main === module) main().catch((error) => { console.error(`Source validation failed: ${error.message}`); process.exitCode = 1; });

module.exports = { fetchSource, validateClaimMappings, validateClaimAssessments, validationTargetErrors };
