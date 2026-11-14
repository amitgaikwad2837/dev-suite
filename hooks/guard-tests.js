#!/usr/bin/env node
// dev-suite hook: stops "green by cheating".
//
// Runs before Edit, Write, MultiEdit and Bash. When a call looks like it weakens a test or
// special-cases the test run, it asks the user to confirm instead of letting it through
// silently. It never blocks outright, and any error inside the hook lets the call proceed.
//
// Switch it off for a session with DEV_SUITE_GUARD=off.

const fs = require('fs');
const path = require('path');

function allow() {
  process.exit(0);
}

function ask(reason) {
  const out = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: 'dev-suite honest-fixes guard: ' + reason,
    },
  };
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

const TEST_PATH = [
  /(^|\/)(tests?|__tests__|specs?|e2e|cypress|spec)\//i,
  /\.(test|spec)\.[a-z0-9]+$/i,
  /(^|\/)test_[^/]+\.py$/i,
  /_test\.(py|go|rb|rs|exs?)$/i,
  /_spec\.rb$/i,
  /(^|\/)conftest\.py$/i,
  /[^/]Tests?\.(java|kt|cs|swift|php)$/,
];

function isTestPath(p) {
  if (!p) return false;
  const n = String(p).replace(/\\/g, '/');
  return TEST_PATH.some((re) => re.test(n));
}

// Markers that turn a test off.
const SKIP = [
  /@pytest\.mark\.(skip|skipif|xfail)\b/g,
  /\bpytest\.(skip|xfail)\s*\(/g,
  /@unittest\.(skip|skipIf|skipUnless|expectedFailure)\b/g,
  /\b(it|test|describe|context)\.(skip|todo|fixme)\b/g,
  /\b(xit|xtest|xdescribe|xcontext)\s*\(/g,
  /@(Ignore|Disabled)\b/g,
  /\bt\.Skip(f|Now)?\s*\(/g,
  /#\[ignore\b/g,
  /\bskip\s*\(?\s*['"]/g,
  /\bpending\s*\(/g,
];

// Things that count as an assertion.
const ASSERT = [
  /\bassert\w*\b/g,
  /\bexpect\s*\(/g,
  /\.should\b/g,
  /\bverify\s*\(/g,
  /\bt\.(Error|Errorf|Fatal|Fatalf|Fail)\b/g,
  /\bself\.assert\w*/g,
];

// Code that behaves differently when it detects a test run.
const TEST_DETECT = [
  /PYTEST_CURRENT_TEST/g,
  /\bprocess\.env\.(JEST_WORKER_ID|VITEST|NODE_ENV\s*[!=]==?\s*['"]test['"])/g,
  /\bsys\.modules\s*\[\s*['"](pytest|unittest)['"]\s*\]/g,
  /['"]pytest['"]\s+in\s+sys\.modules/g,
  /\bIS_TESTING\b|\bUNDER_TEST\b|\bRUNNING_TESTS?\b/g,
];

function count(text, patterns) {
  let n = 0;
  for (const re of patterns) {
    const m = String(text || '').match(re);
    if (m) n += m.length;
  }
  return n;
}

function testCount(text) {
  const pats = [/\bdef\s+test_\w+/g, /\b(it|test)\s*\(/g, /\bfunc\s+Test\w+/g, /@Test\b/g, /#\[test\]/g];
  return count(text, pats);
}

function compareTestText(oldText, newText) {
  const reasons = [];
  if (count(newText, SKIP) > count(oldText, SKIP)) {
    reasons.push('it adds a skip, xfail or ignore marker to a test');
  }
  const a0 = count(oldText, ASSERT);
  const a1 = count(newText, ASSERT);
  if (a1 < a0) {
    reasons.push('it removes assertions (' + a0 + ' before, ' + a1 + ' after)');
  }
  const t0 = testCount(oldText);
  const t1 = testCount(newText);
  if (t1 < t0) {
    reasons.push('it removes test cases (' + t0 + ' before, ' + t1 + ' after)');
  }
  return reasons;
}

function readIfExists(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return null;
  }
}

function checkEdit(input, filePath) {
  const edits = [];
  if (Array.isArray(input.edits)) {
    for (const e of input.edits) edits.push([e.old_string, e.new_string]);
  } else if (typeof input.new_string === 'string') {
    edits.push([input.old_string || '', input.new_string]);
  }

  const reasons = [];
  if (isTestPath(filePath)) {
    for (const [o, n] of edits) reasons.push(...compareTestText(o, n));
  } else {
    for (const [o, n] of edits) {
      if (count(n, TEST_DETECT) > count(o, TEST_DETECT)) {
        reasons.push('it adds code that checks whether tests are running, which can make a failing test pass without fixing the code');
      }
    }
  }
  return reasons;
}

function checkWrite(input, filePath) {
  const content = typeof input.content === 'string' ? input.content : '';
  if (isTestPath(filePath)) {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(input.__cwd || process.cwd(), filePath);
    const existing = readIfExists(abs);
    if (existing === null) return []; // a new test file is fine
    return compareTestText(existing, content);
  }
  const abs = path.isAbsolute(filePath) ? filePath : path.join(input.__cwd || process.cwd(), filePath);
  const existing = readIfExists(abs) || '';
  if (count(content, TEST_DETECT) > count(existing, TEST_DETECT)) {
    return ['it adds code that checks whether tests are running, which can make a failing test pass without fixing the code'];
  }
  return [];
}

function checkBash(command) {
  const reasons = [];
  const cmd = String(command || '');
  const removes = /(^|[\s;&|])(rm|del|erase|git\s+rm|Remove-Item|ri)\b[^;&|]*/g;
  let m;
  while ((m = removes.exec(cmd)) !== null) {
    const words = m[0].split(/\s+/);
    if (words.some((w) => isTestPath(w.replace(/^['"]|['"]$/g, '')))) {
      reasons.push('it deletes a test file');
      break;
    }
  }
  if (/\bgit\s+(commit|push|merge|rebase|cherry-pick)\b[^;&|]*--no-verify\b/.test(cmd)) {
    reasons.push('it skips the git hooks that run checks (--no-verify)');
  }
  return reasons;
}

function main() {
  if ((process.env.DEV_SUITE_GUARD || '').toLowerCase() === 'off') allow();

  let raw = '';
  try {
    raw = fs.readFileSync(0, 'utf8');
  } catch (e) {
    allow();
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    allow();
  }
  if (!data || typeof data !== 'object') allow();

  const tool = data.tool_name;
  const input = Object.assign({}, data.tool_input || {}, { __cwd: data.cwd });
  const filePath = input.file_path || input.path || '';

  let reasons = [];
  try {
    if (tool === 'Edit' || tool === 'MultiEdit') reasons = checkEdit(input, filePath);
    else if (tool === 'Write') reasons = checkWrite(input, filePath);
    else if (tool === 'Bash') reasons = checkBash(input.command);
  } catch (e) {
    allow();
  }

  if (reasons.length === 0) allow();
  ask(
    reasons.join('; ') +
      '. If a test is wrong, say so and show what it asserted, why that was incorrect and what it asserts now. ' +
      'If code is failing, fix the code. Confirm only if this change is intended.'
  );
}

main();
