import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Divider } from '../../components/layout';

describe('Divider', () => {
  it('renders an hr for a plain horizontal rule', () => {
    render(Divider);
    const root = document.querySelector('.apui-divider')!;
    expect(root.tagName).toBe('HR');
    expect(root.getAttribute('data-orientation')).toBe('horizontal');
    expect(root.getAttribute('data-strength')).toBe('subtle');
    expect(root.getAttribute('data-align')).toBe('center');
    expect(root.hasAttribute('role')).toBe(false);
  });

  it('renders a vertical separator', () => {
    render(Divider, { props: { orientation: 'vertical', strength: 'strong' } });
    const root = document.querySelector('.apui-divider')!;
    expect(root.tagName).toBe('DIV');
    expect(root.getAttribute('role')).toBe('separator');
    expect(root.getAttribute('aria-orientation')).toBe('vertical');
    expect(root.getAttribute('data-strength')).toBe('strong');
  });

  it('names a labelled divider by its label, from the prop or the slot', () => {
    render(Divider, { props: { label: 'or continue with', align: 'start' } });
    const root = document.querySelector('.apui-divider')!;
    const label = root.querySelector('[data-scope="divider"][data-part="label"]')!;
    expect(label.textContent).toBe('or continue with');
    expect(root.getAttribute('aria-labelledby')).toBe(label.id);
    expect(root.getAttribute('data-align')).toBe('start');
    document.body.innerHTML = '';
    render(Divider, { slots: { default: 'Older' } });
    expect(document.querySelector('[data-part="label"]')!.textContent).toBe('Older');
  });

  it('hides a decorative divider', () => {
    render(Divider, { props: { decorative: true } });
    const root = document.querySelector('.apui-divider')!;
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.hasAttribute('data-decorative')).toBe(true);
    document.body.innerHTML = '';
    render(Divider, { props: { decorative: true, label: 'or' } });
    expect(document.querySelector('.apui-divider')!.getAttribute('role')).toBe('none');
  });

  it('prefers the label prop, and falls back to it when the slot renders nothing', () => {
    const both = render(Divider, { props: { label: 'Prop' }, slots: { default: 'Slot' } });
    expect(both.container.querySelector('[data-part="label"]')!.textContent).toBe('Prop');
    both.unmount();
    const empty = render(Divider, { props: { label: 'or' }, slots: { default: () => [] } });
    expect(empty.container.querySelector('[data-part="label"]')!.textContent).toBe('or');
    expect(empty.container.querySelector('hr')).toBeNull();
  });
});
