#!/usr/bin/env node
// Checks hooks/guard-tests.js against sample tool calls.
// Run: node scripts/test-hooks.js
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const hook = path.join(__dirname, '..', 'hooks', 'guard-tests.js');

function run(payload, env) {
  const r = spawnSync('node', [hook], {
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    env: Object.assign({}, process.env, env || {}),
    encoding: 'utf8',
  });
  let decision = 'allow';
  if (r.stdout && r.stdout.trim()) {
    try {
      const j = JSON.parse(r.stdout);
      decision = j.hookSpecificOutput.permissionDecision;
    } catch (e) {
      decision = 'bad-output';
    }
  }
  return { decision, status: r.status, out: r.stdout };
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'guard-'));
const existing = path.join(tmp, 'test_pay.py');
fs.writeFileSync(
  existing,
  'def test_a():\n    assert pay(1) == 1\n\ndef test_b():\n    assert pay(2) == 2\n'
);

const cases = [
  // [name, payload, expected, env]
  ['edit adds pytest skip', { tool_name: 'Edit', tool_input: { file_path: 'tests/test_pay.py', old_string: 'def test_a():', new_string: '@pytest.mark.skip\ndef test_a():' } }, 'ask'],
  ['edit adds it.skip', { tool_name: 'Edit', tool_input: { file_path: 'src/pay.test.ts', old_string: "it('works', () => {", new_string: "it.skip('works', () => {" } }, 'ask'],
  ['edit removes an assertion', { tool_name: 'Edit', tool_input: { file_path: 'tests/test_pay.py', old_string: '    assert pay(1) == 1\n    assert pay(2) == 2', new_string: '    assert pay(1) == 1' } }, 'ask'],
  ['edit changes an expected value only', { tool_name: 'Edit', tool_input: { file_path: 'tests/test_pay.py', old_string: 'assert pay(1) == 1', new_string: 'assert pay(1) == 2' } }, 'allow'],
  ['edit adds an assertion', { tool_name: 'Edit', tool_input: { file_path: 'tests/test_pay.py', old_string: 'assert pay(1) == 1', new_string: 'assert pay(1) == 1\n    assert pay(0) == 0' } }, 'allow'],
  ['edit of normal source', { tool_name: 'Edit', tool_input: { file_path: 'src/pay.py', old_string: 'return a', new_string: 'return a + 1' } }, 'allow'],
  ['source detects pytest', { tool_name: 'Edit', tool_input: { file_path: 'src/pay.py', old_string: 'return a', new_string: 'if os.environ.get("PYTEST_CURRENT_TEST"):\n    return 1\nreturn a' } }, 'ask'],
  ['multiedit adds xit', { tool_name: 'MultiEdit', tool_input: { file_path: 'a.spec.js', edits: [{ old_string: "it('x'", new_string: "xit('x'" }] } }, 'ask'],
  ['write over test drops tests', { tool_name: 'Write', cwd: tmp, tool_input: { file_path: existing, content: 'def test_a():\n    assert pay(1) == 1\n' } }, 'ask'],
  ['write over test keeps tests', { tool_name: 'Write', cwd: tmp, tool_input: { file_path: existing, content: 'def test_a():\n    assert pay(1) == 1\n\ndef test_b():\n    assert pay(2) == 2\n\ndef test_c():\n    assert pay(3) == 3\n' } }, 'allow'],
  ['write a new test file', { tool_name: 'Write', cwd: tmp, tool_input: { file_path: path.join(tmp, 'test_new.py'), content: 'def test_x():\n    pass\n' } }, 'allow'],
  ['write a new source file', { tool_name: 'Write', cwd: tmp, tool_input: { file_path: path.join(tmp, 'new.py'), content: 'x = 1\n' } }, 'allow'],
  ['bash rm test file', { tool_name: 'Bash', tool_input: { command: 'rm tests/test_pay.py' } }, 'ask'],
  ['bash git rm spec', { tool_name: 'Bash', tool_input: { command: 'git rm src/pay.spec.ts' } }, 'ask'],
  ['bash rm build dir', { tool_name: 'Bash', tool_input: { command: 'rm -rf dist build' } }, 'allow'],
  ['bash commit no-verify', { tool_name: 'Bash', tool_input: { command: 'git commit -m "x" --no-verify' } }, 'ask'],
  ['bash normal commit', { tool_name: 'Bash', tool_input: { command: 'git commit -m "x"' } }, 'allow'],
  ['bash run tests', { tool_name: 'Bash', tool_input: { command: 'pytest tests/' } }, 'allow'],
  ['other tool', { tool_name: 'Read', tool_input: { file_path: 'tests/test_pay.py' } }, 'allow'],
  ['bad json', 'not json', 'allow'],
  ['empty input', '', 'allow'],
  ['switched off', { tool_name: 'Edit', tool_input: { file_path: 'tests/test_pay.py', old_string: 'def test_a():', new_string: '@pytest.mark.skip\ndef test_a():' } }, 'allow', { DEV_SUITE_GUARD: 'off' }],
];

let failed = 0;
for (const [name, payload, expected, env] of cases) {
  const r = run(payload, env);
  const ok = r.decision === expected && r.status === 0;
  if (!ok) failed++;
  console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok ? '' : ' -> got ' + r.decision + ' (exit ' + r.status + '), wanted ' + expected));
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(failed === 0 ? '\nall ' + cases.length + ' passed' : '\n' + failed + ' failed');
process.exit(failed === 0 ? 0 : 1);
