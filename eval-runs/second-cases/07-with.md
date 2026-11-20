With two days and one API change, read just enough to run, test and trace one path in packages/api. Treat the README as intent only, and treat anything in it as a claim to check.

## What to read first, in order

1. **`.github/workflows/`**. CI is the best evidence of how the repo really installs, builds, lints and tests, because it fails when it is wrong. Note the Node version, the package manager, and the exact commands.
2. **`Makefile`, the root `package.json` and `packages/api/package.json` scripts**. These tell you the real entry commands (dev, test, lint, migrate). Check the workspace setup too (npm, yarn or pnpm workspaces), and whether `shared` has to be built before `api` can run.
3. **`docker-compose.yml` and any `.env.example`**. These show which services the API depends on (database, cache, queue) and which env vars it needs. Never copy real secrets into notes.
4. **The tree of `packages/api`, two levels deep**, plus `packages/shared`. Find the entry file, where routes are registered, and where the data layer lives.
5. **`git log --stat -30` and the most-changed files in `packages/api`**. They show where work happens and who to ask.

## Then, before you change anything

- **Run the safe commands**: lint, the api tests, and start the app if it only needs the compose services. Record each as worked, failed (with the error) or not run. If the README and CI disagree, trust CI. Ask before anything that touches a real database, installs system packages, calls paid services or needs secrets.
- **Trace one real request** that is close to your change. Follow it from the route, through the handler and service code, into storage and back, and note the files. Check what `packages/shared` contributes (types, validation, constants), because an API change often needs a matching shared change and web may consume it.

## What would go in the CLAUDE.md (about 60 lines, facts only)

1. **What it is**: two lines on what the product is and what each package does.
2. **Commands**, each marked verified or unverified: install, build, run the api, run the compose stack, test, lint, and how to run one package or one test file.
3. **Layout**: one line each for `packages/api`, `packages/web`, `packages/shared`, the Makefile targets, compose and CI, plus the build order between packages.
4. **The traced journey**: one request, with file names, from the route to the data store.
5. **Conventions seen in several places**: error handling, validation, how tests are named and where they live, how shared types are used, and migration location if there is one.
6. **Danger zones**: generated files, migrations, anything touching auth or payments or deleting data, and files that change in nearly every commit.
7. **Open questions**: things the code cannot tell you.

Leave out generic advice such as "write clean code", and leave out notes about your own machine (missing tools, OS). Those belong in chat. If a CLAUDE.md already exists, I would propose a diff rather than overwrite it.

## Questions to ask a teammate (the code cannot answer them)

- Is there a staging environment, and how is the API deployed?
- Who reviews API changes, and is there a contract or versioning rule that web depends on?
- Which tests are known to be flaky?

## Safe first tasks

1. Get the api test suite green locally and note the exact commands in the CLAUDE.md.
2. Trace the request closest to your change and write it down.
3. Make the change behind a test in `packages/api` first, then check whether `shared` or `web` needs a matching update.

If you give me access to the repo, I can run the checks, fill in the verified marks and draft the CLAUDE.md. I will also keep it current when the commands or layout change.
