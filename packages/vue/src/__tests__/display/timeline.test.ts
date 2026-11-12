import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import Timeline from '../../components/display/Timeline/Timeline.vue';
import TimelineItem from '../../components/display/Timeline/TimelineItem.vue';

describe('Timeline', () => {
  it('composes an ordered list from TimelineItem children', () => {
    const { container } = render(Timeline, {
      props: { label: 'Activity' },
      slots: {
        default: () => [
          h(
            TimelineItem,
            {
              icon: 'circle-check',
              color: 'success',
              time: '2h ago',
              datetime: '2026-11-12T08:00',
              description: 'Phoenix Baker accepted $248,000.',
            },
            { default: () => [h('strong', 'Offer accepted'), ' on Lakeview Lofts'] },
          ),
          h(TimelineItem, { title: 'Listing published', time: 'Dec 13' }),
        ],
      },
    });
    const list = screen.getByRole('list', { name: 'Activity' });
    expect(list.className).toBe('apui-timeline');
    expect(list.getAttribute('data-variant')).toBe('icon');
    const items = container.querySelectorAll('li[data-scope="timeline"][data-part="item"]');
    expect(items).toHaveLength(2);
    expect([...items[0]!.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'marker',
      'head',
      'body',
    ]);
    const marker = items[0]!.querySelector('[data-part="marker"]')!;
    expect(marker.getAttribute('data-color')).toBe('success');
    expect(marker.getAttribute('aria-hidden')).toBe('true');
    expect(marker.querySelector('svg')).not.toBeNull();
    expect(items[0]!.querySelector('[data-part="head"] > strong')!.textContent).toBe(
      'Offer accepted',
    );
    expect(items[0]!.querySelector('time[data-part="time"]')!.getAttribute('datetime')).toBe(
      '2026-11-12T08:00',
    );
    expect(items[1]!.querySelector('[data-part="marker"]')!.hasAttribute('data-color')).toBe(false);
  });

  it('renders items before composed children, with dots and cards', () => {
    const { container } = render(Timeline, {
      props: {
        variant: 'dot',
        items: [
          { title: 'Delivered', time: 'Nov 7', color: 'success' },
          { title: 'Olivia commented', card: 'Thursday at 11?', icon: 'message-square' },
        ],
      },
      slots: { default: () => h(TimelineItem, { title: 'Shipped' }) },
    });
    expect(container.querySelector('ol')!.getAttribute('data-variant')).toBe('dot');
    expect(
      [...container.querySelectorAll('[data-part="head"]')].map((head) => head.textContent),
    ).toEqual(['DeliveredNov 7', 'Olivia commented', 'Shipped']);
    expect(container.querySelector('[data-part="card"]')!.textContent).toBe('Thursday at 11?');
    expect(container.querySelector('time')!.hasAttribute('datetime')).toBe(false);
  });

  it('passes classes to items rendered with v-for', () => {
    const Host = defineComponent({
      components: { Timeline, TimelineItem },
      setup: () => ({ titles: ['A', 'B'] }),
      template: `<Timeline :classes="{ root: 'r', item: 'i', time: 't' }"><TimelineItem v-for="title in titles" :key="title" :title="title" time="now" /></Timeline>`,
    });
    const { container } = render(Host);
    expect(container.querySelector('ol')!.className).toBe('apui-timeline r');
    expect(container.querySelectorAll('li.i')).toHaveLength(2);
    expect(container.querySelectorAll('time.t')).toHaveLength(2);
  });
});
