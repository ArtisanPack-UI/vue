/* eslint-disable vue/one-component-per-file */
import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { axe } from 'vitest-axe';
import { Combobox, type ComboboxOption, type ComboboxValue } from '../../components/form';

// jsdom has no CSS.escape, which Zag uses to find an option by value.
globalThis.CSS ??= {} as typeof CSS;
CSS.escape ??= (value: string) => value.replace(/["\\]/g, '\\$&');

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="combobox"][data-part="${name}"]`);

const partsOf = (name: string, root: ParentNode = document.body) => [
  ...root.querySelectorAll<HTMLElement>(`[data-scope="combobox"][data-part="${name}"]`),
];

/** Lets the machine's effects run. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

const PROPERTIES: ComboboxOption[] = [
  { value: 'lakeview', label: 'Lakeview Lofts', description: 'United States, Chicago' },
  { value: 'lakeside', label: 'Lakeside Commons', color: 'success' },
  { value: 'harbor', label: 'Harbor Point' },
];

const input = () => partOf('control') as HTMLInputElement;
const visibleValues = () =>
  partsOf('item')
    .filter((item) => !item.hasAttribute('data-create'))
    .map((item) => item.getAttribute('data-value'));

async function typeText(text: string) {
  input().focus();
  await fireEvent.focusIn(input());
  await fireEvent.update(input(), text);
  await settle();
}

/** A parent that binds v-model and records emitted values. */
function bound(
  props: Record<string, unknown>,
  initial: ComboboxValue,
  events: Record<string, unknown[]> = {},
) {
  const value = ref<ComboboxValue>(initial);
  const Parent = defineComponent({
    setup() {
      return () =>
        h(Combobox, {
          label: 'Property',
          options: PROPERTIES,
          portal: false,
          ...props,
          modelValue: value.value,
          'onUpdate:modelValue': (next: ComboboxValue) => {
            value.value = next;
            (events.value ??= []).push(next);
          },
          onCreate: (next: string) => (events.create ??= []).push(next),
          'onSearch-change': (next: string) => (events.search ??= []).push(next),
        });
    },
  });
  return { value, ...render(Parent) };
}

describe('Combobox', () => {
  it('renders the field anatomy with the box and the combobox input', () => {
    const { container } = render(Combobox, {
      props: { label: 'Property', options: PROPERTIES, hint: 'Pick one.', error: 'Required.' },
    });
    const root = container.querySelector('.apui-combobox')!;
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.hasAttribute('data-invalid')).toBe(true);
    expect(input().getAttribute('role')).toBe('combobox');
    expect(input().parentElement!.getAttribute('data-part')).toBe('box');
    expect(partOf('label')!.getAttribute('for')).toBe(input().id);
    expect(input().getAttribute('aria-describedby')).toBe(`${input().id}-hint ${input().id}-error`);
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(partOf('trigger')!.getAttribute('aria-label')).toBe('Show options');
    expect(partOf('status')!.getAttribute('role')).toBe('status');
  });

  it('filters as you type, marks the match and emits search-change', async () => {
    const events: Record<string, unknown[]> = {};
    bound({}, null, events);
    await typeText('lake');
    expect(visibleValues()).toEqual(['lakeview', 'lakeside']);
    expect(partOf('mark')!.textContent).toBe('Lake');
    expect(partOf('item-description')!.textContent).toBe('United States, Chicago');
    expect(events.search).toEqual(['lake']);
  });

  it('shows the empty text with the search', async () => {
    bound({}, null);
    await typeText('zzz');
    expect(visibleValues()).toEqual([]);
    expect(partOf('empty')!.hidden).toBe(false);
    expect(partOf('empty')!.textContent).toBe('No matches for “zzz”.');
  });

  it('chooses an option and binds the value', async () => {
    const { value } = bound({}, null);
    await typeText('harb');
    await fireEvent.click(partsOf('item')[0]!);
    await settle();
    expect(value.value).toBe('harbor');
    expect(input().value).toBe('Harbor Point');
  });

  describe('form submission', () => {
    const submitted = (form: HTMLFormElement) => [...new FormData(form).entries()];
    const inForm = (props: Record<string, unknown>, initial: ComboboxValue) => {
      const result = bound(props, initial);
      const form = document.createElement('form');
      document.body.append(form);
      form.append(result.container);
      return { ...result, form };
    };

    it('submits the value through a hidden input, never the text input', async () => {
      const { form, unmount } = inForm({ name: 'property' }, 'lakeside');
      expect(submitted(form)).toEqual([['property', 'lakeside']]);
      expect(input().hasAttribute('name')).toBe(false);
      await typeText('harb');
      await fireEvent.click(partsOf('item')[0]!);
      await settle();
      expect(submitted(form)).toEqual([['property', 'harbor']]);
      unmount();
      form.remove();
    });

    it('submits one hidden input per value with multiple, and none while empty', async () => {
      const { form, unmount } = inForm({ name: 'tags[]', multiple: true }, ['lakeview', 'Garden']);
      expect(submitted(form)).toEqual([
        ['tags[]', 'lakeview'],
        ['tags[]', 'Garden'],
      ]);
      for (const button of partsOf('chip-remove').reverse()) {
        await fireEvent.click(button);
        await settle();
      }
      expect(submitted(form)).toEqual([]);
      unmount();
      form.remove();
    });
  });

  it('gives number option values back as numbers', async () => {
    const floors: ComboboxOption[] = [
      { value: 1, label: 'First floor' },
      { value: 3, label: 'Third floor' },
    ];
    const single = bound({ options: floors }, 1);
    expect(input().value).toBe('First floor');
    await typeText('third');
    await fireEvent.click(partsOf('item')[0]!);
    await settle();
    expect(single.value.value).toBe(3);
    single.unmount();

    const several = bound({ options: floors, multiple: true }, [1]);
    await typeText('third');
    await fireEvent.click(partsOf('item').find((item) => item.dataset.value === '3')!);
    await settle();
    expect(several.value.value).toEqual([1, 3]);
    several.unmount();
  });

  it('shows the label of a value set from outside', async () => {
    const { value } = bound({}, 'lakeview');
    await settle();
    expect(input().value).toBe('Lakeview Lofts');
    value.value = 'harbor';
    await settle();
    expect(input().value).toBe('Harbor Point');
  });

  describe('tags: multiple with create', () => {
    it('renders chips with remove buttons and removes one', async () => {
      const { value } = bound({ multiple: true }, ['lakeview', 'lakeside']);
      const chips = partsOf('chip');
      expect(chips.map((chip) => chip.getAttribute('data-value'))).toEqual([
        'lakeview',
        'lakeside',
      ]);
      expect(chips[1]!.getAttribute('data-color')).toBe('success');
      const remove = partOf('chip-remove', chips[0])!;
      expect(remove.getAttribute('aria-label')).toBe('Remove Lakeview Lofts');
      await fireEvent.click(remove);
      await settle();
      expect(value.value).toEqual(['lakeside']);
      expect(partOf('status')!.textContent).toBe('Removed Lakeview Lofts.');
    });

    it('removes the last chip with Backspace in the empty input', async () => {
      const { value } = bound({ multiple: true }, ['lakeview', 'harbor']);
      await fireEvent.keyDown(input(), { key: 'Backspace' });
      await settle();
      expect(value.value).toEqual(['lakeview']);
      expect(partOf('status')!.textContent).toBe('Removed Harbor Point.');
    });

    it('offers to create new text and emits create', async () => {
      const events: Record<string, unknown[]> = {};
      const { value } = bound({ multiple: true, allowCreate: true }, [], events);
      await typeText('Rooftop');
      const create = document.querySelector<HTMLElement>('[data-part="item"][data-create]')!;
      expect(create.textContent).toBe('Create “Rooftop”');
      await fireEvent.click(create);
      await settle();
      expect(value.value).toEqual(['Rooftop']);
      expect(events.create).toEqual(['Rooftop']);
      expect(partsOf('chip').map((chip) => chip.textContent)).toEqual(['Rooftop']);
    });

    it("doesn't offer to create an existing option, ignoring case", async () => {
      bound({ multiple: true, allowCreate: true }, []);
      await typeText('HARBOR POINT');
      expect(document.querySelector('[data-part="item"][data-create]')).toBeNull();
    });

    it('stops at max and disables the other options', async () => {
      const { value } = bound({ multiple: true, max: 1 }, ['harbor']);
      await fireEvent.click(partOf('trigger')!);
      await settle();
      const lakeview = document.querySelector<HTMLElement>(
        '[data-value="lakeview"][role="option"]',
      )!;
      expect(lakeview.getAttribute('aria-disabled')).toBe('true');
      await fireEvent.click(lakeview);
      await settle();
      expect(value.value).toEqual(['harbor']);
    });

    it('takes translated labels', () => {
      render(Combobox, {
        props: {
          label: 'Étiquettes',
          options: PROPERTIES,
          multiple: true,
          modelValue: ['harbor'],
          removeLabel: 'Retirer {label}',
          triggerLabel: 'Afficher les options',
        },
      });
      expect(partOf('chip-remove')!.getAttribute('aria-label')).toBe('Retirer Harbor Point');
      expect(partOf('trigger')!.getAttribute('aria-label')).toBe('Afficher les options');
    });
  });

  it('has no axe violations, open with chips', async () => {
    const { container } = render(Combobox, {
      props: {
        label: 'Tags',
        options: PROPERTIES,
        multiple: true,
        modelValue: ['harbor'],
        hint: 'Pick some.',
        open: true,
        portal: false,
      },
    });
    await settle();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('does not filter when remote', async () => {
    bound({ remote: true }, null);
    await typeText('zz');
    expect(visibleValues()).toEqual(['lakeview', 'lakeside', 'harbor']);
  });

  it('shows the spinner and the loading text while loading', () => {
    render(Combobox, {
      props: { label: 'Owner', options: [], loading: true, open: true, portal: false },
    });
    expect(document.querySelector('.apui-combobox')!.hasAttribute('data-loading')).toBe(true);
    expect(partOf('spinner')).not.toBeNull();
    expect(partOf('empty')!.textContent).toBe('Loading…');
  });
});
