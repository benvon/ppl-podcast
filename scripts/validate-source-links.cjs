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
const MAX_HASH_BYTES = 32_000_000;
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

function fileSha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function validationInputHashes({ sourcesPath, claimsPath, showNotesPath, showNotesManifestPath, showNotesFilePresent, showNotesValidationConfigured }) {
  return {
    sources: fileSha256(sourcesPath),
    claims: fileSha256(claimsPath),
    show_notes: showNotesFilePresent ? fileSha256(showNotesPath) : null,
    show_notes_manifest: showNotesValidationConfigured ? fileSha256(showNotesManifestPath) : null,
  };
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
  const errors = [];
  if (source.validation_url) {
    let citationUrl; let validationUrl;
    try { citationUrl = assertSafeUrl(source.url); validationUrl = assertSafeUrl(source.validation_url); }
    catch (error) { return [error.message]; }
    if (canonicalHostname(citationUrl) !== "ecfr.gov" || canonicalHostname(validationUrl) !== "ecfr.gov") {
      errors.push("validation_url is permitted only for an eCFR citation and must remain on ecfr.gov");
    } else if (!/^\/api\/versioner\/v1\/full\/\d{4}-\d{2}-\d{2}\/title-\d+\.xml$/i.test(validationUrl.pathname) || !/^\d+$/.test(validationUrl.searchParams.get("part") || "")) {
      errors.push("eCFR validation_url must use the official versioner full-title XML endpoint with a numeric part query");
    }
  }
  if (source.programmatic_url || source.programmatic_attestation) {
    if (!source.programmatic_url || !source.programmatic_attestation || typeof source.programmatic_attestation !== "object") {
      errors.push("programmatic_url requires a programmatic_attestation record");
      return errors;
    }
    const { url: attestationUrl, link_text: linkText, sha256 } = source.programmatic_attestation;
    let citationUrl; let programmaticUrl; let attestation;
    try {
      citationUrl = assertSafeUrl(source.url);
      programmaticUrl = assertSafeUrl(source.programmatic_url);
      attestation = assertSafeUrl(attestationUrl);
    } catch (error) { errors.push(error.message); return errors; }
    const isFaa = (url) => canonicalHostname(url) === "faa.gov" || canonicalHostname(url).endsWith(".faa.gov");
    if (!isFaa(citationUrl) || !isFaa(programmaticUrl) || !isFaa(attestation)) errors.push("programmatic FAA fallbacks must use FAA-hosted citation, copy, and attestation URLs");
    if (sameUrlIgnoringFragment(citationUrl, programmaticUrl)) errors.push("programmatic_url must be a distinct alternate endpoint");
    if (typeof linkText !== "string" || !linkText.trim()) errors.push("programmatic_attestation.link_text must identify the FAA page link to the programmatic copy");
    if (typeof sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(sha256)) errors.push("programmatic_attestation.sha256 must be a SHA-256 hexadecimal digest");
  }
  return errors;
}

function sameUrlIgnoringFragment(left, right) {
  const normalized = (url) => {
    const copy = new URL(url);
    copy.hash = "";
    return copy.toString();
  };
  return normalized(left) === normalized(right);
}

async function readBoundedBody(response, { includeContentHash = false, includeBytes = false } = {}) {
  const contentLength = Number(response.headers.get("content-length"));
  const readLimit = includeContentHash || includeBytes ? MAX_HASH_BYTES : MAX_BYTES;
  if (Number.isFinite(contentLength) && contentLength > readLimit) return { text: "", body: null, truncated: true, content_sha256: null, hash_truncated: includeContentHash };
  if (!includeContentHash && !includeBytes && Number.isFinite(contentLength) && contentLength > MAX_BYTES) return { text: "", body: null, truncated: true, content_sha256: null, hash_truncated: false };
  const reader = response.body && response.body.getReader();
  if (!reader) return { text: "", body: null, truncated: false, content_sha256: null, hash_truncated: false };
  const textChunks = []; const bodyChunks = []; let total = 0; let textTruncated = false;
  const hash = includeContentHash ? crypto.createHash("sha256") : null;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > readLimit) {
      await reader.cancel();
      return { text: Buffer.concat(textChunks).toString("utf8"), body: null, truncated: true, content_sha256: null, hash_truncated: includeContentHash };
    }
    if (hash) hash.update(value);
    if (includeBytes) bodyChunks.push(Buffer.from(value));
    if (total <= MAX_BYTES) textChunks.push(Buffer.from(value));
    else textTruncated = true;
  }
  return { text: Buffer.concat(textChunks).toString("utf8"), body: includeBytes ? Buffer.concat(bodyChunks) : null, truncated: textTruncated, content_sha256: hash ? hash.digest("hex") : null, hash_truncated: false };
}

