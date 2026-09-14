# Redwind Workshop 0.2.0 — rebuild notes

This is a rebrand/rebuild of the supplied Solaris Station `0.1.1` source archive. The original upload was not modified.

## What changed

- brand renamed to **Redwind Workshop** throughout the UI and metadata;
- new black / red / silver industrial-solarpunk visual system;
- reusable vector Redwind emblem component;
- dark field-node hero illustration with solar, radio, topographic, and technical annotation motifs;
- workshop instrumentation header and telemetry language;
- green/gold interaction system replaced by functional Redwind red and machine-silver states;
- project designations changed to `RW-*` codes;
- `/lab/` route retained for compatibility but presented as **Fields** / workshop disciplines;
- favicon, SVG maker marks, horizontal logo, badge, and brand reference added under `public/brand/` and `docs/`;
- package identity updated to `redwind-workshop` version `0.2.0`;
- static `preview-home.html` updated to provide a no-build visual reference.

## Verification performed

Static integrity checks passed for:

- Astro frontmatter structure;
- all local component/style imports;
- CSS brace balance;
- required project content fields;
- removal of obsolete Solaris branding from source content.

## Build verification limitation

A production Astro build could **not** be completed in the artifact environment because npm registry access timed out and `@astrojs/mdx` was not available in the local npm cache. This rebuild is therefore **not claimed as build-verified**.

On a normal machine with registry access, verify with:

```bash
npm install
npm run build
npm run dev
```

The source archive supplied by the user remains the immutable baseline; this rebuild is a new `0.2.0` artifact.
