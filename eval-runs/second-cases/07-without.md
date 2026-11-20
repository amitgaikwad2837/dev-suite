Two days is enough if you read for the one path your change touches and skip the rest. I haven't seen your repo, so this is what I would do and what I would put in the CLAUDE.md. Once I've read the files I'd replace the guesses below with the real names and commands.

## What to read first, in order

**1. Root `package.json` and the workspace config (about 5 minutes).**
- Read `workspaces`, plus `pnpm-workspace.yaml` or `turbo.json` or `nx.json` if they exist. This tells you the package manager and whether there is a task runner.
- Read the root `scripts`. They are the real list of commands: build, test, lint, dev.
- Check `.nvmrc`, `.node-version` and the `engines` field for the Node version.

**2. The Makefile (about 5 minutes).**
Teams with a useless README usually keep the real workflow here. The targets (`make up`, `make test`, `make migrate`, `make seed` and so on) are your setup instructions. Note which ones need Docker.

**3. `docker-compose.yml` (about 5 minutes).**
- It shows what the api depends on: Postgres, Redis, a queue, a mock service.
- It lists the ports, the env vars and the volume mounts.
- It tells you which services you must run locally and which you can skip.

**4. `.github/workflows/` (about 10 minutes).**
- CI is the most trustworthy description of how to build and test, because it has to work from a clean checkout.
- Copy the exact install, build, lint, typecheck and test commands.
- Note any services spun up for tests, any required env vars, and the order of steps. That is how you pass CI on your first PR.

**5. `packages/api`, from the outside in (about 1 hour).**
- Read its `package.json` (scripts, dependencies, whether it imports `shared`) and the entry point, usually `src/index.ts`, `server.ts` or `app.ts`.
- Find the router or route registration. Pick one existing endpoint close to the one you'll change and follow it end to end: route, validation, handler or service, data access, response.
- Look at that endpoint's test. Copy its pattern for yours.
- Find the config and env loading, the error handling convention, and the auth middleware.

**6. `packages/shared` (about 20 minutes).**
Look at what it exports: types, schemas, constants. If your API change alters a request or response shape, it probably touches the shared types, and `packages/web` may consume them. That is the main way a "small api change" breaks something else in a monorepo. Search `packages/web` for usages of what you plan to change.

**7. `git log` and recent merged PRs for `packages/api`.**
`git log --oneline -30 -- packages/api` shows what a typical change looks like, what the commit style is, and who owns the area. Read one or two recent PRs that touched an endpoint. They show the expected shape of a change (tests, docs, a migration) better than any readme.

**Skip for now:** `packages/web` internals, old docs, and the config files for linters and formatters.

## Order of work on day one
1. Get it running: install, `docker compose up`, hit one endpoint, run the api tests.
2. Confirm the tests pass before you change anything, so you know what "green" is.
3. Trace the nearby endpoint and write down the files you expect to touch.
4. Ask your teammate the questions the code can't answer (below).

Then make the change on day two with time left for review feedback.

## Questions to ask a teammate (about 15 minutes of their time)
- Which env vars and secrets do I need, and where do I get them?
- Is there a seed or fixture database?
- Is there an API contract or OpenAPI spec I have to update?
- Does the change need a migration, a feature flag or a changelog entry?
- What does a PR need to merge: who reviews, and which checks are required?

## What would go in a CLAUDE.md
Keep it short and made of facts you verified. Don't invent commands. Anything you couldn't confirm gets marked "unverified" or left out.

```markdown
# CLAUDE.md

## Layout
- packages/api    - backend (framework: <fill in>, entry: <path>)
- packages/web    - frontend (<framework>)
- packages/shared - types/schemas used by api and web
- Package manager: <npm|pnpm|yarn>, Node <version>

## Commands (verified)
- Install: <cmd>
- Start dependencies: docker compose up -d <services>   (or make <target>)
- Run api in dev: <cmd>
- Test api: <cmd>          Test one file: <cmd>
- Lint / typecheck: <cmd>
- Build shared first if api imports it: <cmd>
- Migrate / seed: <cmd>
- CI runs: <the workflow's commands, in order>

## Environment
- Copy .env.example to .env; required vars: <names only, no secrets>
- Ports: api <n>, db <n>

## Conventions
- Where routes live, how handlers are structured, where validation happens
- Error response shape and logging approach
- Tests sit next to code / in __tests__; name pattern <x>
- Commit and PR style: <from git log>

## Gotchas
- Changing a type in packages/shared affects web; run <cmd> in both
- <anything that cost you time: flaky test, order-dependent build, needed Docker flag>

## Do not
- Edit generated files in <path>
- Commit .env or secrets
```

Update it as you go. Whenever you hit a surprise during the two days, add a line. A CLAUDE.md that comes out of your own onboarding is more accurate than one written up front, and it will help the next person who joins.

If you tell me which package manager and framework the api uses, or paste the Makefile and the CI workflow, I can fill in the commands section for real and point you at the likely files for your change.
