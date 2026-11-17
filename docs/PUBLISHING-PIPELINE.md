# AI-assisted Redwind Workshop publishing

## Architecture

Existing Astro content collections already power project pages, chronological logs, project-side updates and homepage activity. No CMS or production API is needed.

ChatGPT/Codex writes public-safe milestone changes into an isolated branch and opens a pull request. GitHub Actions checks project references and builds the site. A human approves merges. Hermes can then observe changes to the approved master branch with tools/hermes-sync.sh.

**No automatic production deployment is part of Phase 1.** A separate, restricted deployment script can be added after inspection of the host, reverse proxy, service manager, backup procedure and rollback needs.

## New field log from JSON

Create a temporary JSON file with the following keys:

    {
      "slug": "sample-reticulum-milestone",
      "title": "Example only: Reticulum milestone",
      "date": "2026-11-17",
      "project": "reticulum-field-router",
      "kind": "milestone",
      "summary": "Placeholder: replace with verified observations.",
      "tags": ["Reticulum", "LoRa"],
      "body": "## Result\n\nDescribe tested progress and limitations."
    }

Never publish the example as a real milestone. Run:

    npm ci
    npm run add:log -- /tmp/milestone.json
    npm run check:content
    npm run build

The generator refuses to overwrite existing slugs, validates project references, kinds, and ISO dates. Astro's build validates the full frontmatter schema and MDX.

## Publication policy

- Explicitly confirmed project events only; do not silently publish chat transcripts.
- Prefer incremental, verifiable logs and preserve technical failures.
- Distinguish host/unit tests from hardware tests and deployments.
- Protect secrets, private topology, identity-linked information, sensitive logs and third-party media.
- For new projects, add a matching MDX project record before logs.
- CI success is not permission to deploy.

## Later deployment phase

On the hosting container, use a read-only checkout or deploy token and poll approved master commits. Build each commit in isolated staging, perform validation, atomically switch the static output directory, run a health check and roll back on failure. Record the deployed SHA separately from the observer SHA. Avoid exposing a management endpoint or sharing production SSH credentials with ChatGPT.
