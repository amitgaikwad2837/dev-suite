Here is the order I'd work in. It's ranked by how fast a tester gets in, how far they get once in, and how cheap the fix is. You have three weeks, so everything below is doable.

**Week 1: close the front door and rotate secrets (do these first)**

1. **Take the dashboard off the public internet today.** This is the highest priority. An exposed Kubernetes Dashboard is a common first finding, and it often gives direct cluster access. It takes about an hour.
   - Delete the public Ingress or LoadBalancer. If you need the dashboard at all, put it behind your VPN, an identity-aware proxy or `kubectl proxy`, with SSO. Otherwise remove it. `kubectl` and your cloud console cover most of what it does.
   - If it has ever been public, treat the cluster as possibly compromised. Check the audit logs for unfamiliar access, and check for odd workloads such as crypto miners.
   - Also confirm the API server endpoint itself is restricted. On managed clusters, enable authorized networks or a private endpoint.
2. **Rotate every secret that has been in git, then move secrets out of the manifests.** Rotate first. Anything that has been in git history is compromised, and deleting the file doesn't undo that.
   - Rotate DB passwords, API keys, tokens and signing keys. You can purge history with git-filter-repo or BFG later. That is cleanup only; rotation is what protects you.
   - Then switch to a proper mechanism. The best fit is an external secrets manager (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault or Vault) synced in with External Secrets Operator or the CSI driver. Sealed Secrets or SOPS are a lighter option if you want to keep GitOps.
   - Mount secrets as files rather than env vars where you can, because env vars leak into logs and crash dumps.
   - Turn on encryption of Kubernetes Secrets at rest with your provider's KMS option. Add secret scanning, such as gitleaks, as a pre-commit hook and CI check so this doesn't recur.
3. **Fix the single cluster-admin service account.** This is the one with the largest blast radius. Any compromised pod becomes full cluster takeover, so a tester will aim straight for it.
   - Create one service account per workload. Most workloads need no Kubernetes API access at all, so set `automountServiceAccountToken: false` on them.
   - Where a workload does need the API, write a namespaced Role with only the verbs and resources it uses. Avoid ClusterRoles.
   - Remove the cluster-admin binding once the replacements are in. Roll this out gradually: one namespace or service at a time, watching for 403s in the logs.
   - Make sure humans aren't using cluster-admin day to day either.

**Week 2: contain the damage if something is compromised**

4. **Add NetworkPolicies.** Without them, any pod can reach every other pod, and your pen tester will move laterally easily.
   - Confirm your CNI enforces them. On some managed offerings you have to enable that, e.g. Calico on AKS/GKE or Network Policy on EKS.
   - Start with a default-deny ingress policy in each namespace, then add allow rules for known traffic: ingress controller to app, app to database, DNS egress.
   - Also block pod access to the cloud metadata endpoint (169.254.169.254) and use workload identity (IRSA, GKE Workload Identity, Azure Workload Identity) so pods don't inherit node credentials. This is a very common pen test finding.
   - Test in a staging namespace first. Add egress default-deny afterwards if time permits.
5. **Stop running containers as root.**
   - Add `runAsNonRoot: true`, a numeric `runAsUser`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]` and `seccompProfile: RuntimeDefault`. Use `readOnlyRootFilesystem: true` where the app allows it.
   - Many images need a small Dockerfile change (a `USER` line, plus file ownership and port changes such as binding above 1024). Do the services in order of exposure, internet-facing first.
   - Then enforce it with Pod Security Admission. Run namespaces in `warn` or `audit` mode at the `restricted` or `baseline` level first, then switch to `enforce` once things are clean.

**Week 3: verify, tidy and prepare**

6. **Self-test.** Run kube-bench for the CIS benchmark, kubescape or Trivy for misconfigurations and image CVEs, and kubeletctl or a similar check for the kubelet. From inside a test pod, try to reach the API, other namespaces, the metadata service and the database. Fix what you find.
7. **Cover the other basics testers check.**
   - Image vulnerabilities: scan in CI and update base images.
   - Ingress and TLS: valid certificates and no admin or debug endpoints exposed.
   - Audit logging and alerts: enabled, and sent somewhere you will look.
   - Node and Kubernetes versions: patched.
   - No privileged pods, hostPath mounts or hostNetwork.
8. **Agree scope and rules with the testers.** Ask whether they get an in-cluster foothold or start from outside. If they start from inside, your RBAC and network controls will be tested directly. Tell your team and cloud provider about the dates, and keep a rollback path for anything you change right before the test.

**Rough sequencing**
- Days 1-2: dashboard closed, API endpoint restricted, secrets rotated.
- Days 3-7: secrets moved to a manager, per-workload service accounts, cluster-admin removed.
- Week 2: network policies in staging then prod, non-root rollout, Pod Security Admission in warn mode.
- Week 3: enforce, self-scan, fix leftovers, brief the testers.

**If time runs short, cut in this order:** drop the egress policies, then the read-only filesystem, then the git history purge. Don't cut the dashboard, secret rotation or cluster-admin removal. Those three are the ones most likely to be rated critical.

A few questions would let me tailor this: which provider (EKS, GKE or AKS), whether you use GitOps (Argo CD or Flux), and whether the dashboard is the upstream Kubernetes Dashboard or a vendor console. I can then write the actual manifests, such as the Role bindings, default-deny policies and securityContext patches, in whatever order you'd like.
