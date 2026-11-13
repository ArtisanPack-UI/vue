/* eslint-disable vue/one-component-per-file */
import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Accordion, AccordionItem, type AccordionItemData } from '../../components/layout';

const ITEMS: AccordionItemData[] = [
  { value: 'live', title: 'How long?', content: 'Until archived.' },
  { value: 'owners', title: 'Co-owners?', content: 'Yes.' },
  { value: 'files', title: 'File types?', content: 'Images.', disabled: true },
];

const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 20));
  await nextTick();
};

const part = (name: string) => [
  ...document.querySelectorAll<HTMLElement>(`[data-scope="accordion"][data-part="${name}"]`),
];
/** A click as a browser makes it: the trigger takes focus first, which the machine waits for. */
const click = async (el: HTMLElement) => {
  el.focus();
  await fireEvent.click(el);
};
const openTitles = () =>
  part('trigger')
    .filter((el) => el.getAttribute('aria-expanded') === 'true')
    .map((el) => el.textContent?.trim());

describe('Accordion', () => {
  it('renders the contract anatomy', async () => {
    render(Accordion, { props: { items: ITEMS, modelValue: ['live'] } });
    await settle();
    const root = document.querySelector('.apui-accordion')!;
    expect(root.getAttribute('data-variant')).toBe('default');
    expect(root.hasAttribute('data-collapsible')).toBe(true);
    expect(root.hasAttribute('data-multiple')).toBe(false);
    expect(part('item')).toHaveLength(3);
    expect(part('title')[0]!.tagName).toBe('H3');
    const trigger = part('trigger')[0]!;
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger.getAttribute('aria-controls')).toBe(part('content')[0]!.id);
    expect(part('content')[0]!.getAttribute('role')).toBe('region');
    expect(part('content')[0]!.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(part('chevron')[0]!.getAttribute('aria-hidden')).toBe('true');
    expect(part('chevron')[0]!.querySelector('svg')).not.toBeNull();
    expect(part('content')[1]!.hidden).toBe(true);
    expect(part('trigger')[2]!.hasAttribute('disabled')).toBe(true);
    expect(openTitles()).toEqual(['How long?']);
  });

  it('renders data items before composed children, at headingLevel', async () => {
    render(Accordion, {
      props: { items: [ITEMS[0]!], headingLevel: 4 },
      slots: { default: () => h(AccordionItem, { value: 'extra', title: 'Extra' }, () => 'More') },
    });
    await settle();
    expect(part('trigger').map((el) => el.textContent?.trim())).toEqual(['How long?', 'Extra']);
    expect(part('title').every((el) => el.tagName === 'H4')).toBe(true);
  });

  it('opens one item at a time, and emits update:modelValue', async () => {
    const { emitted } = render(Accordion, { props: { items: ITEMS } });
    await settle();
    await click(part('trigger')[0]!);
    await settle();
    expect(openTitles()).toEqual(['How long?']);
    await click(part('trigger')[1]!);
    await settle();
    expect(openTitles()).toEqual(['Co-owners?']);
    expect(emitted()['update:modelValue']).toContainEqual([['owners']]);
  });

  it('keeps several open with multiple', async () => {
    render(Accordion, { props: { items: ITEMS, multiple: true } });
    await settle();
    await click(part('trigger')[0]!);
    await settle();
    await click(part('trigger')[1]!);
    await settle();
    expect(openTitles()).toEqual(['How long?', 'Co-owners?']);
  });

  it('follows v-model', async () => {
    const open = ref(['live']);
    const Host = defineComponent(
      () => () =>
        h(Accordion, {
          items: ITEMS,
          modelValue: open.value,
          'onUpdate:modelValue': (value: string[]) => (open.value = value),
        }),
    );
    render(Host);
    await settle();
    open.value = ['owners'];
    await settle();
    expect(openTitles()).toEqual(['Co-owners?']);
    await click(part('trigger')[0]!);
    await settle();
    expect(open.value).toEqual(['live']);
  });

  it('applies classes per part', async () => {
    render(Accordion, {
      props: {
        items: ITEMS,
        variant: 'separated',
        classes: { root: 'r', trigger: 't', content: 'c' },
      },
    });
    await settle();
    const root = document.querySelector('.apui-accordion')!;
    expect(root.classList.contains('r')).toBe(true);
    expect(root.getAttribute('data-variant')).toBe('separated');
    expect(part('trigger')[0]!.classList.contains('t')).toBe(true);
    expect(part('content')[0]!.classList.contains('c')).toBe(true);
  });

  it('puts native AccordionItem attributes on the item root, not the panel', () => {
    const { container } = render(Accordion, {
      props: { classes: { item: 'i', content: 'c' } },
      slots: {
        default: () =>
          h(
            AccordionItem,
            { value: 'live', title: 'Live', class: 'own', 'data-testid': 'live-item' },
            () => 'Live panel',
          ),
      },
    });
    const item = container.querySelector<HTMLElement>('[data-part="item"]')!;
    expect(item.className).toBe('own i');
    expect(item.getAttribute('data-testid')).toBe('live-item');
    const panel = container.querySelector<HTMLElement>('[data-part="content"]')!;
    expect(panel.className).toBe('c');
    expect(panel.hasAttribute('data-testid')).toBe(false);
  });
});
