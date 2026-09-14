import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projectStatus = z.enum(['active', 'research', 'paused', 'complete', 'archived']);
const logKind = z.enum(['discovery', 'experiment', 'build', 'milestone', 'failure', 'field-test', 'design', 'repair', 'research']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    code: z.string(),
    category: z.string(),
    icon: z.string().default('spark'),
    summary: z.string(),
    status: projectStatus,
    progress: z.number().int().min(0).max(100),
    started: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    mission: z.string().optional(),
  }),
});

const logs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/logs' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    project: z.string(),
    kind: logKind,
    summary: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, logs };