function htmlToText(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
}

function htmlTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? htmlToText(match[1]).slice(0, 300) : null;
}

function htmlLinks(html, baseUrl) {
  const links = [];
  const matches = html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of matches) {
    try { links.push({ url: new URL(match[2], baseUrl).toString(), text: htmlToText(match[3]) }); }
    catch (_) { /* Ignore malformed links in an otherwise valid FAA landing page. */ }
  }
  return links;
}

function linkResponseErrors(sourceUrl, link) {
  const errors = [];
  if (!(link.status >= 200 && link.status < 400)) errors.push(`HTTP ${link.status}`);
  const sourcePath = new URL(sourceUrl).pathname.toLowerCase();
  if (sourcePath.endsWith(".pdf") && link.content_type !== "application/pdf") errors.push(`expected application/pdf, received ${link.content_type || "no content type"}`);
  if (link.content_type === "text/html" && /(?:pardon our interruption|access denied|unusual traffic|verify you are human|captcha|security check)/i.test(`${link.title || ""} ${link.excerpt || ""}`)) errors.push("received an access interstitial instead of the cited resource");
  return errors;
}

async function fetchSource(sourceUrl, { fetchImpl = fetch, timeoutMs = FETCH_TIMEOUT_MS, includeContentHash = false, includeLinks = false, includePdfBytes = false } = {}) {
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
      const { text, body, truncated, content_sha256, hash_truncated } = await readBoundedBody(response, { includeContentHash, includeBytes: includePdfBytes });
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
        content_sha256,
        hash_truncated,
        links: includeLinks && isHtml ? htmlLinks(text, current) : undefined,
        pdf_bytes: includePdfBytes && contentType === "application/pdf" ? body : null,
      };
    } finally { clearTimeout(timer); }
  }
  throw new Error(`redirect limit (${MAX_REDIRECTS}) exceeded`);
}

function citedPdfPageNumber(citationUrl) {
  const url = assertSafeUrl(citationUrl);
  if (!url.pathname.toLowerCase().endsWith(".pdf")) return null;
  const match = url.hash.match(/^#page=([1-9]\d*)/i);
  return match ? Number(match[1]) : null;
}

let pdfjsModule;

async function loadPdfjs() {
  if (!pdfjsModule) pdfjsModule = import("pdfjs-dist/legacy/build/pdf.mjs");
  return pdfjsModule;
}

async function extractPdfPageText(bytes, pageNumber, { pdfjsLoader = loadPdfjs } = {}) {
  if (!Buffer.isBuffer(bytes) || !bytes.length) throw new Error("no PDF bytes were available for page extraction");
  if (!Number.isInteger(pageNumber) || pageNumber < 1) throw new Error("PDF page number must be a positive integer");
  const pdfjs = await pdfjsLoader();
  const standardFontDataUrl = `${path.resolve(path.dirname(require.resolve("pdfjs-dist/legacy/build/pdf.mjs")), "../../standard_fonts")}${path.sep}`;
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(bytes), disableWorker: true, standardFontDataUrl });
  try {
    const document = await loadingTask.promise;
    if (pageNumber > document.numPages) throw new Error(`PDF has ${document.numPages} pages; cited page ${pageNumber} is unavailable`);
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ").replace(/\s+/g, " ").trim();
    if (!text) throw new Error(`cited PDF page ${pageNumber} has no extractable text`);
    return text;
  } finally {
    if (typeof loadingTask.destroy === "function") await loadingTask.destroy();
  }
}

async function attachCitedPdfPageText(link, citationUrl, { pdfjsLoader } = {}) {
  const pageNumber = citedPdfPageNumber(citationUrl);
  if (!pageNumber || !link.valid) return link;
  try {
    return { ...link, pdf_page_number: pageNumber, pdf_page_text: await extractPdfPageText(link.pdf_bytes, pageNumber, { pdfjsLoader }) };
  } catch (error) {
    return { ...link, valid: false, errors: [...(link.errors || []), `PDF page extraction failed: ${error.message}`] };
  }
}

