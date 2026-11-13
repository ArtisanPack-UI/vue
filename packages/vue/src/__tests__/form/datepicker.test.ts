import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { DatePicker, type DatePickerValue } from '../../components/form';

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="date-picker"][data-part="${name}"]`);

const root = () => document.body.querySelector<HTMLElement>('.apui-date-picker')!;

/** Lets the machine's effects run. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

/** A parent that binds `v-model`. */
function bound(props: Record<string, unknown> = {}, initial: DatePickerValue = null) {
  const value = ref<DatePickerValue>(initial);
  const Host = defineComponent({
    setup: () => () =>
      h(DatePicker, {
        label: 'Move-in date',
        portal: false,
        ...props,
        modelValue: value.value,
        'onUpdate:modelValue': (next: DatePickerValue) => (value.value = next),
      }),
  });
  return { value, ...render(Host) };
}

describe('DatePicker', () => {
  it('wires the label, the input and the calendar button', async () => {
    render(DatePicker, {
      props: { label: 'Move-in date', hint: 'MM/DD/YYYY', modelValue: '2026-11-12' },
      attrs: { id: 'move-in' },
    });
    await settle();
    const input = screen.getByLabelText('Move-in date') as HTMLInputElement;
    expect(input.getAttribute('data-part')).toBe('control');
    expect(input.getAttribute('placeholder')).toBe('MM/DD/YYYY');
    expect(input.getAttribute('aria-describedby')).toBe('move-in-hint');
    expect(input.value).toBe('11/12/2026');
    const trigger = screen.getByRole('button', { name: 'Choose date' });
    expect(trigger.getAttribute('aria-controls')).toBe('move-in-content');
    expect(root().getAttribute('data-size')).toBe('md');
    expect(root().getAttribute('data-mode')).toBe('single');
  });

  it('renders the month as a grid with Intl names', () => {
    render(DatePicker, {
      props: {
        label: 'Date',
        open: true,
        portal: false,
        locale: 'fr-FR',
        modelValue: '2026-11-12',
      },
    });
    expect(screen.getByRole('grid').getAttribute('data-part')).toBe('table');
    expect(partOf('range-text')!.textContent).toBe('novembre 2026');
    expect(partOf('table-header')!.textContent?.trim()).toBe('lun.');
    const selected = document.querySelector('[data-part="table-cell-trigger"][data-selected]')!;
    expect(selected.getAttribute('data-value')).toBe('2026-11-12');
  });

  it('updates v-model with the ISO value of a chosen day', async () => {
    const { value } = bound({}, '2026-11-12');
    await fireEvent.click(screen.getByRole('button', { name: 'Choose date' }));
    await settle();
    await fireEvent.click(
      document.querySelector('[data-part="table-cell-trigger"][data-value="2026-11-20"]')!,
    );
    await settle();
    expect(value.value).toBe('2026-11-20');
  });

  it('emits update:open from the trigger', async () => {
    const { emitted } = render(DatePicker, { props: { label: 'Date', portal: false } });
    await fireEvent.click(screen.getByRole('button', { name: 'Choose date' }));
    await settle();
    expect(emitted()['update:open']?.[0]).toEqual([true]);
    expect(partOf('content')!.hidden).toBe(false);
  });

  it('renders two inputs and two hidden values in range mode', () => {
    render(DatePicker, {
      props: {
        mode: 'range',
        name: 'stay',
        label: 'Stay',
        modelValue: ['2026-11-12', '2026-11-18'],
      },
    });
    const inputs = document.querySelectorAll('input[data-part="control"]');
    expect(inputs).toHaveLength(2);
    expect(inputs[1]!.getAttribute('aria-label')).toBe('End date');
    const hidden = [...document.querySelectorAll<HTMLInputElement>('input[name="stay[]"]')];
    expect(hidden.map((el) => el.value)).toEqual(['2026-11-12', '2026-11-18']);
  });

  it('adds the time listbox and the time zone in time mode', () => {
    render(DatePicker, {
      props: {
        label: 'Viewing',
        open: true,
        portal: false,
        time: true,
        step: 60,
        timeZone: 'Europe/Madrid',
        modelValue: '2026-11-12T11:00',
      },
    });
    const list = screen.getByRole('listbox', { name: 'Time' });
    expect(list.querySelectorAll('[role="option"]')).toHaveLength(24);
    expect(screen.getByRole('option', { name: '11:00' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(partOf('time-zone')!.textContent?.trim()).toBe('Time zone: Europe/Madrid');
    expect(screen.getByRole('button', { name: 'Choose date and time' })).toBeTruthy();
  });

  it('marks the field invalid and takes translated labels', () => {
    render(DatePicker, {
      props: {
        label: 'Closing date',
        error: "That date doesn't exist.",
        open: true,
        portal: false,
        previousLabel: 'Mois précédent',
        nextLabel: 'Mois suivant',
      },
    });
    expect(root().hasAttribute('data-invalid')).toBe(true);
    expect(screen.getByLabelText('Closing date').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('button', { name: 'Mois précédent' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mois suivant' })).toBeTruthy();
  });
});
