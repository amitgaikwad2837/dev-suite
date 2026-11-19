#!/usr/bin/env node
// dev-suite hook: guards against destructive actions and out-of-scope edits.
//
// Runs before Edit, Write, MultiEdit and Bash.
//   1. Bash: hard-denies a few catastrophic commands (recursive delete of the root, a home
//      folder or a system folder; force-pushing the default branch; writing to a disk device)
//      and asks the user to confirm risky ones (recursive deletes, git history and working-tree
//      destruction, dropping or truncating data, tearing down infrastructure, publishing).
//   2. Edit, Write, MultiEdit: if a file `.dev-suite/freeze` exists in the project, edits outside
//      the folders it lists ask the user to confirm. One folder per line, relative to the
//      folder that holds `.dev-suite`. Delete the file to unfreeze.
//
// Any error inside the hook lets the call proceed. Switch it off with DEV_SUITE_ACTION_GUARD=off.
// The freeze covers Edit, Write and MultiEdit only; shell redirects and `sed -i` are not checked.

const fs = require('fs');
const path = require('path');

function allow() {
  process.exit(0);
}

function decide(decision, reason) {
  const out = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: decision,
      permissionDecisionReason: 'dev-suite action guard: ' + reason,
    },
  };
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

// ---------- Bash ----------

const SAFE_DIRS = new Set([
  'node_modules', 'dist', 'build', 'out', 'target', '__pycache__', '.cache', '.next', '.nuxt',
  'coverage', '.pytest_cache', '.mypy_cache', '.ruff_cache', '.venv', 'venv', '.tox', '.turbo',
  '.parcel-cache', '.gradle', 'tmp', '.tmp', '.dev-suite', '.svelte-kit', '.angular',
]);

const CATASTROPHIC_TARGETS = [
  /^\/$/, /^\/\*$/, /^~\/?$/, /^~\/\*$/, /^\$\{?HOME\}?\/?$/, /^\$\{?HOME\}?\/\*$/,
  /^\/(etc|usr|var|bin|sbin|boot|lib|lib64|root|home|Users|System|opt)\/?$/i,
  /^[a-z]:[\\/]?$/i, /^[a-z]:[\\/]\*$/i, /^%USERPROFILE%[\\/]?$/i, /^\$env:USERPROFILE[\\/]?$/i,
];

