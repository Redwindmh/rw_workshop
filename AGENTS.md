# Redwind Workshop agent instructions

This Astro/MDX site is **public**. A private ChatGPT conversation does not imply permission to publish its contents.

- Profiles are in src/content/projects; logs are in src/content/logs.
- Use src/content.config.ts for field names, kinds and statuses. Log project values match project filename IDs.
- Document actual dated progress, distinguish planned / implemented / host-tested / hardware-tested / verified.
- Never invent versions, milestones, completion percentages or test results. Do not increase manual completion percentages by guessing.
- Never publish passwords, private network identifiers, personally identifying information, internal debug logs, confidential conversations, copyrighted ROMs or unlicensed material.
- Prefer additive logs rather than altering historical entries.
- Generate logs using npm run add:log -- path/to/record.json.
- Before submitting: npm run check:content && npm run build. If checks could not run, report that.
- Create a feature branch and PR. Do not merge or deploy without approval.
- Hermes only observes approved master changes in Phase 1. It must not alter the live site.

See docs/PUBLISHING-PIPELINE.md and docs/HERMES-HANDOFF.md.
