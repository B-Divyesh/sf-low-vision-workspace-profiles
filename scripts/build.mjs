import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });

function run(bin, args) {
  execFileSync(bin, args, { cwd: root, stdio: 'inherit' });
}

run('npx', ['wxt', 'build']);
run('npx', ['wxt', 'zip']);
run('npx', ['vite', 'build', '--config', 'site/vite.config.ts']);

function findZip(directory) {
  if (!existsSync(directory)) return null;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const candidate = join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = findZip(candidate);
      if (nested) return nested;
    } else if (entry.name.endsWith('.zip')) return candidate;
  }
  return null;
}

const zip = findZip(dist) ?? findZip(join(root, '.output'));
if (!zip) throw new Error('WXT did not produce an extension zip.');
const downloads = join(dist, 'site', 'downloads');
mkdirSync(downloads, { recursive: true });
cpSync(zip, join(downloads, 'workspace-profiles-chrome.zip'));
console.log(`\nBuild complete: ${join(dist, 'site', 'index.html')}`);
