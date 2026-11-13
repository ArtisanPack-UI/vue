import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Calendar } from '../../components/data';
import type { CalendarEvent } from '../../components/data';

const events: CalendarEvent[] = [
  {
    id: 1,
    start: '2026-11-02T09:00',
    end: '2026-11-02T10:00',
    title: 'Team meeting',
    color: 'error',
    category: 'Marketing',
    description: 'Weekly sync.',
  },
  { id: 6, start: '2026-11-12T11:00', title: 'Viewing · Lakeview', color: 'primary' },
  { id: 7, start: '2026-11-12T16:00', title: 'Hubstaff broadcast', color: 'info' },
  {
    id: 8,
    start: '2026-11-12T18:00',
    title: 'Board dinner',
    color: 'success',
    href: 'https://example.com/dinner',
  },
];

const base = { events, today: '2026-11-07', weekStartsOn: 1 };
const attrs = { id: 'cal' };

const q = (container: Element, selector: string) => container.querySelector<HTMLElement>(selector)!;

describe('Calendar', () => {
  it('renders the month grid with a tab stop, today and labeled days', () => {
    const { container } = render(Calendar, { props: base, attrs });
    expect(q(container, '.apui-calendar').getAttribute('data-view')).toBe('month');
    expect(q(container, '#cal-title').textContent?.trim()).toBe('November 2026');
    expect(q(container, '[role="grid"]').getAttribute('aria-labelledby')).toBe('cal-title');
    expect(container.querySelectorAll('[role="columnheader"]')).toHaveLength(7);
    expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength(42);
    expect(q(container, '[role="gridcell"][tabindex="0"]').getAttribute('data-date')).toBe(
      '2026-11-07',
    );
    expect(q(container, '[aria-current="date"] .apui-sr-only').textContent).toBe(
      'Saturday, November 7, 2026',
    );
  });

  it('names events by title, category and time, and folds the rest into +N more', () => {
    const { container } = render(Calendar, { props: base, attrs });
    const event = q(container, '[data-date="2026-11-02"] [data-part="event"]');
    expect(event.tagName).toBe('BUTTON');
    expect(event.getAttribute('aria-haspopup')).toBe('dialog');
    expect(event.hasAttribute('aria-label')).toBe(false);
    expect(event.textContent).toBe(
      '09:00Team meeting, Marketing, Monday, November 2, 2026, 09:00 – 10:00',
    );
    const more = q(container, '[data-date="2026-11-12"] [data-part="more"]');
    expect(more.textContent?.trim()).toBe('+1 more');
    expect(more.getAttribute('aria-label')).toBe(
      'Show 1 more events on Thursday, November 12, 2026',
    );
  });

  it('moves between dates and views and emits the v-model events', async () => {
    const { container, emitted } = render(Calendar, { props: base, attrs });
    await fireEvent.click(q(container, '[data-part="next-trigger"]'));
    expect(emitted()['date-change']![0]).toEqual(['2026-12-07']);
    expect(emitted()['update:date']![0]).toEqual(['2026-12-07']);
    expect(q(container, '#cal-title').textContent?.trim()).toBe('December 2026');
    await fireEvent.click(screen.getByRole('tab', { name: 'Week' }));
    expect(emitted()['view-change']![0]).toEqual(['week']);
    expect(q(container, '#cal-title').textContent?.trim()).toBe('Dec 7 – Dec 13, 2026');
    expect(q(container, '#cal-body').getAttribute('aria-labelledby')).toBe('cal-tab-week');
  });

  it('opens the day from +N more', async () => {
    const { container } = render(Calendar, { props: base, attrs });
    await fireEvent.click(q(container, '[data-date="2026-11-12"] [data-part="more"]'));
    expect(q(container, '.apui-calendar').getAttribute('data-view')).toBe('day');
    expect(container.querySelectorAll('[data-part="event"]')).toHaveLength(3);
  });

  it('moves focus to the day +N more opens', async () => {
    const { container } = render(Calendar, { props: base, attrs });
    const more = q(container, '[data-date="2026-11-12"] [data-part="more"]');
    more.focus();
    await fireEvent.click(more);
    await nextTick();
    const cell = q(container, '[role="gridcell"][data-date="2026-11-12"]');
    expect(document.activeElement).toBe(cell);
    expect(cell.tabIndex).toBe(0);
  });

  it('gives a 2.x v-model that starts empty its first date', async () => {
    const value = ref<string | undefined>(undefined);
    const Host = defineComponent({
      setup: () => () =>
        h(Calendar, {
          ...base,
          ...attrs,
          date: '2026-11-07',
          modelValue: value.value,
          'onUpdate:modelValue': (next: string) => {
            value.value = next;
          },
        }),
    });
    const { container } = render(Host);
    await fireEvent.click(q(container, '[data-part="next-trigger"]'));
    expect(value.value).toBe('2026-12-07');
  });

  it('emits event-click and opens the details Dialog', async () => {
    const { container, emitted } = render(Calendar, { props: base, attrs });
    await fireEvent.click(q(container, '[data-date="2026-11-02"] [data-part="event"]'));
    expect(emitted()['event-click']![0]).toEqual([events[0]]);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.textContent).toContain('Team meeting');
    expect(dialog.textContent).toContain('Monday, November 2, 2026, 09:00 – 10:00');
    expect(dialog.textContent).toContain('Weekly sync.');
  });

  it('renders links for events with href and the New event button', async () => {
    const { container, emitted } = render(Calendar, {
      props: { ...base, maxEvents: 3, creatable: true },
      attrs,
    });
    const link = q(container, 'a[data-part="event"]');
    expect(link.getAttribute('href')).toBe('https://example.com/dinner');
    expect(link.hasAttribute('aria-haspopup')).toBe(false);
    await fireEvent.click(q(container, '[data-part="create-trigger"]'));
    expect(emitted().create![0]).toEqual(['2026-11-07']);
  });

  it('moves focus with the arrow keys, following the text direction', async () => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('dir', 'rtl');
    document.body.appendChild(wrapper);
    const { container } = render(Calendar, { props: base, attrs, container: wrapper });
    const start = q(container, '[data-date="2026-11-07"]');
    start.focus();
    await fireEvent.keyDown(start, { key: 'ArrowLeft' });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-08');
    await fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-01');
    await fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-11-01');
    wrapper.remove();
  });

  it('keeps one tab stop after arrow keys and a period change', async () => {
    const { container } = render(Calendar, { props: base, attrs });
    const start = q(container, '[data-date="2026-11-07"]');
    start.focus();
    await fireEvent.keyDown(start, { key: 'ArrowUp' });
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-10-31');
    await fireEvent.click(q(container, '[data-part="previous-trigger"]'));
    expect(q(container, '#cal-title').textContent?.trim()).toBe('October 2026');
    expect(container.querySelectorAll('[role="gridcell"][tabindex="0"]')).toHaveLength(1);
    await fireEvent.click(q(container, '[data-part="next-trigger"]'));
    expect(container.querySelectorAll('[role="gridcell"][tabindex="0"]')).toHaveLength(1);
  });

  it('reads the 2.x month as 1–12, clamped, and emits month-change', async () => {
    const december = render(Calendar, { props: { ...base, month: 12, year: 2026 }, attrs });
    expect(q(december.container, '#cal-title').textContent?.trim()).toBe('December 2026');
    december.unmount();
    const clamped = render(Calendar, { props: { ...base, month: 13, year: 2026 }, attrs });
    expect(q(clamped.container, '#cal-title').textContent?.trim()).toBe('December 2026');
    clamped.unmount();
    const { container, emitted, rerender } = render(Calendar, {
      props: { ...base, month: 0, year: 2026 },
      attrs,
    });
    expect(q(container, '#cal-title').textContent?.trim()).toBe('January 2026');
    await fireEvent.click(q(container, '[data-part="previous-trigger"]'));
    expect(emitted()['month-change']![0]).toEqual([{ month: 12, year: 2025 }]);
    await fireEvent.click(q(container, '[data-part="today-trigger"]'));
    expect(emitted()['month-change']![1]).toEqual([{ month: 11, year: 2026 }]);
    await fireEvent.click(q(container, '[data-part="today-trigger"]'));
    expect(emitted()['month-change']).toHaveLength(2);
    await rerender({ month: 3, year: 2027 });
    expect(q(container, '#cal-title').textContent?.trim()).toBe('March 2027');
  });

  it('keeps the day when a 2.x parent writes month-change back', async () => {
    const Host = defineComponent({
      setup() {
        const month = ref(3);
        const year = ref(2026);
        return () =>
          h(Calendar, {
            id: 'cal',
            view: 'day',
            today: '2026-03-01',
            month: month.value,
            year: year.value,
            'onMonth-change': (change: { month: number; year: number }) => {
              month.value = change.month;
              year.value = change.year;
            },
          });
      },
    });
    const { container } = render(Host);
    const title = () => q(container, '#cal-title').textContent?.trim();
    expect(title()).toContain('March 1');
    await fireEvent.click(q(container, '[data-part="previous-trigger"]'));
    expect(title()).toContain('February 28');
    await fireEvent.click(q(container, '[data-part="previous-trigger"]'));
    expect(title()).toContain('February 27');
  });

  it('renders the agenda as a list, with an empty state', () => {
    const { container } = render(Calendar, { props: { ...base, view: 'agenda' }, attrs });
    expect(container.querySelectorAll('ul[data-part="grid"] > li[data-part="row"]')).toHaveLength(
      2,
    );
    expect(q(container, 'h3[data-part="weekday"]').textContent?.trim()).toBe(
      'Monday, November 2, 2026',
    );
    const empty = render(Calendar, { props: { ...base, events: [], view: 'agenda' } });
    expect(q(empty.container, '.apui-empty-state').textContent).toContain('No events');
  });

  it('takes labels, classes and the 2.x props', () => {
    const { container } = render(Calendar, {
      props: {
        events: [{ id: 'x', date: '2026-11-03', title: '2.x event' }],
        month: 11,
        year: 2026,
        weekStart: 0,
        labels: { today: 'Hoy' },
        classes: { cell: 'my-cell' },
      },
      attrs,
    });
    expect(q(container, '[data-part="today-trigger"]').textContent?.trim()).toBe('Hoy');
    expect(q(container, '[role="columnheader"]').textContent?.trim()).toBe('Sun');
    expect(container.querySelectorAll('.my-cell')).toHaveLength(35);
    expect(q(container, '[data-date="2026-11-03"] [data-part="event-title"]').textContent).toBe(
      '2.x event',
    );
  });
});