function fetchCacheKey(sourceUrl, options) {
  const url = new URL(sourceUrl);
  url.hash = "";
  return JSON.stringify([url.toString(), Boolean(options.includeContentHash), Boolean(options.includeLinks), Boolean(options.includePdfBytes)]);
}

async function fetchSourceCached(sourceUrl, options, fetchCache) {
  if (!fetchCache) return fetchSource(sourceUrl, options);
  const key = fetchCacheKey(sourceUrl, options);
  if (!fetchCache.has(key)) {
    const request = fetchSource(sourceUrl, options);
    fetchCache.set(key, request);
    try { await request; }
    catch (error) { fetchCache.delete(key); throw error; }
  }
  const cached = await fetchCache.get(key);
  const finalUrl = new URL(cached.final_url);
  finalUrl.hash = new URL(sourceUrl).hash;
  return { ...cached, requested_url: sourceUrl, final_url: finalUrl.toString() };
}

async function verifyProgrammaticFallback(source, { fetchImpl = fetch, timeoutMs = FETCH_TIMEOUT_MS, includePdfPageText = false, pdfjsLoader, fetchCache } = {}) {
  const citationPage = includePdfPageText ? citedPdfPageNumber(source.url) : null;
  const citation = await fetchSourceCached(source.validation_url || source.url, { fetchImpl, timeoutMs, includeContentHash: Boolean(source.programmatic_url), includePdfBytes: Boolean(citationPage) }, fetchCache);
  citation.citation_url = source.url;
  citation.validation_url = source.validation_url || source.url;
  citation.errors = linkResponseErrors(source.validation_url || source.url, citation);
  citation.valid = citation.errors.length === 0;
  if (!source.programmatic_url) {
    const link = await attachCitedPdfPageText(citation, source.url, { pdfjsLoader });
    return { link, citation_link: link, content_attestation: { valid: true, status: "not_configured" } };
  }

  const programmatic = await fetchSourceCached(source.programmatic_url, { fetchImpl, timeoutMs, includeContentHash: true, includePdfBytes: Boolean(citationPage) }, fetchCache);
  programmatic.errors = linkResponseErrors(source.programmatic_url, programmatic);
  programmatic.valid = programmatic.errors.length === 0;
  const attestationConfig = source.programmatic_attestation;
  const attestationLink = await fetchSourceCached(attestationConfig.url, { fetchImpl, timeoutMs, includeLinks: true }, fetchCache);
  attestationLink.errors = linkResponseErrors(attestationConfig.url, attestationLink);
  attestationLink.valid = attestationLink.errors.length === 0;
  const expectedLink = (attestationLink.links || []).some((link) => sameUrlIgnoringFragment(link.url, source.programmatic_url) && link.text === attestationConfig.link_text);
  const hashMatchesLedger = programmatic.content_sha256 === attestationConfig.sha256;
  const citationHashMatches = citation.valid ? citation.content_sha256 === programmatic.content_sha256 : null;
  const errors = [];
  if (!programmatic.valid) errors.push(...programmatic.errors);
  if (!attestationLink.valid) errors.push(...attestationLink.errors);
  if (!expectedLink) errors.push("FAA attestation page does not link to the configured programmatic copy with the expected link text");
  if (!hashMatchesLedger) errors.push("programmatic copy SHA-256 does not match the reviewed ledger digest");
  if (citationHashMatches === false) errors.push("citation and programmatic copies do not have matching SHA-256 digests");
  const contentAttestation = {
    valid: errors.length === 0,
    status: errors.length === 0 ? "attested" : "failed",
    attestation_url: attestationConfig.url,
    expected_link_text: attestationConfig.link_text,
    expected_sha256: attestationConfig.sha256,
    citation_sha256: citation.content_sha256,
    programmatic_sha256: programmatic.content_sha256,
    citation_hash_matches_programmatic: citationHashMatches,
    errors,
  };
  const fallbackAvailable = !citation.valid && programmatic.valid && contentAttestation.valid;
  const selected = fallbackAvailable ? { ...programmatic, citation_url: source.url, validation_url: source.programmatic_url, resolved_via: "attested_programmatic_fallback" } : citation;
  const link = await attachCitedPdfPageText(selected, source.url, { pdfjsLoader });
  return { link, citation_link: citation, programmatic_link: programmatic, attestation_link: attestationLink, content_attestation: contentAttestation };
}

