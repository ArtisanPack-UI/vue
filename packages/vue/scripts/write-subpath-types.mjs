/**
 * Writes `dist/<entry>.d.ts` for every subpath export.
 *
 * vue-tsc emits declarations next to each source file (`dist/components/form/index.d.ts`),
 * but `package.json` points each subpath at `dist/<entry>.d.ts`. Without these
 * re-export files, every subpath import resolves untyped (TS7016).
 */
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { entries } from '../build-entries.mjs';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(packageRoot, 'dist');
const missing = [];

for (const [name, source] of Object.entries(entries)) {
  const declaration = join(dist, relative('src', source)).replace(/\.ts$/, '.d.ts');

  if (!existsSync(declaration)) {
    missing.push(relative(packageRoot, declaration));
    continue;
  }

  const target = join(dist, `${name}.d.ts`);

  if (target === declaration) {
    continue;
  }

  const specifier = './' + relative(dist, declaration).replace(/\.d\.ts$/, '');
  writeFileSync(target, `export * from '${specifier}';\n`);
}

if (missing.length > 0) {
  console.error(
    `Missing declarations, so these subpaths would ship untyped:\n  ${missing.join('\n  ')}`,
  );
  process.exit(1);
}
