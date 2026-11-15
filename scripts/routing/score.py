"""Score routing answers. usage: python scripts/routing/score.py OUTDIR"""
import json, sys, glob, os, collections

out = sys.argv[1]
setname = sys.argv[2] if len(sys.argv) > 2 else 'prompts.json'
prompts = json.load(open(os.path.join(os.path.dirname(__file__), setname), encoding='utf-8'))
ans = {}
for f in glob.glob(os.path.join(out, 'answers_*.json')):
    ans.update(json.load(open(f, encoding='utf-8')))
ok = 0; miss = []; confusion = collections.Counter()
for k, item in enumerate(prompts):
    got = ans.get(str(k), 'MISSING').strip()
    exp = item['e']
    good = (got == 'none') if not exp else (got in exp)
    if good: ok += 1
    else:
        miss.append((k, item['p'], exp, got)); confusion[(exp[0] if exp else 'none', got)] += 1
print(f'{ok}/{len(prompts)} correct ({100*ok//len(prompts)}%)')
for k, p, e, g in miss:
    print(f'- #{k} wanted {e or "none"} got {g}: {p[:90]}')
print('\nconfusions:'); [print(' ', a, '->', b, c) for (a, b), c in confusion.most_common()]
