import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/vue';
import type { Component } from 'vue';
import FeatureToggles from '../../components/ai/FeatureToggles/FeatureToggles.vue';
import SettingsPage from '../../components/ai/SettingsPage/SettingsPage.vue';
import UsageDashboard from '../../components/ai/UsageDashboard/UsageDashboard.vue';
import { createStorybookMockClient } from '../../components/ai/mockClient';

/** DaisyUI component classes the 1.x AI components used; none has styles in 2.0. */
const daisyClasses = [
  'alert',
  'btn',
  'form-control',
  'input',
  'input-bordered',
  'label-text',
  'loading',
  'select',
  'stat',
  'stats',
  'table',
  'textarea',
  'toggle',
];

const cases: [string, Component, string, string[]][] = [
  ['FeatureToggles', FeatureToggles, 'ai-feature-toggles', ['apui-toggle', 'apui-card']],
  [
    'SettingsPage',
    SettingsPage,
    'ai-settings-page',
    ['apui-form', 'apui-fieldset', 'apui-select', 'apui-input', 'apui-button'],
  ],
  ['UsageDashboard', UsageDashboard, 'ai-usage-dashboard', ['apui-stat', 'apui-table']],
];

describe('AI components on the design system', () => {
  it.each(cases)(
    '%s renders design-system components, not DaisyUI markup',
    async (_name, component, testId, expected) => {
      const { container } = render(component, {
        props: { client: createStorybookMockClient() },
      });
      await waitFor(
        () => {
          expect(container.querySelector(`[data-testid="${testId}"]`)).not.toBeNull();
          for (const name of expected) {
            expect(container.querySelector(`.${name}`), name).not.toBeNull();
          }
        },
        { timeout: 2000 },
      );

      const used = new Set(
        Array.from(container.querySelectorAll('[class]')).flatMap((el) => Array.from(el.classList)),
      );

      expect(daisyClasses.filter((name) => used.has(name))).toEqual([]);
    },
  );
});
