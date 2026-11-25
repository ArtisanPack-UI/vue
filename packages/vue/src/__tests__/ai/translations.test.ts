import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h, type Component } from 'vue';
import { TranslationProvider, type TranslationMessages } from '../../i18n/translator';
import FeatureToggles from '../../components/ai/FeatureToggles/FeatureToggles.vue';
import SettingsPage from '../../components/ai/SettingsPage/SettingsPage.vue';
import UsageDashboard from '../../components/ai/UsageDashboard/UsageDashboard.vue';
import { createMockClient } from './testClient';
import type { AiSettingsResponse, AiUsageResponse } from '../../components/ai/types';

const de: TranslationMessages = {
  'No AI features registered.': 'Keine KI-Funktionen registriert.',
  'Something went wrong.': 'Etwas ist schiefgelaufen.',
  Credentials: 'Zugangsdaten',
  'Save settings': 'Einstellungen speichern',
  Requests: 'Anfragen',
  'Live · refreshing every :seconds s': 'Live · Aktualisierung alle :seconds s',
};

/** Renders `component` under a German provider. */
function renderDe(component: Component, props: Record<string, unknown>) {
  return render(() =>
    h(TranslationProvider, { locale: 'de', messages: de }, () => h(component, props)),
  );
}

const settings: AiSettingsResponse = {
  credentials: {
    provider: 'openai',
    api_key_present: true,
    base_url: null,
    default_model: 'gpt-4o-mini',
  },
  feature_overrides: [],
};

const usage: AiUsageResponse = {
  range: { from: '2026-07-01T00:00:00+00:00', to: '2026-07-31T23:59:59+00:00' },
  totals: { requests: 1234, input_tokens: 0, output_tokens: 0, total_tokens: 0, cost: 0 },
  by_feature: [],
  daily: [],
};

describe('AI translations', () => {
  it('translates FeatureToggles, with labels still winning', async () => {
    const client = createMockClient({ getFeatures: vi.fn().mockResolvedValue({ features: [] }) });
    renderDe(FeatureToggles, { client });
    expect(await screen.findByText('Keine KI-Funktionen registriert.')).toBeTruthy();
    document.body.innerHTML = '';

    renderDe(FeatureToggles, { client, labels: { empty: 'Nothing here.' } });
    expect(await screen.findByText('Nothing here.')).toBeTruthy();
  });

  it('translates the generic FeatureToggles error', async () => {
    const client = createMockClient({ getFeatures: vi.fn().mockRejectedValue(null) });
    renderDe(FeatureToggles, { client });
    expect(await screen.findByText('Etwas ist schiefgelaufen.')).toBeTruthy();
  });

  it('translates SettingsPage, with labels still winning', async () => {
    const client = createMockClient({ getSettings: vi.fn().mockResolvedValue(settings) });
    renderDe(SettingsPage, { client, labels: { save: 'Store' } });
    expect(await screen.findByText('Zugangsdaten')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Store' })).toBeTruthy();
    expect(screen.queryByText('Einstellungen speichern')).toBeNull();
  });

  it("translates UsageDashboard and formats numbers in the provider's locale", async () => {
    const client = createMockClient({ getUsage: vi.fn().mockResolvedValue(usage) });
    renderDe(UsageDashboard, { client, refreshInterval: 5000 });
    expect((await screen.findAllByText('Anfragen')).length).toBeGreaterThan(0);
    expect(screen.getByText('1.234')).toBeTruthy();
    expect(screen.getByText('Live · Aktualisierung alle 5 s')).toBeTruthy();
  });
});
