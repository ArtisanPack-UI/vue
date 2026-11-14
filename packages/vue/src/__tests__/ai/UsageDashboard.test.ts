import { afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import UsageDashboard from '../../components/ai/UsageDashboard/UsageDashboard.vue';
import { createMockClient } from './testClient';
import type { AiUsageResponse } from '../../components/ai/types';

const usage: AiUsageResponse = {
  range: { from: '2026-07-01T00:00:00+00:00', to: '2026-07-31T23:59:59+00:00' },
  totals: { requests: 12, input_tokens: 1000, output_tokens: 500, total_tokens: 1500, cost: 0.42 },
  by_feature: [
    {
      feature_key: 'summarize',
      requests: 8,
      input_tokens: 800,
      output_tokens: 300,
      total_tokens: 1100,
      cost: 0.3,
    },
  ],
  daily: [
    {
      period: '2026-07-01',
      requests: 5,
      input_tokens: 500,
      output_tokens: 250,
      total_tokens: 750,
      cost: 0.21,
    },
  ],
};

describe('UsageDashboard', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders totals, by_feature, and daily buckets from GET /usage', async () => {
    const client = createMockClient({ getUsage: vi.fn().mockResolvedValue(usage) });

    render(UsageDashboard, { props: { client, heading: 'Usage' } });

    expect(await screen.findByText('Usage')).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('summarize')).toBeTruthy();
    expect(screen.getByText('2026-07-01')).toBeTruthy();
  });

  it('forwards from/to as query params to the API client', async () => {
    const getUsage = vi.fn().mockResolvedValue(usage);
    const client = createMockClient({ getUsage });

    render(UsageDashboard, { props: { client, from: '2026-07-01', to: '2026-07-15' } });

    await screen.findByText('12');
    expect(getUsage).toHaveBeenCalledWith({ from: '2026-07-01', to: '2026-07-15' });
  });

  it('polls at refreshInterval for live updates', async () => {
    vi.useFakeTimers();
    const getUsage = vi.fn().mockResolvedValue(usage);
    const client = createMockClient({ getUsage });

    render(UsageDashboard, { props: { client, refreshInterval: 1000 } });

    await vi.waitFor(() => expect(getUsage).toHaveBeenCalledTimes(1));
    await vi.advanceTimersByTimeAsync(3000);
    expect(getUsage).toHaveBeenCalledTimes(4);

    vi.useRealTimers();
  });

  it('reloads when from/to props change', async () => {
    const getUsage = vi.fn().mockResolvedValue(usage);
    const client = createMockClient({ getUsage });

    const { rerender } = render(UsageDashboard, { props: { client, from: '2026-07-01' } });
    await screen.findByText('12');
    expect(getUsage).toHaveBeenCalledWith({ from: '2026-07-01', to: undefined });

    await rerender({ client, from: '2026-07-15', to: '2026-07-30' });

    await vi.waitFor(() =>
      expect(getUsage).toHaveBeenLastCalledWith({ from: '2026-07-15', to: '2026-07-30' }),
    );
  });

  it('surfaces a fetch error when the initial load fails', async () => {
    const client = createMockClient({ getUsage: vi.fn().mockRejectedValue(new Error('Nope')) });

    render(UsageDashboard, { props: { client } });

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Nope');
  });

  it('keeps updating when each poll takes longer than the interval', async () => {
    vi.useFakeTimers();
    const getUsage = vi.fn(
      () => new Promise<AiUsageResponse>((resolve) => setTimeout(() => resolve(usage), 1500)),
    );
    const client = createMockClient({ getUsage });

    render(UsageDashboard, { props: { client, refreshInterval: 1000 } });

    await vi.advanceTimersByTimeAsync(1500);
    expect(screen.getByText('12')).toBeTruthy();

    // Each poll waits for the previous one: request, then 1000 ms, then request.
    await vi.advanceTimersByTimeAsync(5000);
    expect(getUsage).toHaveBeenCalledTimes(3);
  });

  it("drops the previous range's figures when a new range fails to load", async () => {
    const getUsage = vi
      .fn()
      .mockResolvedValueOnce(usage)
      .mockRejectedValueOnce(new Error('Range failed'));
    const client = createMockClient({ getUsage });

    const { rerender } = render(UsageDashboard, { props: { client, from: '2026-07-01' } });
    await screen.findByText('12');

    await rerender({ client, from: '2026-08-01' });

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Range failed');
    expect(screen.queryByText('12')).toBeNull();
  });

  it('keeps the last figures with a warning when a poll fails', async () => {
    vi.useFakeTimers();
    const getUsage = vi.fn().mockResolvedValueOnce(usage).mockRejectedValueOnce(new Error('Blip'));
    const client = createMockClient({ getUsage });

    render(UsageDashboard, { props: { client, refreshInterval: 1000 } });
    await vi.advanceTimersByTimeAsync(0);
    expect(screen.getByText('12')).toBeTruthy();

    await vi.advanceTimersByTimeAsync(1000);
    expect(screen.getByText(/Couldn't refresh usage/)).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('translates its stats, tables and status through labels', async () => {
    const client = createMockClient({ getUsage: vi.fn().mockResolvedValue(usage) });

    render(UsageDashboard, {
      props: {
        client,
        refreshInterval: 60000,
        labels: {
          requests: 'Requêtes',
          inputTokens: 'Jetons entrants',
          byFeature: 'Par fonctionnalité',
          daily: 'Par jour',
          feature: 'Fonctionnalité',
          day: 'Jour',
          live: 'En direct · toutes les :seconds s',
        },
      },
    });

    expect(await screen.findByText('Jetons entrants')).toBeTruthy();
    expect(screen.getAllByText('Requêtes').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('Par fonctionnalité')).toBeTruthy();
    expect(screen.getByText('Par jour')).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Fonctionnalité/ })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Jour/ })).toBeTruthy();
    expect(screen.getByText('En direct · toutes les 60 s')).toBeTruthy();
    expect(screen.getByText('Output tokens')).toBeTruthy();
  });

  it('keeps the English live status by default', async () => {
    const client = createMockClient({ getUsage: vi.fn().mockResolvedValue(usage) });
    render(UsageDashboard, { props: { client, refreshInterval: 5000 } });
    expect(await screen.findByText('Live · refreshing every 5s')).toBeTruthy();
  });

  it('translates the loading text and the fallback error', async () => {
    const client = createMockClient({ getUsage: vi.fn().mockRejectedValue(null) });
    render(UsageDashboard, {
      props: { client, labels: { loading: 'Chargement…', genericError: 'Erreur inconnue.' } },
    });
    expect(screen.getByText('Chargement…')).toBeTruthy();
    expect(await screen.findByText('Erreur inconnue.')).toBeTruthy();
  });
});
