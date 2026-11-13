import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/vue';
import FeatureToggles from '../../components/ai/FeatureToggles/FeatureToggles.vue';
import { createMockClient } from './testClient';
import type { AiFeature } from '../../components/ai/types';

const features: AiFeature[] = [
  {
    key: 'summarize',
    package: 'core',
    label: 'Summarize',
    description: 'Short summaries',
    enabled: true,
  },
  { key: 'chat', package: 'core', label: 'Chat', description: null, enabled: false },
];

describe('FeatureToggles', () => {
  it('renders each registered feature and its enabled state', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
    });

    render(FeatureToggles, { props: { client, heading: 'AI Features' } });

    expect(await screen.findByText('Summarize')).toBeTruthy();
    expect(screen.getByText('Chat')).toBeTruthy();

    const summarizeToggle = screen.getByLabelText('Toggle Summarize') as HTMLInputElement;
    const chatToggle = screen.getByLabelText('Toggle Chat') as HTMLInputElement;
    expect(summarizeToggle.checked).toBe(true);
    expect(chatToggle.checked).toBe(false);
  });

  it('flips a toggle via POST /features/{key}/toggle and emits toggle', async () => {
    const toggle = vi
      .fn()
      .mockResolvedValue({ feature: { key: 'chat', package: 'core', enabled: true } });
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: toggle,
    });

    const { emitted } = render(FeatureToggles, { props: { client } });

    const chatToggle = await screen.findByLabelText('Toggle Chat');
    await fireEvent.click(chatToggle);

    await waitFor(() => expect(toggle).toHaveBeenCalledWith('chat', true));
    await waitFor(() => expect(emitted().toggle).toBeTruthy());
    expect(emitted().toggle[0]).toEqual([{ key: 'chat', package: 'core', enabled: true }]);
  });

  it('rolls the switch back and surfaces an error when the API rejects', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: vi.fn().mockRejectedValue(new Error('Boom')),
    });

    render(FeatureToggles, { props: { client } });

    const summarizeToggle = await screen.findByLabelText('Toggle Summarize');
    await fireEvent.click(summarizeToggle);

    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Boom'));
    expect((screen.getByLabelText('Toggle Summarize') as HTMLInputElement).checked).toBe(true);
  });

  it('clears a stale error after a subsequent successful toggle', async () => {
    const toggleFeature = vi
      .fn()
      .mockRejectedValueOnce(new Error('Boom'))
      .mockResolvedValueOnce({ feature: { key: 'chat', package: 'core', enabled: true } });
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature,
    });

    render(FeatureToggles, { props: { client } });

    const summarizeToggle = await screen.findByLabelText('Toggle Summarize');
    await fireEvent.click(summarizeToggle);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Boom'));

    const chatToggle = screen.getByLabelText('Toggle Chat');
    await fireEvent.click(chatToggle);

    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('renders empty state when no features are registered', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features: [] }),
    });

    render(FeatureToggles, { props: { client } });

    expect(await screen.findByText('No AI features registered.')).toBeTruthy();
  });
});
