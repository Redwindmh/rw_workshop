# Hermes integration: read-only handoff

This repository contains a **prepared** observer, not a running Hermes job.

1. On the hosting container, determine the existing website checkout, service manager, build location, document root and rollback procedure. Never print tokens or private network details.
2. Obtain a separate, safe staging checkout with origin pointing to Redwindmh/rw_workshop and master as the approved branch.
3. After the pull request containing these tools is reviewed and merged, run:

    bash tools/hermes-sync.sh /path/to/staging/checkout

4. The script fetches and reports changes in origin/master without changing the working tree or production website. Its last-observed SHA is stored in ~/.local/state/redwind-workshop.
5. Run npm ci, npm run check:content and npm run build in a disposable checkout as a validation test.
6. Only after the first observer result is inspected, configure an appropriately restricted recurring Hermes task.

## Standing Hermes prompt

Inspect approved Redwind Workshop master changes using tools/hermes-sync.sh and report meaningful project progress and errors. Honor AGENTS.md and docs/PUBLISHING-PIPELINE.md. Do not publish raw chats, merge PRs, deploy, restart services, modify the live site, expose secrets, or infer hardware testing. Escalate rewritten Git history for manual review.

## Before enabling deployment

Implement a separate least-privilege staged build, atomic activation, health check and rollback procedure. Keep observed and deployed SHAs separate. Do not grant unrestricted production shell access to remote agents.