function stripQuotes(s) {
  return String(s).replace(/^['"]+|['"]+$/g, '');
}

function segments(cmd) {
  return String(cmd || '').split(/&&|\|\||;|\n|\|(?!\|)/).map((s) => s.trim()).filter(Boolean);
}

function tokens(seg) {
  return seg.match(/"[^"]*"|'[^']*'|\S+/g) || [];
}

function isSafeTarget(t) {
  const n = stripQuotes(t).replace(/\\/g, '/').replace(/\/+$/, '');
  if (!n) return false;
  const parts = n.split('/').filter((p) => p && p !== '.');
  if (parts.length === 0) return false;
  if (parts.some((p) => p === '..')) return false;
  if (/\*\.pyc$/.test(n)) return true;
  return SAFE_DIRS.has(parts[parts.length - 1]) || parts.some((p) => p === 'node_modules');
}

function checkRemove(toks, out) {
  const name = toks[0].toLowerCase().replace(/^.*[\\/]/, '');
  let recursive = false;
  const targets = [];
  for (const raw of toks.slice(1)) {
    const t = stripQuotes(raw);
    if (name === 'rm') {
      if (/^--recursive$/.test(t)) recursive = true;
      else if (/^-[a-zA-Z]*[rR][a-zA-Z]*$/.test(t)) recursive = true;
      else if (!t.startsWith('-')) targets.push(t);
    } else if (name === 'remove-item' || name === 'ri') {
      if (/^-(recurse|r)$/i.test(t)) recursive = true;
      else if (!t.startsWith('-')) targets.push(t);
    } else if (name === 'rmdir' || name === 'rd') {
      if (/^\/s$/i.test(t) || /^-r$/i.test(t)) recursive = true;
      else if (!t.startsWith('/') || t.length > 2) targets.push(t);
    } else if (name === 'del' || name === 'erase') {
      if (/^\/s$/i.test(t)) recursive = true;
      else if (!t.startsWith('/')) targets.push(t);
    }
  }
  if (!recursive) return;
  if (targets.some((t) => CATASTROPHIC_TARGETS.some((re) => re.test(t)))) {
    out.deny.push('it recursively deletes a root, home or system folder');
    return;
  }
  if (targets.length === 0 || targets.some((t) => !isSafeTarget(t))) {
    out.ask.push('it deletes folders recursively (' + (targets.join(' ') || 'no target shown') + ')');
  }
}

const DEFAULT_BRANCH = /^(\+)?(refs\/heads\/)?(main|master|trunk|production|prod)$/i;

function checkGitPush(toks, out) {
  const args = toks.slice(1).map(stripQuotes);
  if (args[0] !== 'push') return;
  const rest = args.slice(1);
  const force = rest.some((a) => /^(--force|-f|--force-with-lease(=.*)?|--force-if-includes)$/.test(a)) ||
    rest.some((a) => /^\+\S+/.test(a));
  const del = rest.some((a) => /^(--delete|-d)$/.test(a)) || rest.some((a) => /^:[^:\s]+$/.test(a));
  const refs = rest.filter((a) => !a.startsWith('-'));
  const toDefault = refs.some((a) => DEFAULT_BRANCH.test(a.replace(/^.*:/, '')) || DEFAULT_BRANCH.test(a));
  if (force && toDefault) {
    out.deny.push('it force-pushes the default branch');
  } else if (force) {
    out.ask.push('it force-pushes, which can overwrite other people\'s commits');
  }
  if (del) out.ask.push('it deletes a remote branch or tag');
}

function checkSegment(seg, out) {
  const toks = tokens(seg);
  if (toks.length === 0) return;
  let i = 0;
  while (i < toks.length && /^(sudo|doas|env|command|time|nohup|xargs)$/i.test(toks[i])) i++;
  const t = toks.slice(i);
  if (t.length === 0) return;
  const cmd = t[0].toLowerCase().replace(/^.*[\\/]/, '');
  const flat = t.join(' ');

  if (/^(rm|remove-item|ri|rmdir|rd|del|erase)$/.test(cmd)) checkRemove(t, out);

  if (cmd === 'git') {
    const sub = t.slice(1).filter((a) => !a.startsWith('-') || a === '-C').join(' ');
    if (/\breset\b[^;&|]*--hard\b/.test(flat)) out.ask.push('git reset --hard discards uncommitted work');
    if (/\bclean\b[^;&|]*-[a-zA-Z]*f/.test(flat)) out.ask.push('git clean deletes untracked files');
    if (/\bcheckout\b[^;&|]*\s--\s+(\.|:\/|\*)(\s|$)/.test(flat) || /\bcheckout\s+\.(\s|$)/.test(flat) ||
        /\brestore\b(?![^;&|]*--staged\b)[^;&|]*\s(\.|:\/)(\s|$)/.test(flat)) {
      out.ask.push('it discards all uncommitted changes in the working tree');
    }
    if (/\bstash\s+(drop|clear)\b/.test(flat)) out.ask.push('it drops stashed work');
    if (/\bbranch\b[^;&|]*\s-D\b/.test(flat)) out.ask.push('it force-deletes a branch');
    if (/\b(filter-branch|filter-repo)\b/.test(flat) || /\breflog\s+expire\b/.test(flat) || /\bgc\b[^;&|]*--prune=now/.test(flat)) {
      out.ask.push('it rewrites or permanently prunes git history');
    }
    if (/\bpush\b/.test(sub)) checkGitPush(['git'].concat(t.slice(1)), out);
  }

  if (cmd === 'dd' && /\bof=\/dev\/(sd|nvme|hd|disk|mmcblk)/.test(flat)) out.deny.push('it writes directly to a disk device');
  if (/^mkfs(\.|$)/.test(cmd)) out.deny.push('it formats a disk');

  if (cmd === 'terraform' || cmd === 'tofu') {
    if (/\bdestroy\b/.test(flat)) out.ask.push('terraform destroy removes real infrastructure');
    if (/\bapply\b/.test(flat) && /(-auto-approve|--auto-approve)/.test(flat)) out.ask.push('terraform apply -auto-approve skips the plan review');
  }
  if (cmd === 'kubectl' && /\bdelete\b/.test(flat) && /(\bnamespaces?\b|\bns\b|\bpvc?\b|\bpersistentvolume|--all\b|-A\b|--all-namespaces)/.test(flat)) {
    out.ask.push('kubectl delete of a namespace, volume or everything');
  }
  if (cmd === 'docker' && /\b(system|volume)\s+prune\b/.test(flat)) out.ask.push('docker prune deletes images, containers or volumes');
  if (cmd === 'aws' && (/\bs3\s+rb\b/.test(flat) || (/\bs3\s+rm\b/.test(flat) && /--recursive/.test(flat)))) out.ask.push('it deletes S3 data');
  if (cmd === 'az' && /\bgroup\s+delete\b/.test(flat)) out.ask.push('it deletes an Azure resource group');
  if (cmd === 'gcloud' && /\bprojects?\s+delete\b/.test(flat)) out.ask.push('it deletes a Google Cloud project');
  if (cmd === 'chmod' && /-R/.test(flat) && /\b0?777\b/.test(flat)) out.ask.push('chmod -R 777 makes files writable by everyone');

  if (/^(npm|yarn|pnpm)$/.test(cmd) && /\bpublish\b/.test(flat)) out.ask.push('it publishes a package');
  if (cmd === 'twine' && /\bupload\b/.test(flat)) out.ask.push('it uploads a package to an index');
  if (cmd === 'cargo' && /\bpublish\b/.test(flat)) out.ask.push('it publishes a crate');
  if (cmd === 'gem' && /\bpush\b/.test(flat)) out.ask.push('it publishes a gem');
}

function checkWholeCommand(cmd, out) {
  if (/\b(DROP\s+(TABLE|DATABASE|SCHEMA)|TRUNCATE\s+(TABLE\s+)?[\w."`\[])/i.test(cmd)) {
    out.ask.push('it drops or truncates database data');
  }
  if (/\bDELETE\s+FROM\s+[\w."`\[\]]+\s*(;|["']|$)/i.test(cmd) && !/\bWHERE\b/i.test(cmd)) {
    out.ask.push('it deletes every row of a table (DELETE with no WHERE)');
  }
  if (/\b(curl|wget)\b[^;&\n]*\|\s*(sudo\s+)?(ba|z)?sh\b/.test(cmd)) {
    out.ask.push('it pipes a download straight into a shell');
  }
  if (/:\(\)\s*\{\s*:\|:&\s*\};:/.test(cmd)) out.deny.push('it is a fork bomb');
}

function checkBash(command) {
  const out = { deny: [], ask: [] };
  const cmd = String(command || '');
  for (const seg of segments(cmd)) checkSegment(seg, out);
  checkWholeCommand(cmd, out);
  return out;
}

// ---------- Freeze ----------

function norm(p) {
  const r = path.resolve(p);
  return process.platform === 'win32' ? r.toLowerCase() : r;
}

function findFreeze(startDir) {
  let dir = path.resolve(startDir || process.cwd());
  for (let i = 0; i < 40; i++) {
    const f = path.join(dir, '.dev-suite', 'freeze');
    try {
      if (fs.statSync(f).isFile()) return { file: f, root: dir };
    } catch (e) {
      // keep walking up
    }
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return null;
}

function checkFreeze(data, filePath) {
  if (!filePath) return null;
  const cwd = data.cwd || process.cwd();
  const found = findFreeze(cwd);
  if (!found) return null;
  let lines;
  try {
    lines = fs.readFileSync(found.file, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  } catch (e) {
    return null;
  }
  if (lines.length === 0) return null;
  const abs = norm(path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath));
  const frozenAreas = lines.map((l) => norm(path.isAbsolute(l) ? l : path.join(found.root, l)));
  const notesDir = norm(path.join(found.root, '.dev-suite'));
  const inside = (area) => abs === area || abs.startsWith(area + path.sep);
  if (inside(notesDir) || frozenAreas.some(inside)) return null;
  return 'edits are frozen to ' + lines.join(', ') + ' and this file is outside it (' + filePath +
    '). Unfreeze by deleting .dev-suite/freeze, or confirm only if this edit is intended.';
}

// ---------- main ----------

function main() {
  if ((process.env.DEV_SUITE_ACTION_GUARD || '').toLowerCase() === 'off') allow();

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
  const input = data.tool_input || {};
  try {
    if (tool === 'Bash') {
      const r = checkBash(input.command);
      if (r.deny.length) {
        decide('deny', r.deny.join('; ') + '. Blocked. If this is really intended, the user should run it themselves.');
      }
      if (r.ask.length) {
        decide('ask', r.ask.join('; ') + '. Confirm only if this exact action is intended, and make sure there is a backup or a way back.');
      }
    } else if (tool === 'Edit' || tool === 'Write' || tool === 'MultiEdit' || tool === 'NotebookEdit') {
      const reason = checkFreeze(data, input.file_path || input.notebook_path || input.path || '');
      if (reason) decide('ask', reason);
    }
  } catch (e) {
    allow();
  }
  allow();
}

main();
