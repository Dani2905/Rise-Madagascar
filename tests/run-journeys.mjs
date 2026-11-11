import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, `.journey-tests-${process.pid}.cjs`);
try {
  for (const name of ['journeys.mjs', 'tracking.mjs', 'mail.mjs', 'privacy.mjs', 'contacts.mjs', 'student-search.mjs', 'global-search.mjs', 'global-filters.mjs', 'recruiter-mail.mjs', 'following.mjs', 'recruiter-search.mjs']) {
    await build({ entryPoints: [resolve(root, 'tests', name)], outfile: output, bundle: true, platform: 'node', format: 'cjs', packages: 'external', logLevel: 'warning' });
    const result = spawnSync(process.execPath, [output], { cwd: root, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) { process.exitCode = result.status ?? 1; break; }
  }
} finally { await unlink(output).catch(() => {}); }
