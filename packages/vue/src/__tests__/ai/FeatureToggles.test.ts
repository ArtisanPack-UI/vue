import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/vue';
import FeatureToggles from '../../components/ai/FeatureToggles/FeatureToggles.vue';
import { createMockClient, deferred } from './testClient';
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

    const summarizeToggle = screen.getByRole('switch', { name: 'Summarize' }) as HTMLInputElement;
    const chatToggle = screen.getByRole('switch', { name: 'Chat' }) as HTMLInputElement;
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

    const chatToggle = await screen.findByRole('switch', { name: 'Chat' });
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

    const summarizeToggle = await screen.findByRole('switch', { name: 'Summarize' });
    await fireEvent.click(summarizeToggle);

    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Boom'));
    expect((screen.getByRole('switch', { name: 'Summarize' }) as HTMLInputElement).checked).toBe(
      true,
    );
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

    const summarizeToggle = await screen.findByRole('switch', { name: 'Summarize' });
    await fireEvent.click(summarizeToggle);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Boom'));

    const chatToggle = screen.getByRole('switch', { name: 'Chat' });
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

  it('keeps the switch on when a toggle listener throws after a successful save', async () => {
    const client = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: vi
        .fn()
        .mockResolvedValue({ feature: { key: 'chat', package: 'core', enabled: true } }),
    });
    const onToggle = vi.fn(() => {
      throw new Error('listener failed');
    });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(FeatureToggles, { props: { client, onToggle } });
    const chatToggle = (await screen.findByRole('switch', { name: 'Chat' })) as HTMLInputElement;
    await fireEvent.click(chatToggle);

    await waitFor(() => expect(onToggle).toHaveBeenCalled());
    expect(chatToggle.checked).toBe(true);
    expect(screen.queryByRole('alert')).toBeNull();
    consoleError.mockRestore();
    consoleWarn.mockRestore();
  });

  it("hides the previous client's features and ignores its late toggle results", async () => {
    const pendingToggle = deferred<never>();
    const first = createMockClient({
      getFeatures: vi.fn().mockResolvedValue({ features }),
      toggleFeature: vi.fn().mockReturnValue(pendingToggle.promise),
    });
    const secondFeatures = deferred<{ features: AiFeature[] }>();
    const second = createMockClient({
      getFeatures: vi.fn().mockReturnValue(secondFeatures.promise),
    });

    const { rerender } = render(FeatureToggles, { props: { client: first } });
    await fireEvent.click(await screen.findByRole('switch', { name: 'Chat' }));

    await rerender({ client: second });
    expect(screen.queryByRole('switch')).toBeNull();

    secondFeatures.resolve({ features: [{ ...features[1], enabled: true }] });
    const secondChat = (await screen.findByRole('switch', { name: 'Chat' })) as HTMLInputElement;

    pendingToggle.reject(new Error('stale failure'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(secondChat.checked).toBe(true);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
