/* eslint-disable vue/one-component-per-file */
import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { Tab, Tabs, type TabData } from '../../components/layout';

const TABS: TabData[] = [
  { value: 'overview', label: 'Overview', icon: 'list', content: 'Overview panel' },
  { value: 'notifications', label: 'Notifications', count: 4, content: 'Notifications panel' },
  { value: 'history', label: 'History', content: 'History panel' },
  { value: 'archived', label: 'Archived', disabled: true, content: 'Archived panel' },
];

const Composed = defineComponent({
  props: { modelValue: { type: String, default: undefined } },
  setup(props) {
    return () =>
      h(Tabs, props.modelValue === undefined ? {} : { modelValue: props.modelValue }, () => [
        h(Tab, { value: 'overview', label: 'Overview', icon: 'list' }, () => 'Overview panel'),
        h(
          Tab,
          { value: 'notifications', label: 'Notifications', count: 4 },
          () => 'Notifications panel',
        ),
        h(Tab, { value: 'history', label: 'History' }, () => 'History panel'),
        h(Tab, { value: 'archived', label: 'Archived', disabled: true }, () => 'Archived panel'),
      ]);
  },
});

const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 50));
  await nextTick();
};

const part = (name: string) => [
  ...document.querySelectorAll<HTMLElement>(`[data-scope="tabs"][data-part="${name}"]`),
];
const selected = () =>
  part('trigger')
    .filter((el) => el.getAttribute('aria-selected') === 'true')
    .map((el) => el.textContent?.replace(/\s+/g, ' ').trim());
const visible = () =>
  part('content')
    .filter((el) => !el.hidden)
    .map((el) => el.textContent?.trim());

/** Generated ids differ between renders; compare markup without them. */
const withoutIds = (html: string) =>
  html
    .replace(/ (id|aria-controls|aria-labelledby|data-ownedby)="[^"]*"/g, '')
    .replace(/<!--[^>]*-->/g, '');

