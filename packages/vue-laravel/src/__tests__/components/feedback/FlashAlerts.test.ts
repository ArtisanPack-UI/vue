import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { reactive } from 'vue';

const mockPageProps = reactive({
  auth: { user: null },
  flash: {} as Record<string, string | undefined>,
  errors: {},
});

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({ props: mockPageProps }),
}));

import FlashAlerts from '../../../components/feedback/FlashAlerts.vue';

describe('FlashAlerts', () => {
  beforeEach(() => {
    mockPageProps.flash = {};
  });

  it('renders nothing when no flash messages', () => {
    const { container } = render(FlashAlerts);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  it('renders a success alert for flash success', () => {
    mockPageProps.flash = { success: 'Item saved' };
    render(FlashAlerts);
    expect(screen.getByText('Item saved')).toBeDefined();
  });

  it('renders multiple alerts for multiple flash messages', () => {
    mockPageProps.flash = { success: 'Saved', error: 'But something else failed' };
    render(FlashAlerts);
    expect(screen.getByText('Saved')).toBeDefined();
    expect(screen.getByText('But something else failed')).toBeDefined();
  });

  it('skips empty flash values', () => {
    mockPageProps.flash = { success: '', error: undefined };
    const { container } = render(FlashAlerts);
    // Container should have no alert children
    const alerts = container.querySelectorAll('[role="alert"]');
    expect(alerts.length).toBe(0);
  });

  it('applies custom className', () => {
    mockPageProps.flash = { info: 'Note' };
    const { container } = render(FlashAlerts, {
      props: { className: 'my-alerts' },
    });
    expect(container.querySelector('.my-alerts')).not.toBeNull();
  });
});
