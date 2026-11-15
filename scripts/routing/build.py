"""Write the files a routing test needs: the description list a model would see,
and the prompts split into batches without their expected answers.

usage: python scripts/routing/build.py OUTDIR [batches] [prompts file name]
Then give each batch file plus descriptions.md to a fresh model, collect its JSON
answers as OUTDIR/answers_N.json ({"id": "skill-name" or "none"}), and run score.py.
"""
import json, re, sys, glob, os

def load_prompts(setname, here):
    """setname 'all' joins every prompts*.json file in this folder."""
    import glob, json, os
    if setname != 'all':
        return json.load(open(os.path.join(here, setname), encoding='utf-8'))
    out = []
    for f in sorted(glob.glob(os.path.join(here, 'prompts*.json'))):
        out += json.load(open(f, encoding='utf-8'))
    return out


out = sys.argv[1]
n = int(sys.argv[2]) if len(sys.argv) > 2 else 4
setname = sys.argv[3] if len(sys.argv) > 3 else 'prompts.json'
os.makedirs(out, exist_ok=True)
root = os.path.join(os.path.dirname(__file__), '..', '..')
lines = []
for f in sorted(glob.glob(os.path.join(root, 'skills', '*', 'SKILL.md'))):
    s = open(f, encoding='utf-8').read()
    name = re.search(r'^name:\s*(.+)$', s, re.M).group(1).strip()
    desc = re.search(r'^description:\s*(.+)$', s, re.M).group(1).strip()
    lines.append(f'- {name}: {desc}')
open(os.path.join(out, 'descriptions.md'), 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
prompts = load_prompts(setname, os.path.dirname(os.path.abspath(__file__)))
for i in range(n):
    part = {str(k): prompts[k]['p'] for k in range(i, len(prompts), n)}
    json.dump(part, open(os.path.join(out, f'batch_{i}.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('descriptions chars', sum(len(l) for l in lines), 'prompts', len(prompts))