function responseText(response) {
  for (const item of response.output || []) for (const content of item.content || []) if (content.type === "output_text" && typeof content.text === "string") return content.text;
  throw new Error("Responses API returned no output text.");
}

async function assessRelevance({ model, source, claims, fetched }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required for --llm. Load it from your environment; do not place it in a command argument or repository file.");
  const excerpt = fetched.pdf_page_text || source.relevance_excerpt || fetched.excerpt;
  if (!excerpt) return { status: "not_assessed", reason: "The fetched resource has no safely extracted text. Add a concise relevance_excerpt to sources.yaml after reviewing the source." };
  const input = {
    source: { id: source.id, title: source.title, document_id: source.document_id || null, locator: source.locator || null, final_url: fetched.final_url, cited_pdf_page: fetched.pdf_page_number || null, excerpt: excerpt.slice(0, 12000) },
    claims: claims.map((claim) => ({ id: claim.id, statement: claim.statement, type: claim.type })),
  };
  const body = {
    model,
    instructions: "You assess citation relevance for a private-pilot study resource. Use only the supplied source excerpt and claims. Do not infer missing facts. When cited_pdf_page is present, the excerpt was extracted from that exact PDF page; assess the locator and claims against that page only, not the document generally. Then, for every claim, decide whether the excerpt supports it, partially supports it, does not support it, or is insufficient evidence. This is an advisory relevance classification, not flight instruction or a factual source of authority.",
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
  const { excerpt, links, pdf_bytes, pdf_page_text, ...rest } = link;
  return {
    ...rest,
    excerpt_characters: excerpt ? excerpt.length : 0,
    excerpt_sha256: excerpt ? crypto.createHash("sha256").update(excerpt).digest("hex") : null,
    pdf_page_text_characters: pdf_page_text ? pdf_page_text.length : 0,
    pdf_page_text_sha256: pdf_page_text ? crypto.createHash("sha256").update(pdf_page_text).digest("hex") : null,
    discovered_link_count: links ? links.length : undefined,
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

function markdownHttpsLinks(markdown) {
  const links = []; const occupied = []; const references = new Map();
  const overlapsOccupied = (start, end) => occupied.some((range) => start < range.end && end > range.start);
  const add = (text, url) => links.push({ text, url });
  const definitionPattern = /^\s{0,3}\[([^\]]+)\]:\s*(?:<(https:\/\/[^>\s]+)>|(https:\/\/[^\s]+))(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*$/gm;
  for (const match of markdown.matchAll(definitionPattern)) {
    references.set(match[1].trim().replace(/\s+/g, " ").toLowerCase(), match[2] || match[3]);
    occupied.push({ start: match.index, end: match.index + match[0].length });
  }
  const inlinePattern = /\[([^\]]+)\]\(\s*<?(https:\/\/[^\s)>]+)>?(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;
  for (const match of markdown.matchAll(inlinePattern)) {
    add(match[1], match[2]);
    occupied.push({ start: match.index, end: match.index + match[0].length });
  }
  const referencePattern = /\[([^\]]+)\]\s*\[([^\]]*)\]/g;
  for (const match of markdown.matchAll(referencePattern)) {
    if (overlapsOccupied(match.index, match.index + match[0].length)) continue;
    const label = (match[2] || match[1]).trim().replace(/\s+/g, " ").toLowerCase();
    const url = references.get(label);
    if (url) add(match[1], url);
    occupied.push({ start: match.index, end: match.index + match[0].length });
  }
  const shortcutReferencePattern = /\[([^\]]+)\]/g;
  for (const match of markdown.matchAll(shortcutReferencePattern)) {
    const start = match.index; const end = start + match[0].length;
    const following = markdown.slice(end, end + 1);
    if (overlapsOccupied(start, end) || ["(", "[", ":"].includes(following)) continue;
    const url = references.get(match[1].trim().replace(/\s+/g, " ").toLowerCase());
    if (url) add(match[1], url);
  }
  const autolinkPattern = /<(https:\/\/[^>\s]+)>/g;
  for (const match of markdown.matchAll(autolinkPattern)) {
    if (!overlapsOccupied(match.index, match.index + match[0].length)) {
      add(match[1], match[1]);
      occupied.push({ start: match.index, end: match.index + match[0].length });
    }
  }
  const trimBareUrl = (value) => {
    let trimmed = value.replace(/[.,;:!?]+$/, "");
    while (trimmed.endsWith(")") && (trimmed.match(/\(/g) || []).length < (trimmed.match(/\)/g) || []).length) trimmed = trimmed.slice(0, -1);
    return trimmed;
  };
  const bareUrlPattern = /https:\/\/[^\s<>"']+/g;
  for (const match of markdown.matchAll(bareUrlPattern)) {
    if (overlapsOccupied(match.index, match.index + match[0].length)) continue;
    const url = trimBareUrl(match[0]);
    if (url) add(url, url);
  }
  return links;
}

function validateShowNotesMappings(ledger, claimInventory, manifest, markdown) {
  const errors = []; const sourcesById = new Map(ledger.sources.map((source) => [source.id, source])); const claimsById = new Map(claimInventory.claims.map((claim) => [claim.id, claim]));
  const links = markdownHttpsLinks(markdown); const manifestLinks = manifest.links || []; const ids = new Set(); const manifestByKey = new Map();
  for (const entry of manifestLinks) {
    if (!entry.id || ids.has(entry.id)) errors.push(`show-notes manifest has duplicate or missing link id ${entry.id || "(missing)"}`); else ids.add(entry.id);
    if (!entry.text || !entry.url || !entry.locator || !entry.source_id || !Array.isArray(entry.claim_ids) || !entry.claim_ids.length) { errors.push(`show-notes link ${entry.id || "(missing)"} must declare text, url, locator, source_id, and claim_ids`); continue; }
    const key = `${entry.text}\u0000${entry.url}`;
    if (manifestByKey.has(key)) errors.push(`show-notes manifest duplicates link ${entry.url}`); else manifestByKey.set(key, entry);
    const source = sourcesById.get(entry.source_id);
    if (!source) { errors.push(`show-notes link ${entry.id} declares unknown source ${entry.source_id}`); continue; }
    try {
      if (!sameUrlIgnoringFragment(source.url, entry.url)) errors.push(`show-notes link ${entry.id} URL does not identify declared source ${source.id}`);
    } catch (_) { /* citationTargetErrors reports malformed URLs with the relevant detail. */ }
    for (const claimId of entry.claim_ids) {
      const claim = claimsById.get(claimId);
      if (!claim) errors.push(`show-notes link ${entry.id} maps unknown claim ${claimId}`);
      else if (!source.supports_claims.includes(claimId) || !claim.sources.includes(source.id)) errors.push(`show-notes link ${entry.id} maps claim ${claimId}, but source ${source.id} does not support it`);
    }
    for (const error of citationTargetErrors({ ...source, url: entry.url, locator: entry.locator })) errors.push(`show-notes link ${entry.id}: ${error}`);
  }
  const markdownKeys = new Map();
  for (const link of links) { const key = `${link.text}\u0000${link.url}`; markdownKeys.set(key, (markdownKeys.get(key) || 0) + 1); }
  for (const key of markdownKeys.keys()) {
    if (!manifestByKey.has(key)) errors.push(`show notes contain an undeclared HTTPS link ${key.split("\u0000")[1]}`);
  }
  for (const key of manifestByKey.keys()) if (!markdownKeys.has(key)) errors.push(`show-notes manifest declares a link not present in show-notes.md: ${key.split("\u0000")[1]}`);
  return { valid: errors.length === 0, errors, markdown_link_count: links.length, manifest_link_count: manifestLinks.length };
}

async function validateShowNotesLinks(ledger, manifest, { fetchCache } = {}) {
  const sourcesById = new Map(ledger.sources.map((source) => [source.id, source])); const results = [];
  for (const entry of manifest.links) {
    const source = sourcesById.get(entry.source_id); const noteSource = { ...source, url: entry.url, locator: entry.locator };
    const result = { id: entry.id, text: entry.text, url: entry.url, source_id: entry.source_id, claim_ids: entry.claim_ids, citation_target: { valid: true, errors: [] } };
    try {
      result.citation_target.errors = citationTargetErrors(noteSource); result.citation_target.valid = result.citation_target.errors.length === 0;
      if (!result.citation_target.valid) throw new Error(`Deep-citation validation failed: ${result.citation_target.errors.join("; ")}`);
      const verification = await verifyProgrammaticFallback(noteSource, { includePdfPageText: Boolean(citedPdfPageNumber(noteSource.url)), fetchCache });
      result.link = verification.link;
      if (noteSource.programmatic_url) {
        result.citation_link = verification.citation_link;
        result.programmatic_link = verification.programmatic_link;
        result.attestation_link = verification.attestation_link;
        result.content_attestation = verification.content_attestation;
      }
    } catch (error) { result.link = { valid: false, error: error.message }; }
    results.push(result);
  }
  return results;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const sourcesPath = path.resolve(options.sources); const claimsPath = path.resolve(options.claims);
  const outputPath = path.resolve(options.output || path.join(path.dirname(sourcesPath), "link-validation.yaml"));
  const ledger = loadYaml(sourcesPath, "sources"); const claimInventory = loadYaml(claimsPath, "claims");
  const showNotesPath = path.resolve(options["show-notes"] || path.join(path.dirname(sourcesPath), "show-notes.md")); const showNotesManifestPath = path.resolve(options["show-notes-manifest"] || path.join(path.dirname(sourcesPath), "show-notes-manifest.yaml"));
  const showNotesFilePresent = fs.existsSync(showNotesPath); const showNotesValidationConfigured = fs.existsSync(showNotesManifestPath);
  if (showNotesValidationConfigured && !showNotesFilePresent) throw new Error("show-notes-manifest.yaml requires show-notes.md");
  const showNotesManifest = showNotesValidationConfigured ? loadYaml(showNotesManifestPath, "links") : null; const showNotesMarkdown = showNotesValidationConfigured ? fs.readFileSync(showNotesPath, "utf8") : null;
  const inputSha256 = validationInputHashes({ sourcesPath, claimsPath, showNotesPath, showNotesManifestPath, showNotesFilePresent, showNotesValidationConfigured });
  const claimsById = new Map(claimInventory.claims.map((claim) => [claim.id, claim]));
  const invalid = ledger.sources.filter((source) => !source.id || !source.url || !Array.isArray(source.supports_claims));
  if (invalid.length) throw new Error("Each source must have id, url, and supports_claims.");
  const claimMapping = validateClaimMappings(ledger, claimInventory);
  const showNotesMapping = showNotesValidationConfigured ? validateShowNotesMappings(ledger, claimInventory, showNotesManifest, showNotesMarkdown) : { valid: true, status: "not_configured", errors: [] };
  if (!claimMapping.valid || !showNotesMapping.valid) {
    for (const error of claimMapping.errors) console.error(`Claim mapping failed: ${error}`);
    for (const error of showNotesMapping.errors) console.error(`Show-notes mapping failed: ${error}`);
    const report = { schema_version: 1, validator: "scripts/validate-source-links.cjs", checked_at_utc: new Date().toISOString(), sources_file: path.relative(process.cwd(), sourcesPath), claims_file: path.relative(process.cwd(), claimsPath), show_notes_file: showNotesFilePresent ? path.relative(process.cwd(), showNotesPath) : null, show_notes_manifest_file: showNotesValidationConfigured ? path.relative(process.cwd(), showNotesManifestPath) : null, input_sha256: inputSha256, llm_requested: options.llm, llm_model: options.llm ? options.model : null, claim_mapping: claimMapping, show_notes_mapping: showNotesMapping, results: [] };
    writeYaml(outputPath, report);
    console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
    process.exitCode = 1;
    return;
  }
  if (options.dryRun) {
    const showNotesSummary = showNotesValidationConfigured ? `${showNotesManifest.links.length} show-notes links` : showNotesFilePresent ? "show notes without a manifest (not configured)" : "no show-notes manifest";
    console.log(`Validated input shape, claim mappings, and ${showNotesSummary} for ${ledger.sources.length} sources and ${claimInventory.claims.length} claims; no network or API requests made.`);
    return;
  }
  const results = [];
  const fetchCache = new Map();
  for (const source of ledger.sources) {
    const linkedClaims = source.supports_claims.map((id) => claimsById.get(id)).filter(Boolean);
    const missingClaims = source.supports_claims.filter((id) => !claimsById.has(id));
    const entry = { source_id: source.id, title: source.title, checked_at_utc: new Date().toISOString(), linked_claim_ids: source.supports_claims, missing_claim_ids: missingClaims, citation_target: { valid: true, errors: [] } };
    try {
      entry.citation_target.errors = [...citationTargetErrors(source), ...validationTargetErrors(source)];
      entry.citation_target.valid = entry.citation_target.errors.length === 0;
      if (!entry.citation_target.valid) throw new Error(`Deep-citation validation failed: ${entry.citation_target.errors.join("; ")}`);
      const verification = await verifyProgrammaticFallback(source, { includePdfPageText: Boolean(citedPdfPageNumber(source.url)), fetchCache });
      entry.link = verification.link;
      if (source.programmatic_url) {
        entry.citation_link = verification.citation_link;
        entry.programmatic_link = verification.programmatic_link;
        entry.attestation_link = verification.attestation_link;
        entry.content_attestation = verification.content_attestation;
      }
    } catch (error) { entry.link = { valid: false, error: error.message }; }
    results.push(entry);
  }
  const showNotesResults = showNotesValidationConfigured ? await validateShowNotesLinks(ledger, showNotesManifest, { fetchCache }) : [];
  const deterministicValid = results.every((entry) => entry.citation_target.valid && entry.link.valid && (!entry.content_attestation || entry.content_attestation.valid) && !entry.missing_claim_ids.length) && showNotesResults.every((entry) => entry.citation_target.valid && entry.link.valid && (!entry.content_attestation || entry.content_attestation.valid));
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
  const reportResults = results.map((result) => ({
    ...result,
    link: publicLinkRecord(result.link),
    citation_link: publicLinkRecord(result.citation_link),
    programmatic_link: publicLinkRecord(result.programmatic_link),
    attestation_link: publicLinkRecord(result.attestation_link),
  }));
  const report = { schema_version: 1, validator: "scripts/validate-source-links.cjs", checked_at_utc: new Date().toISOString(), sources_file: path.relative(process.cwd(), sourcesPath), claims_file: path.relative(process.cwd(), claimsPath), show_notes_file: showNotesFilePresent ? path.relative(process.cwd(), showNotesPath) : null, show_notes_manifest_file: showNotesValidationConfigured ? path.relative(process.cwd(), showNotesManifestPath) : null, input_sha256: inputSha256, llm_requested: options.llm, llm_model: options.llm ? options.model : null, claim_mapping: claimMapping, show_notes_mapping: showNotesMapping, show_notes_results: showNotesResults.map((result) => ({ ...result, link: publicLinkRecord(result.link), citation_link: publicLinkRecord(result.citation_link), programmatic_link: publicLinkRecord(result.programmatic_link), attestation_link: publicLinkRecord(result.attestation_link) })), results: reportResults };
  writeYaml(outputPath, report);
  const unresolved = !claimMapping.valid || !showNotesMapping.valid || showNotesResults.some((entry) => !entry.citation_target.valid || !entry.link.valid || (entry.content_attestation && !entry.content_attestation.valid)) || results.some((entry) => !entry.citation_target.valid || !entry.link.valid || (entry.content_attestation && !entry.content_attestation.valid) || entry.missing_claim_ids.length || (options.requireLlm && entry.relevance.status !== "assessed") || (options.requireLlm && entry.relevance.status === "assessed" && ["does_not_support", "insufficient_evidence"].includes(entry.relevance.assessment.verdict)) || (options.requireLlm && entry.relevance.status === "assessed" && ["does_not_support", "insufficient_evidence"].includes(entry.relevance.assessment.locator_assessment.verdict)) || (options.requireLlm && !entry.claim_assessments.valid));
  console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
  if (unresolved) process.exitCode = 1;
}

if (require.main === module) main().catch((error) => { console.error(`Source validation failed: ${error.message}`); process.exitCode = 1; });

module.exports = { citedPdfPageNumber, extractPdfPageText, fetchSource, markdownHttpsLinks, validateClaimMappings, validateClaimAssessments, validateShowNotesMappings, validationTargetErrors, verifyProgrammaticFallback };
