import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import { Accordion, Card, Collapse, Divider, Grid, Stack, Tabs } from '../../components/layout';

describe('Layout components accessibility', () => {
  it('Accordion has no a11y violations', async () => {
    const { container } = render(Accordion, {
      slots: {
        default: `
          <div data-accordion-item>
            <button>Section 1</button>
            <div>Content 1</div>
          </div>
        `,
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Card has no a11y violations', async () => {
    const { container } = render(Card, {
      slots: { default: '<p>Card content</p>' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Collapse has no a11y violations', async () => {
    const { container } = render(Collapse, {
      props: { title: 'Details' },
      slots: { default: '<p>Collapsed content</p>' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Divider has no a11y violations', async () => {
    const { container } = render(Divider);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Grid has no a11y violations', async () => {
    const { container } = render(Grid, {
      props: { cols: 3 },
      slots: { default: '<div>Item 1</div><div>Item 2</div><div>Item 3</div>' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Stack has no a11y violations', async () => {
    const { container } = render(Stack, {
      slots: { default: '<div>Item 1</div><div>Item 2</div>' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Tabs has no a11y violations', async () => {
    const { container } = render(Tabs, {
      props: {
        tabs: [
          { name: 'tab1', label: 'Tab 1' },
          { name: 'tab2', label: 'Tab 2' },
        ],
      },
      slots: { default: '<p>Tab content</p>' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
