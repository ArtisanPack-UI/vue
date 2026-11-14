import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import {
  Avatar,
  Badge,
  Code,
  Diff,
  Progress,
  ProgressRadial,
  Sparkline,
  Stat,
  Timeline,
} from '../../components/display';

describe('Display components accessibility', () => {
  it('Avatar has no a11y violations', async () => {
    const { container } = render(Avatar, {
      props: { name: 'Olivia Rhye', status: 'online' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Badge has no a11y violations', async () => {
    const { container } = render(Badge, {
      props: { color: 'success', dot: true },
      slots: { default: 'New' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Code has no a11y violations', async () => {
    const { container } = render(Code, {
      props: { code: 'const x = 1;' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Diff has no a11y violations', async () => {
    const { container } = render(Diff, {
      props: { oldContent: 'Original text', newContent: 'Modified text', fileName: 'notes.txt' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Progress has no a11y violations', async () => {
    const { container } = render(Progress, {
      props: { value: 75, max: 100, label: 'Uploading photos' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ProgressRadial has no a11y violations', async () => {
    const { container } = render(ProgressRadial, {
      props: { value: 68, label: 'complete' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Sparkline has no a11y violations', async () => {
    const { container } = render(Sparkline, {
      props: { data: [10, 20, 15, 25, 30] },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Stat has no a11y violations', async () => {
    const { container } = render(Stat, {
      props: {
        label: 'Revenue',
        value: '$12,345',
        icon: 'wallet',
        change: 4.2,
        description: 'vs last month',
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Timeline has no a11y violations', async () => {
    const { container } = render(Timeline, {
      props: {
        items: [
          { title: 'Event 1', time: 'Nov 7', datetime: '2026-11-07', description: 'First event' },
          { title: 'Event 2', icon: 'house', color: 'success', card: 'Second event' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
