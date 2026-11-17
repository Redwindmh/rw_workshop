#!/usr/bin/env node
// Generate public field logs safely and validate links between existing logs and projects.
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = join(root, 'src/content/projects');
const logsDir = join(root, 'src/content/logs');
const kinds = new Set(['discovery','experiment','build','milestone','failure','field-test','design','repair','research']);

async function sourceFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await sourceFiles(path));
    else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) found.push(path);
  }
  return found.sort();
}

function metadata(source, path) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('Missing frontmatter in ' + path);
  const map = new Map();
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_]+):[ \t]*(.*)$/);
    if (m) map.set(m[1], m[2].trim());
  }
  return map;
}

function field(meta, name) {
  const value = meta.get(name);
  if (!value) return '';
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1,-1).replaceAll("''","'");
  return value;
}

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === value;
}

function nonempty(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(name + ' must be a nonempty string');
  return value.trim();
}

async function projectIds() {
  const ids = new Set(), codes = new Set();
  for (const path of await sourceFiles(projectsDir)) {
    const id = relative(projectsDir, path).replaceAll('\\','/').replace(/\.(md|mdx)$/i,'');
    const meta = metadata(await readFile(path,'utf8'),path);
    const code = field(meta,'code');
    if (!code || codes.has(code)) throw new Error('Missing or duplicate project code in ' + path);
    codes.add(code);
    ids.add(id);
  }
  return ids;
}

async function check() {
  const ids = await projectIds();
  const errors = [];
  let count = 0;
  for (const path of await sourceFiles(logsDir)) {
    count++;
    try {
      const meta = metadata(await readFile(path,'utf8'),path);
      if (!field(meta,'title') || !field(meta,'summary')) errors.push(path + ': missing title or summary');
      if (!ids.has(field(meta,'project'))) errors.push(path + ': unknown project: ' + field(meta,'project'));
      if (!kinds.has(field(meta,'kind'))) errors.push(path + ': invalid kind');
      if (!validDate(field(meta,'date'))) errors.push(path + ': invalid date');
    } catch (e) { errors.push(path + ': ' + e.message); }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('Content references verified: ' + ids.size + ' projects, ' + count + ' logs');
}

async function addLog(recordPath) {
  if (!recordPath) throw new Error('Provide a JSON milestone path');
  await check();
  const item = JSON.parse(await readFile(resolve(process.cwd(),recordPath),'utf8'));
  const slug = nonempty(item.slug,'slug');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Invalid slug');
  const title = nonempty(item.title,'title');
  const summary = nonempty(item.summary,'summary');
  const project = nonempty(item.project,'project');
  const kind = nonempty(item.kind,'kind');
  const date = nonempty(item.date,'date');
  const body = nonempty(item.body,'body');
  const tags = item.tags ?? [];
  if (!Array.isArray(tags) || !tags.every(x => typeof x === 'string' && x.trim())) throw new Error('Invalid tags array');
  if (!(await projectIds()).has(project)) throw new Error('Unknown project: ' + project);
  if (!kinds.has(kind)) throw new Error('Unsupported log kind: ' + kind);
  if (!validDate(date)) throw new Error('Invalid ISO date: ' + date);
  const mdx = ['---','title: ' + JSON.stringify(title),'date: ' + date,
    'project: ' + JSON.stringify(project),'kind: ' + JSON.stringify(kind),
    'summary: ' + JSON.stringify(summary),'tags: [' + tags.map(x => JSON.stringify(x.trim())).join(', ') + ']',
    '---','',body,''].join('\n');
  const destination = join(logsDir, slug + '.mdx');
  await writeFile(destination,mdx,{encoding:'utf8',flag:'wx'});
  console.log('Created ' + relative(root,destination));
}

try {
  const [command,arg] = process.argv.slice(2);
  if (command === 'check') await check();
  else if (command === 'add-log') await addLog(arg);
  else throw new Error('Usage: node tools/field-log.mjs check | add-log milestone.json');
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
}
