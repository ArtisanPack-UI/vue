import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import {
  Avatar,
  Badge,
  Code,
  Diff,
  Progress,
  Sparkline,
  Stat,
  Timeline,
} from '../../components/display';

describe('Display components accessibility', () => {
  it('Avatar has no a11y violations', async () => {
    const { container } = render(Avatar, {
      props: { alt: 'User avatar' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Badge has no a11y violations', async () => {
    const { container } = render(Badge, {
      props: { value: 'New' },
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
      props: { before: 'Original text', after: 'Modified text' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Progress has no a11y violations', async () => {
    const { container } = render(Progress, {
      props: { value: 75, max: 100 },
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
      props: { title: 'Revenue', value: '$12,345' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Timeline has no a11y violations', async () => {
    const { container } = render(Timeline, {
      props: {
        items: [
          { id: '1', title: 'Event 1', description: 'First event' },
          { id: '2', title: 'Event 2', description: 'Second event' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
