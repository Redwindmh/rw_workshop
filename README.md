# Redwind Workshop

A content-driven personal engineering log built with Astro.

This `0.2.0` rebuild establishes the **Redwind Workshop** identity: black-dominant industrial solarpunk, deep red functional accents, silver technical linework, field-system instrumentation, and botanical/circuit motifs.

## Design system

- near-black and graphite structural surfaces;
- Redwind red for active states, annotations, progress, and interaction;
- silver/off-white typography and technical drawing;
- reusable three-wind-strokes-over-horizon brand mark;
- field-node, radio, PCB, topographic, and workshop-schematic motifs;
- the standing motto: **Build · Learn · Document · Share**.

## Site structure

- homepage dashboard;
- project catalogue and project detail pages;
- chronological field logs and log detail pages;
- disciplines/fields page (route retained at `/lab/` for compatibility);
- archive index;
- current-work status page;
- workshop profile/about page;
- live JST clock in the workshop header.

## Development

```bash
npm install
npm run dev
```

Build production output with:

```bash
npm run build
```

## Content automation

Project pages and field logs already use Astro content collections. New field logs can be generated with `npm run add:log -- path/to/record.json`, validated using `npm run check:content`, and tested with `npm run build`. Propose changes via reviewed pull requests. See [publishing documentation](docs/PUBLISHING-PIPELINE.md) and [Hermes handoff](docs/HERMES-HANDOFF.md). Phase 1 does not deploy.
