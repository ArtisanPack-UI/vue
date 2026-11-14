/**
 * Writes `dist/<entry>.d.ts` for every subpath export.
 *
 * vue-tsc emits declarations next to each source file (`dist/components/form/index.d.ts`),
 * but `package.json` points each subpath at `dist/<entry>.d.ts`. Without these
 * re-export files, every subpath import resolves untyped (TS7016).
 *
 * Then it adds explicit extensions to every relative specifier in the emitted
 * declarations (`scripts/fix-declaration-specifiers.mjs` at the repository
 * root), so they resolve under `moduleResolution: node16` / `nodenext` too.
 */
import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { entries } from '../build-entries.mjs';
import { fixDeclarationSpecifiers } from '../../../scripts/fix-declaration-specifiers.mjs';

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

  // Explicit `.js` (TypeScript maps it to the `.d.ts`), so node16/nodenext resolve it.
  const specifier = './' + relative(dist, declaration).replace(/\.d\.ts$/, '.js');
  writeFileSync(target, `export * from '${specifier}';\n`);
}

const unresolved = fixDeclarationSpecifiers(dist);

if (unresolved.length > 0) {
  console.error(
    `Relative imports with no emitted declaration:\n  ${unresolved.map((entry) => relative(packageRoot, entry)).join('\n  ')}`,
  );
  process.exit(1);
}

if (missing.length > 0) {
  console.error(
    `Missing declarations, so these subpaths would ship untyped:\n  ${missing.join('\n  ')}`,
  );
  process.exit(1);
}
