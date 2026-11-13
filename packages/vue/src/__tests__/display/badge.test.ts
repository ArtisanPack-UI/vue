import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Badge } from '../../components/display';

describe('Badge', () => {
  it('renders a soft neutral md badge with a label part', () => {
    const { container } = render(Badge, { slots: { default: 'Draft' } });
    const root = container.querySelector('.apui-badge')!;
    expect(root.tagName).toBe('SPAN');
    expect(root.getAttribute('data-variant')).toBe('soft');
    expect(root.getAttribute('data-color')).toBe('neutral');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.querySelector('[data-scope="badge"][data-part="label"]')?.textContent).toBe(
      'Draft',
    );
  });

  it('emits variant, color and size', () => {
    const { container } = render(Badge, {
      props: { variant: 'solid', color: 'success', size: 'lg' },
      slots: { default: 'Paid' },
    });
    const root = container.querySelector('.apui-badge')!;
    expect(root.getAttribute('data-variant')).toBe('solid');
    expect(root.getAttribute('data-color')).toBe('success');
    expect(root.getAttribute('data-size')).toBe('lg');
  });

  it('renders a decorative dot and icon, and arrows mirror', () => {
    const { container } = render(Badge, {
      props: { dot: true, leadingIcon: 'arrow-right' },
      slots: { default: 'Up' },
    });
    expect(container.querySelector('[data-part="dot"]')?.getAttribute('aria-hidden')).toBe('true');
    const icon = container.querySelector('[data-part="icon"]')!;
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('data-mirror')).toBe('');
    expect(icon.querySelector('svg')).not.toBeNull();
  });

  it('takes an icon slot over leadingIcon and part classes', () => {
    const { container } = render(Badge, {
      props: { leadingIcon: 'check', classes: { label: 'x' } },
      slots: { default: 'New', icon: '<b>!</b>' },
    });
    expect(container.querySelector('[data-part="icon"] b')).not.toBeNull();
    expect(container.querySelector('[data-part="icon"] svg')).toBeNull();
    expect(container.querySelector('[data-part="label"]')?.classList.contains('x')).toBe(true);
  });
});