describe('Tabs', () => {
  it('renders the contract anatomy', async () => {
    render(Tabs, { props: { tabs: TABS, label: 'Sections' } });
    await settle();
    const root = document.querySelector('.apui-tabs')!;
    expect(root.getAttribute('data-variant')).toBe('segmented');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-orientation')).toBe('horizontal');
    expect(root.getAttribute('data-activation-mode')).toBe('automatic');
    expect(part('list')[0]!.getAttribute('role')).toBe('tablist');
    expect(part('list')[0]!.getAttribute('aria-label')).toBe('Sections');
    expect(part('trigger')).toHaveLength(4);
    expect(part('icon')).toHaveLength(1);
    expect(part('count')[0]!.textContent).toBe('4');
    expect(part('content')[0]!.getAttribute('role')).toBe('tabpanel');
    expect(part('trigger')[3]!.hasAttribute('disabled')).toBe(true);
  });

  it('selects the first enabled tab by default, for data and composition', async () => {
    render(Tabs, { props: { tabs: TABS } });
    await settle();
    expect(selected()).toEqual(['Overview']);
    expect(visible()).toEqual(['Overview panel']);
    document.body.innerHTML = '';
    render(Composed);
    await settle();
    expect(selected()).toEqual(['Overview']);
    expect(visible()).toEqual(['Overview panel']);
  });

  it('selects the first enabled composed tab on the server, without v-model', async () => {
    const host = document.createElement('div');
    host.innerHTML = await renderToString(h(Composed));
    const trigger = (name: string) =>
      [...host.querySelectorAll('[data-part="trigger"]')].find((el) =>
        el.textContent?.includes(name),
      )!;
    expect(trigger('Overview').getAttribute('aria-selected')).toBe('true');
    expect(trigger('Notifications').getAttribute('aria-selected')).toBe('false');
    const panels = [...host.querySelectorAll<HTMLElement>('[data-part="content"]')];
    expect(panels.filter((el) => !el.hasAttribute('hidden')).map((el) => el.textContent)).toEqual([
      'Overview panel',
    ]);
  });

  it('skips a disabled first tab, on the server and on the first client render', async () => {
    const DisabledFirst = defineComponent(
      () => () =>
        h(Tabs, null, () => [
          h(Tab, { value: 'a', label: 'A', disabled: true }, () => 'A panel'),
          h(Tab, { value: 'b', label: 'B' }, () => 'B panel'),
        ]),
    );
    const host = document.createElement('div');
    host.innerHTML = await renderToString(h(DisabledFirst));
    expect(host.querySelector('[aria-selected="true"]')?.textContent?.trim()).toBe('B');

    render(DisabledFirst);
    // No settle: the first client render already selects it.
    expect(selected()).toEqual(['B']);
    expect(visible()).toEqual(['B panel']);
  });

  it('renders the same markup from tabs as from composition', async () => {
    const fromData = await renderToString(h(Tabs, { tabs: TABS, modelValue: 'history' }));
    const composed = await renderToString(h(Composed, { modelValue: 'history' }));
    expect(withoutIds(fromData)).toBe(withoutIds(composed));
  });

  it('emits update:modelValue and follows v-model', async () => {
    const value = ref('overview');
    const Host = defineComponent(
      () => () =>
        h(Tabs, {
          tabs: TABS,
          modelValue: value.value,
          'onUpdate:modelValue': (next: string) => (value.value = next),
        }),
    );
    render(Host);
    await settle();
    await fireEvent.click(part('trigger')[2]!);
    await settle();
    expect(value.value).toBe('history');
    expect(selected()).toEqual(['History']);
    value.value = 'notifications';
    await settle();
    expect(selected()).toEqual(['Notifications 4']);
  });

  it('stays where a bound value says when the parent ignores changes', async () => {
    render(Tabs, { props: { tabs: TABS, modelValue: 'overview' } });
    await settle();
    await fireEvent.click(part('trigger')[2]!);
    await settle();
    expect(selected()).toEqual(['Overview']);
  });

  it('moves with the arrow keys, skipping disabled tabs', async () => {
    render(Tabs, { props: { tabs: TABS } });
    await settle();
    part('trigger')[0]!.focus();
    await fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    await settle();
    expect(document.activeElement).toBe(part('trigger')[1]);
    // Automatic selection runs in a later frame; the behavior package's
    // Chromium tests cover it (and RTL) for this composable.
    await fireEvent.keyDown(document.activeElement!, { key: 'End' });
    await settle();
    expect(document.activeElement).toBe(part('trigger')[2]);
  });

  it('only moves focus in manual mode', async () => {
    render(Tabs, { props: { tabs: TABS, activationMode: 'manual' } });
    await settle();
    part('trigger')[0]!.focus();
    await fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    await settle();
    expect(document.activeElement).toBe(part('trigger')[1]);
    expect(selected()).toEqual(['Overview']);
    await fireEvent.click(part('trigger')[1]!);
    await settle();
    expect(selected()).toEqual(['Notifications 4']);
  });

  it('emits variant, size and orientation, and applies classes per part', async () => {
    render(Tabs, {
      props: {
        tabs: TABS,
        variant: 'underline',
        size: 'sm',
        orientation: 'vertical',
        classes: { root: 'r', list: 'l', trigger: 't', content: 'c' },
      },
      attrs: { class: 'extra' },
    });
    await settle();
    const root = document.querySelector('.apui-tabs')!;
    expect(root.getAttribute('data-variant')).toBe('underline');
    expect(root.getAttribute('data-size')).toBe('sm');
    expect(root.getAttribute('data-orientation')).toBe('vertical');
    expect(root.classList.contains('r')).toBe(true);
    expect(root.classList.contains('extra')).toBe(true);
    expect(part('list')[0]!.classList.contains('l')).toBe(true);
    expect(part('trigger')[0]!.classList.contains('t')).toBe(true);
    expect(part('content')[0]!.classList.contains('c')).toBe(true);
  });

  it('throws when a Tab is rendered outside Tabs', () => {
    expect(() => render(Tab, { props: { value: 'x' } })).toThrow(/inside a Tabs/);
  });
  it('selects the first tab of tabs that load after mount', async () => {
    const tabs = ref<TabData[]>([]);
    const Host = defineComponent(() => () => h(Tabs, { tabs: tabs.value }));
    render(Host);
    await settle();
    expect(part('trigger')).toHaveLength(0);
    tabs.value = TABS;
    await settle();
    expect(selected()).toEqual(['Overview']);
    expect(part('trigger')[0]!.getAttribute('tabindex')).toBe('0');
  });
});
