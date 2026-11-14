// @vitest-environment node
/**
 * API parity with the design-system manifests (#41) for the form editors
 * (#53): Signature, RichTextEditor and CodeEditor render the manifest's parts
 * and data attributes and declare exactly the manifest's props and emits.
 * Runs in Node because the kit renders on the server.
 */
import { describe, it } from 'vitest';
import {
  expectVueParity as expectParity,
  type VueParityOptions,
} from '@artisanpack-ui/testing/vue';
import { CodeEditor, RichTextEditor, Signature } from '../../components/form';

type KitComponent = Parameters<typeof expectParity>[0];

/**
 * The kit is linked from the design-system repo, so its `Component` type
 * comes from that repo's copy of Vue; cast instead of comparing the two.
 */
const expectVueParity = (component: unknown, name: string, options?: VueParityOptions) =>
  expectParity(component as KitComponent, name, options);

describe('design-system parity: form editors', () => {
  it('Signature matches its manifest', () =>
    expectVueParity(Signature, 'Signature', {
      // Shown only after an action, or only with optional parts.
      ignoreEffects: ['clearedLabel'],
    }));

  it('RichTextEditor matches its manifest', () =>
    expectVueParity(RichTextEditor, 'RichTextEditor', {
      // Shown only after an action, or only with optional parts.
      ignoreEffects: [
        'linkPromptLabel',
        'imagePromptLabel',
        'imageAltPromptLabel',
        'shortcutsLabel',
        'wordLabel',
        'wordsLabel',
        'characterLabel',
        'charactersLabel',
        'limitLabel',
      ],
    }));

  it('CodeEditor matches its manifest', () =>
    expectVueParity(CodeEditor, 'CodeEditor', {
      // Shown only after an action, or only with optional parts.
      ignoreEffects: [
        'languageLabel',
        'errorCountLabel',
        'errorsCountLabel',
        'warningCountLabel',
        'warningsCountLabel',
        'problemsLabel',
        'lineLabel',
        'severityErrorLabel',
        'severityWarningLabel',
        'severityInfoLabel',
      ],
    }));
});
