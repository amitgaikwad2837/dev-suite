Three weeks is enough to close the serious items, but order matters. Everything below is ranked by how easily it is exploited and what it costs if it is. I haven't seen your cluster yet, so the first step is to read the real config rather than trust this summary.

## Before changing anything (day 1-2): confirm what is exposed

- Check the dashboard: what URL, what auth, and which service account it runs as. If it is a Kubernetes Dashboard bound to cluster-admin and reachable from the internet, anyone who reaches it owns the cluster.
- List ClusterRoleBindings to cluster-admin (`kubectl get clusterrolebindings -o wide`) and see which pods use that service account.
- Search git history, not just the current tree, for secrets (gitleaks or trufflehog).
- Find out what is in the clusters: is there one cluster or several, and does a pen tester reach prod from the internet?
- Check audit logging on the managed control plane. Turn it on if it is off.

## Priority order

**1. Take the dashboard off the public internet (do this first, same week).**
It is the cheapest fix and the highest risk, since it is an unauthenticated or weakly authenticated path to the control plane. Options, in order of preference: remove it, or expose it only through `kubectl proxy` / port-forward, or put it behind VPN/SSO with a restricted read-only role. Keep a second way in (kubectl via your cloud IAM) before you remove it.

**2. Rotate secrets and get them out of git.**
Secrets in deployment YAML in git are already leaked to everyone with repo access, and history keeps them. Deleting the lines is not enough.
- Treat every secret in git as compromised and rotate it: database passwords, API keys, tokens.
- Move them to the cloud secrets manager (with External Secrets Operator or the CSI secrets driver), or at least to Kubernetes Secrets with encryption at rest enabled on the managed cluster. Prefer workload identity over static keys where you can.
- Add a pre-commit and CI secret scan so it doesn't come back.
- Rotate first, migrate after. Rotating is the part that actually reduces risk.

**3. Replace the shared cluster-admin service account.**
Every pod running as cluster-admin means any single compromised container, or one RCE in the app, becomes full cluster takeover. This is the biggest blast-radius issue after the dashboard.
- Create one service account per workload with a namespaced Role granting only what it needs. Most app pods need no Kubernetes API access at all: set `automountServiceAccountToken: false`.
- Roll it out one workload at a time in staging first, watch for 403s in logs, then production. Keep the cluster-admin binding in place until the last workload is moved, then remove it. Do not remove it in one step.
- Keep a separate named admin identity (through cloud IAM, with MFA) for humans.

**4. Add network policies.**
With none, a compromised pod can reach every other pod, the database, and the cloud metadata endpoint.
- Confirm your CNI enforces NetworkPolicy (some managed defaults need it enabled).
- Start with a default-deny ingress policy per namespace plus explicit allows for the known traffic paths, then add egress restrictions (block the metadata service from pods that do not need it). Test in staging, because a wrong default-deny breaks traffic. Apply namespace by namespace, starting with the ones holding the database and anything sensitive.

**5. Stop running containers as root.**
Add `runAsNonRoot: true`, `allowPrivilegeEscalation: false`, drop all capabilities, and a read-only root filesystem where possible. Enforce it with Pod Security Admission (the `restricted` or `baseline` profile) in warn/audit mode first, then enforce. Some images will break; fix those individually. This limits what an attacker can do after getting into a pod, so it ranks below the items that give them the cluster directly.

## Also quick wins in the same window

- Check that the API server endpoint is not open to 0.0.0.0/0, and restrict it to known ranges if your provider supports it.
- Image and dependency scanning in CI, and patch internet-facing images.
- Alerts on creation of ClusterRoleBindings, exec into pods, and use of cluster-admin.
- Make sure a backup exists and has been restored at least once.

## Suggested timeline

- Week 1: audit the real config, remove the public dashboard, rotate leaked secrets, turn on audit logs, secret scanning in CI.
- Week 2: move secrets to a manager, split the service accounts, remove cluster-admin from workloads.
- Week 3: network policies and pod security in staging then prod, re-test, write down what remains.
- Leave a few days of buffer before the pen test starts, and don't make big production changes in the last days.

## How I'd make changes safely

One change at a time, staging first, with the rollback written down. I'd give you the exact manifest or command for each change and wait for your clear yes before anything touches production. I wouldn't apply a bulk script to the cluster. Also tell the pen testers what you fixed and agree on scope, so they spend time on the hard problems and not on the known defaults.

## What I need from you

- The dashboard manifest or ingress and how it authenticates.
- Which provider (EKS, GKE, AKS) and whether staging exists.
- Your CNI and the list of namespaces.
- Whether the git history with secrets is in a private repo, and who has access.

At the end I'll give you a report: what was inspected, findings ranked, what changed and how it was verified, what remains and who owns it, what I couldn't verify, plus a short checklist you can rerun each quarter.
