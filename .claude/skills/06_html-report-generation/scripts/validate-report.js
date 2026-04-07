#!/usr/bin/env node
/**
 * validate-report.js — Validates a generated client defense report HTML file
 *
 * Checks:
 * 1. File exists and is readable
 * 2. Contains valid HTML structure (<html>, <body>, <script>)
 * 3. REPORT_DATA is syntactically valid JavaScript (parsed via Function constructor)
 * 4. REPORT_DATA has required top-level keys (metadata, summary, items)
 * 5. No broken </script> tags inside the data blob
 * 6. Items array is non-empty
 * 7. Each item has an id, title, and findings array
 *
 * Usage: node validate-report.js <path-to-report.html>
 * Exit 0 = pass, Exit 1 = fail (errors printed to stderr)
 */

const fs = require('fs');
const path = require('path');

const reportPath = process.argv[2];
if (!reportPath) {
  console.error('Usage: node validate-report.js <path-to-report.html>');
  process.exit(1);
}

const errors = [];
const warnings = [];

function fail(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

// 1. File exists
let html;
try {
  html = fs.readFileSync(path.resolve(reportPath), 'utf-8');
} catch (e) {
  console.error(`FAIL: Cannot read file: ${reportPath}`);
  console.error(e.message);
  process.exit(1);
}

// 2. Basic HTML structure
if (!html.includes('<!DOCTYPE html>') && !html.includes('<!doctype html>')) {
  fail('Missing <!DOCTYPE html>');
}
if (!html.includes('<html')) fail('Missing <html> tag');
if (!html.includes('<body>') && !html.includes('<body ')) fail('Missing <body> tag');
if (!html.includes('<script>') && !html.includes('<script ')) fail('Missing <script> tag');

// 3. Extract REPORT_DATA and validate JS syntax
const dataMatch = html.match(/const\s+REPORT_DATA\s*=\s*(\{[\s\S]*?\});\s*\n/);
if (!dataMatch) {
  // Try alternative: data on a single very long line
  const lineMatch = html.match(/const\s+REPORT_DATA\s*=\s*(\{.+?\});/);
  if (!lineMatch) {
    fail('Cannot find REPORT_DATA assignment in the HTML. Expected: const REPORT_DATA = {...};');
  } else {
    validateData(lineMatch[1]);
  }
} else {
  validateData(dataMatch[1]);
}

function validateData(jsonStr) {
  // 5. Check for broken script tags
  if (/<\/script>/i.test(jsonStr)) {
    fail('REPORT_DATA contains unescaped </script> tag — this will break the HTML parser. Must be escaped as <\\/script>');
  }

  // Parse as JS (not JSON, since the agent might output JS object literals)
  let data;
  try {
    // Using Function constructor to parse JS object literal
    data = new Function('return ' + jsonStr)();
  } catch (e) {
    fail(`REPORT_DATA is not valid JavaScript: ${e.message}`);
    // Try to find the approximate location
    const lines = jsonStr.substring(0, 500);
    fail(`First 500 chars of data: ${lines}...`);
    return;
  }

  // 4. Required top-level keys
  if (!data.metadata) fail('REPORT_DATA.metadata is missing');
  if (!data.summary) fail('REPORT_DATA.summary is missing');
  if (!data.items) fail('REPORT_DATA.items is missing');
  if (!Array.isArray(data.items)) fail('REPORT_DATA.items is not an array');

  // 6. Items non-empty
  if (data.items && data.items.length === 0) {
    warn('REPORT_DATA.items is empty — report will show no content');
  }

  // 7. Item structure
  if (data.items && data.items.length > 0) {
    data.items.forEach((item, i) => {
      if (!item.id) warn(`items[${i}] missing id`);
      if (!item.title) warn(`items[${i}] missing title`);
      if (!Array.isArray(item.findings)) warn(`items[${i}] missing findings array`);
    });

    // Check findings have required fields
    let totalFindings = 0;
    data.items.forEach(item => {
      (item.findings || []).forEach(f => {
        totalFindings++;
        if (!f.id) warn(`Finding in ${item.id} missing id`);
        if (!f.severity) warn(`Finding ${f.id || '?'} missing severity`);
      });
    });

    if (totalFindings === 0) warn('No findings found in any items');
  }

  // Check structural_criticisms
  if (data.structural_criticisms && Array.isArray(data.structural_criticisms)) {
    data.structural_criticisms.forEach((sc, i) => {
      if (!sc.id) warn(`structural_criticisms[${i}] missing id`);
      if (!sc.criticism) warn(`structural_criticisms[${i}] missing criticism text`);
    });
  }

  // Check summary values
  if (data.summary) {
    if (typeof data.summary.defense_readiness !== 'number') warn('summary.defense_readiness is not a number');
    if (typeof data.summary.total_items !== 'number') warn('summary.total_items is not a number');
    if (typeof data.summary.total_findings !== 'number') warn('summary.total_findings is not a number');
  }
}

// Output results
if (errors.length > 0) {
  console.error(`\n  VALIDATION FAILED — ${errors.length} error(s), ${warnings.length} warning(s)\n`);
  errors.forEach(e => console.error(`  ERROR: ${e}`));
  warnings.forEach(w => console.error(`  WARN:  ${w}`));
  console.error('');
  process.exit(1);
} else {
  console.log(`\n  VALIDATION PASSED — 0 errors, ${warnings.length} warning(s)\n`);
  warnings.forEach(w => console.log(`  WARN:  ${w}`));
  if (warnings.length === 0) console.log('  All checks passed.');
  console.log('');
  process.exit(0);
}
