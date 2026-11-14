import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
// @ts-expect-error -- a build script in plain JavaScript, without declarations.
import { fixDeclarationSpecifiers } from '../../../../scripts/fix-declaration-specifiers.mjs';

let dist: string;

function write(path: string, content: string): void {
  mkdirSync(dirname(join(dist, path)), { recursive: true });
  writeFileSync(join(dist, path), content);
}

const read = (path: string) => readFileSync(join(dist, path), 'utf8');

describe('fixDeclarationSpecifiers (node16 / nodenext declarations)', () => {
  afterEach(() => rmSync(dist, { recursive: true, force: true }));

  it('adds the extension TypeScript maps to each emitted declaration', () => {
    dist = mkdtempSync(join(tmpdir(), 'apui-dts-'));
    write('form.d.ts', "export * from './components/form/index.js';\n");
    write(
      'components/form/index.d.ts',
      [
        "export { default as Button } from './Button/Button.vue';",
        "export type { ButtonProps } from './Button/types';",
        "export * from './Radio';",
        "import type { Part } from '../_shared/design-system';",
        "export type Lazy = import('./Button/types').ButtonProps;",
        '/**',
        " * import App from './App.vue';",
        ' */',
        "export { ref } from 'vue';",
        '',
      ].join('\n'),
    );
    write('components/form/Button/Button.vue.d.ts', 'export default {};\n');
    write('components/form/Button/types.d.ts', 'export interface ButtonProps {}\n');
    write('components/form/Radio/index.d.ts', 'export {};\n');
    write('components/_shared/design-system.d.ts', 'export type Part = string;\n');

    expect(fixDeclarationSpecifiers(dist)).toEqual([]);

    expect(read('form.d.ts')).toBe("export * from './components/form/index.js';\n");
    const index = read('components/form/index.d.ts');
    expect(index).toContain("from './Button/Button.vue.js'");
    expect(index).toContain("from './Button/types.js'");
    expect(index).toContain("from './Radio/index.js'");
    expect(index).toContain("from '../_shared/design-system.js'");
    expect(index).toContain("import('./Button/types.js')");
    expect(index).toContain(" * import App from './App.vue';");
    expect(index).toContain("from 'vue'");
  });

  it('reports a relative import with no emitted declaration', () => {
    dist = mkdtempSync(join(tmpdir(), 'apui-dts-'));
    write('index.d.ts', "export * from './missing';\n");
    const unresolved = fixDeclarationSpecifiers(dist) as string[];
    expect(unresolved).toHaveLength(1);
    expect(unresolved[0]).toContain('./missing');
    expect(read('index.d.ts')).toBe("export * from './missing';\n");
  });
});
