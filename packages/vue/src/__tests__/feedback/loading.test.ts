import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Loading } from '../../components/feedback';

describe('Loading', () => {
  it('is a status with a visually hidden Loading label by default', () => {
    const { container } = render(Loading);
    const root = screen.getByRole('status');
    expect(root.className).toBe('apui-loading');
    expect(root.getAttribute('data-variant')).toBe('spinner');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-color')).toBe('primary');
    expect(root.getAttribute('style')).toContain('--apui-_delay: 300ms');
    const label = container.querySelector('[data-part="label"]')!;
    expect(label.className).toBe('apui-sr-only');
    expect(label.textContent).toBe('Loading');
    const indicator = container.querySelector('[data-part="indicator"]')!;
    expect(indicator.getAttribute('aria-hidden')).toBe('true');
    expect(indicator.children).toHaveLength(0);
  });

  it('shows slot text as a visible label', () => {
    const { container } = render(Loading, { slots: { default: 'Saving changes…' } });
    const label = container.querySelector('[data-part="label"]')!;
    expect(label.hasAttribute('class')).toBe(false);
    expect(label.textContent).toBe('Saving changes…');
  });

  it('renders three dots, a translated label, overlay and delay', () => {
    const { container } = render(Loading, {
      props: { variant: 'dots', label: 'Chargement', overlay: true, delay: 0 },
    });
    const root = container.firstElementChild!;
    expect(root.querySelectorAll('[data-part="indicator"] > span')).toHaveLength(3);
    expect(root.getAttribute('data-overlay')).toBe('');
    expect(root.getAttribute('style')).toContain('--apui-_delay: 0ms');
    expect(root.textContent).toBe('Chargement');
  });
});
