import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { nextTick } from 'vue';
import { Collapse } from '../../components/layout';

const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 20));
  await nextTick();
};

const part = (name: string) =>
  document.querySelector<HTMLElement>(`[data-scope="collapse"][data-part="${name}"]`);

describe('Collapse', () => {
  it('renders a section: the trigger, then the hidden region', async () => {
    render(Collapse, {
      props: { label: 'Advanced settings' },
      slots: { default: 'Custom URL' },
    });
    await settle();
    const root = document.querySelector('.apui-collapse')!;
    expect(root.getAttribute('data-variant')).toBe('section');
    expect(root.getAttribute('data-state')).toBe('closed');
    const trigger = part('trigger')!;
    expect(trigger.textContent?.trim()).toBe('Advanced settings');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(part('content')!.id);
    expect(part('icon')!.getAttribute('aria-hidden')).toBe('true');
    expect(part('content')!.hidden).toBe(true);
    expect(
      trigger.compareDocumentPosition(part('content')!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(part('fade')).toBeNull();
  });

  it('opens from the trigger and emits update:open', async () => {
    const { emitted } = render(Collapse, { props: { label: 'More' }, slots: { default: 'Body' } });
    await settle();
    await fireEvent.click(part('trigger')!);
    await settle();
    expect(part('trigger')!.getAttribute('aria-expanded')).toBe('true');
    expect(part('content')!.hidden).toBe(false);
    expect(emitted()['update:open']).toEqual([[true]]);
  });

  it('follows open', async () => {
    const { rerender } = render(Collapse, { props: { label: 'More', open: false } });
    await settle();
    await rerender({ label: 'More', open: true });
    await settle();
    expect(part('trigger')!.getAttribute('aria-expanded')).toBe('true');
  });

  it('clamps a read-more and puts the trigger after it, with default labels', async () => {
    render(Collapse, { props: { variant: 'read-more' }, slots: { default: 'Long text' } });
    await settle();
    expect(part('content')!.hidden).toBe(false);
    expect(part('content')!.style.maxHeight).toContain('--apui-collapse-clamp-height');
    expect(part('fade')!.getAttribute('aria-hidden')).toBe('true');
    expect(part('trigger')!.textContent?.trim()).toBe('Read more');
    expect(
      part('content')!.compareDocumentPosition(part('trigger')!) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    await fireEvent.click(part('trigger')!);
    await settle();
    expect(part('trigger')!.textContent?.trim()).toBe('Show less');
  });

  it('disables the trigger', async () => {
    render(Collapse, { props: { label: 'More', disabled: true } });
    await settle();
    expect(part('trigger')!.hasAttribute('disabled')).toBe(true);
  });

  it('takes a trigger slot', async () => {
    render(Collapse, { slots: { trigger: '<strong>Custom</strong>', default: 'Body' } });
    await settle();
    expect(part('trigger')!.querySelector('strong')?.textContent).toBe('Custom');
  });
});
