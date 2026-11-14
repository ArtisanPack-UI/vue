/**
 * Adds explicit file extensions to the relative imports and exports in a
 * package's emitted declarations, so they resolve under
 * `moduleResolution: node16` / `nodenext` as well as `bundler`.
 *
 * vue-tsc writes extensionless specifiers (`./components/form`,
 * `./Button/types`, `./Button/Button.vue`). These packages are ESM
 * (`"type": "module"`), and node16/nodenext resolution needs the extension, so
 * every subpath import resolved to nothing. Each specifier is pointed at the
 * emitted file the way TypeScript maps `.js` to `.d.ts`:
 *
 * - `./x` with `x.d.ts` beside it        -> `./x.js`
 * - `./x` with `x/index.d.ts`            -> `./x/index.js`
 * - `./Button.vue` with `Button.vue.d.ts` -> `./Button.vue.js`
 *
 * Bundler resolution maps `.js` to `.d.ts` too, so nothing changes there.
 *
 * Usage: node scripts/fix-declaration-specifiers.mjs <dist directory>
 * Or import `fixDeclarationSpecifiers(dist)`.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

/** `from '…'`, `import('…')` and side-effect `import '…'`, relative specifiers only. */
const SPECIFIER = /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)(['"])(\.\.?\/[^'"]*)\2/g;

function declarationFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return declarationFiles(path);
    return name.endsWith('.d.ts') ? [path] : [];
  });
}

/** Whether a line is inside a comment: `*`, `/*` or `//` first. */
function isComment(line) {
  return /^\s*(\*|\/\*|\/\/)/.test(line);
}

/** The specifier with its extension, or null when no emitted declaration matches. */
function withExtension(fromFile, specifier) {
  if (/\.(m|c)?js$/.test(specifier)) return specifier;
  const base = resolve(dirname(fromFile), specifier);
  if (existsSync(`${base}.d.ts`)) return `${specifier}.js`;
  if (existsSync(join(base, 'index.d.ts'))) return `${specifier.replace(/\/$/, '')}/index.js`;
  return null;
}

/**
 * Rewrites every declaration file under `dist`. Returns the specifiers it
 * couldn't match to an emitted declaration, as `file: specifier`.
 */
export function fixDeclarationSpecifiers(dist) {
  const unresolved = [];
  for (const file of declarationFiles(dist)) {
    const source = readFileSync(file, 'utf8');
    const fixed = source
      .split('\n')
      .map((line) =>
        // Doc comments (`@example` blocks) aren't code; leave their imports alone.
        isComment(line)
          ? line
          : line.replace(SPECIFIER, (match, keyword, quote, specifier) => {
              const next = withExtension(file, specifier);
              if (next === null) {
                unresolved.push(`${file}: ${specifier}`);
                return match;
              }
              return `${keyword}${quote}${next}${quote}`;
            }),
      )
      .join('\n');
    if (fixed !== source) writeFileSync(file, fixed);
  }
  return unresolved;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dist = process.argv[2];
  if (!dist) {
    console.error('Usage: node scripts/fix-declaration-specifiers.mjs <dist directory>');
    process.exit(1);
  }
  const unresolved = fixDeclarationSpecifiers(resolve(dist));
  if (unresolved.length > 0) {
    console.error(`Relative imports with no emitted declaration:\n  ${unresolved.join('\n  ')}`);
    process.exit(1);
  }
}
