import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/vue';
import SettingsPage from '../../components/ai/SettingsPage/SettingsPage.vue';
import { AiApiError } from '../../components/ai/createAiApiClient';
import { createMockClient, deferred } from './testClient';
import type { AiSettingsResponse } from '../../components/ai/types';

const baseResponse: AiSettingsResponse = {
  credentials: {
    provider: 'openai',
    api_key_present: true,
    base_url: null,
    default_model: 'gpt-4o-mini',
  },
  feature_overrides: [
    { feature_key: 'summarize', package: 'core', model: null, instructions: null },
  ],
};

describe('SettingsPage', () => {
  it('loads and renders the current settings', async () => {
    const client = createMockClient({ getSettings: vi.fn().mockResolvedValue(baseResponse) });

    render(SettingsPage, { props: { client, heading: 'AI Settings' } });

    expect(await screen.findByRole('heading', { name: 'AI Settings' })).toBeTruthy();
    expect((screen.getByPlaceholderText('gpt-4o-mini') as HTMLInputElement).value).toBe(
      'gpt-4o-mini',
    );
    expect(screen.getByText(/leave blank to keep the stored key/i)).toBeTruthy();
  });

  it('submits the form via PUT /settings and shows a success status', async () => {
    const update = vi.fn().mockResolvedValue({
      ...baseResponse,
      credentials: { ...baseResponse.credentials, default_model: 'gpt-4o' },
    });
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings: update,
    });

    render(SettingsPage, { props: { client } });

    const modelInput = (await screen.findByPlaceholderText('gpt-4o-mini')) as HTMLInputElement;
    await fireEvent.update(modelInput, 'gpt-4o');

    await fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));

    await waitFor(() => expect(update).toHaveBeenCalled());
    const payload = update.mock.calls[0][0];
    expect(payload.default_model).toBe('gpt-4o');
    // A blank key field means "keep the stored key", so the key is omitted.
    expect(payload).not.toHaveProperty('api_key');
    expect(await screen.findByText('Settings saved.')).toBeTruthy();
  });

  it('renders per-field validation errors returned from a 422', async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings: vi
        .fn()
        .mockRejectedValue(
          new AiApiError(
            422,
            { message: 'Validation failed.', errors: { api_key: ['An API key is required.'] } },
            'Validation failed.',
          ),
        ),
    });

    render(SettingsPage, { props: { client } });
    await screen.findByPlaceholderText('gpt-4o-mini');

    await fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(await screen.findByText('An API key is required.')).toBeTruthy();
  });

  it('probes the provider via test-connection and surfaces the result', async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      testConnection: vi
        .fn()
        .mockResolvedValue({ result: 'ok', message: 'Connected', provider: 'openai' }),
    });

    render(SettingsPage, { props: { client } });
    await screen.findByPlaceholderText('gpt-4o-mini');

    await fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));

    expect(await screen.findByText('Connected')).toBeTruthy();
  });

  it('clears the typed api_key and last probe result when switching providers', async () => {
    const testConnection = vi
      .fn()
      .mockResolvedValue({ result: 'ok', message: 'Connected', provider: 'openai' });
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      testConnection,
    });

    render(SettingsPage, { props: { client } });
    await screen.findByPlaceholderText('gpt-4o-mini');

    const apiKeyInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement;
    await fireEvent.update(apiKeyInput, 'sk-secret');

    await fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    await screen.findByText('Connected');

    const providerSelect = screen.getByRole('combobox') as HTMLSelectElement;
    await fireEvent.update(providerSelect, 'ollama');

    expect(screen.queryByPlaceholderText('••••••••')).toBeNull();
    expect(screen.queryByText('Connected')).toBeNull();

    await fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    const lastCall = testConnection.mock.calls.at(-1)?.[0];
    expect(lastCall.provider).toBe('ollama');
    expect(lastCall).not.toHaveProperty('api_key');
  });

  it('renders a network error inside an error alert, not a success alert', async () => {
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings: vi.fn().mockRejectedValue(new Error('Network down')),
    });

    render(SettingsPage, { props: { client } });
    await screen.findByPlaceholderText('gpt-4o-mini');

    await fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Network down');
    expect(alert.getAttribute('data-color')).toBe('error');
  });

  it('shows a retry instead of an editable form when settings fail to load', async () => {
    const getSettings = vi
      .fn()
      .mockRejectedValueOnce(new Error('Server unavailable'))
      .mockResolvedValueOnce(baseResponse);
    const updateSettings = vi.fn();
    const client = createMockClient({ getSettings, updateSettings });

    render(SettingsPage, { props: { client } });

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Server unavailable');
    expect(screen.queryByRole('button', { name: 'Save settings' })).toBeNull();
    expect(screen.queryByTestId('ai-settings-page')).toBeNull();

    await fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByDisplayValue('gpt-4o-mini')).toBeTruthy();
    expect(getSettings).toHaveBeenCalledTimes(2);
    expect(updateSettings).not.toHaveBeenCalled();
  });

  it('sends a typed api_key and locks the fields while a save is pending', async () => {
    const save = deferred<AiSettingsResponse>();
    const updateSettings = vi.fn().mockReturnValue(save.promise);
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings,
    });

    render(SettingsPage, { props: { client } });
    await screen.findByDisplayValue('gpt-4o-mini');

    await fireEvent.update(screen.getByPlaceholderText('••••••••'), 'sk-new');
    await fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(updateSettings.mock.calls[0][0].api_key).toBe('sk-new');
    const model = screen.getByDisplayValue('gpt-4o-mini') as HTMLInputElement;
    expect(model.matches(':disabled')).toBe(true);
    expect((screen.getByRole('combobox') as HTMLSelectElement).matches(':disabled')).toBe(true);

    save.resolve(baseResponse);

    expect(await screen.findByText('Settings saved.')).toBeTruthy();
    expect((screen.getByDisplayValue('gpt-4o-mini') as HTMLInputElement).matches(':disabled')).toBe(
      false,
    );
  });

  it('discards a connection result for credentials that changed mid-test', async () => {
    const probe = deferred<{ result: 'ok'; message: string }>();
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      testConnection: vi.fn().mockReturnValue(probe.promise),
    });

    render(SettingsPage, { props: { client } });
    await screen.findByDisplayValue('gpt-4o-mini');

    await fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    await fireEvent.update(screen.getByRole('combobox'), 'ollama');

    probe.resolve({ result: 'ok', message: 'Connected' });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(screen.queryByText('Connected')).toBeNull();
  });

  it('keeps the form hidden when settings reject with a non-Error value', async () => {
    const client = createMockClient({ getSettings: vi.fn().mockRejectedValue(null) });

    render(SettingsPage, { props: { client } });

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
    expect(screen.queryByTestId('ai-settings-page')).toBeNull();
  });

  it('discards a connection result when the client changes mid-test', async () => {
    const probe = deferred<{ result: 'ok'; message: string }>();
    const first = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      testConnection: vi.fn().mockReturnValue(probe.promise),
    });
    const second = createMockClient({ getSettings: vi.fn().mockResolvedValue(baseResponse) });

    const { rerender } = render(SettingsPage, { props: { client: first } });
    await screen.findByDisplayValue('gpt-4o-mini');
    await fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));

    await rerender({ client: second });
    await screen.findByDisplayValue('gpt-4o-mini');
    probe.resolve({ result: 'ok', message: 'Connected' });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(screen.queryByText('Connected')).toBeNull();
  });

  it('discards a connection result when a save replaces the credentials mid-test', async () => {
    const probe = deferred<{ result: 'ok'; message: string }>();
    const client = createMockClient({
      getSettings: vi.fn().mockResolvedValue(baseResponse),
      updateSettings: vi.fn().mockResolvedValue({
        ...baseResponse,
        credentials: { ...baseResponse.credentials, provider: 'anthropic' },
      }),
      testConnection: vi.fn().mockReturnValue(probe.promise),
    });

    render(SettingsPage, { props: { client } });
    await screen.findByDisplayValue('gpt-4o-mini');
    await fireEvent.click(screen.getByRole('button', { name: /Test connection/ }));
    await fireEvent.click(screen.getByRole('button', { name: 'Save settings' }));
    await screen.findByText('Settings saved.');
    probe.resolve({ result: 'ok', message: 'Connected' });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(screen.queryByText('Connected')).toBeNull();
  });
});
