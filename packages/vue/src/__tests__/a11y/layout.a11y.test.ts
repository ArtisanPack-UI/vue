import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import {
  Accordion,
  Card,
  Collapse,
  Dialog,
  Divider,
  DropdownMenu,
  Grid,
  Stack,
  Tabs,
} from '../../components/layout';

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
      props: { title: 'Quarterly report', description: 'Updated 2 hours ago', href: '/reports/q3' },
      slots: { default: '<p>Card content</p>', footer: '3 comments' },
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
        label: 'Sections',
        tabs: [
          { value: 'tab1', label: 'Tab 1', icon: 'list', content: 'First panel' },
          { value: 'tab2', label: 'Tab 2', count: 4, content: 'Second panel' },
          { value: 'tab3', label: 'Tab 3', disabled: true, content: 'Third panel' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Dialog has no a11y violations', async () => {
    const { container } = render(Dialog, {
      props: {
        open: true,
        portal: false,
        modal: false,
        trigger: 'Invite',
        icon: 'user',
        title: 'Invite member',
        description: 'Members can edit every listing.',
      },
      slots: { default: '<p>They’ll get an email.</p>', footer: '<button>Send invite</button>' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Dialog has no a11y violations when modal and teleported', async () => {
    render(Dialog, {
      props: {
        open: true,
        trigger: 'Invite',
        title: 'Invite member',
        description: 'Members can edit every listing.',
      },
      slots: { default: '<p>They’ll get an email.</p>', footer: '<button>Send invite</button>' },
    });
    const panel = document.body.querySelector('.apui-dialog')!;
    expect(panel.parentElement!.parentElement).toBe(document.body);
    expect(panel.getAttribute('aria-modal')).toBe('true');
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });

  it('DropdownMenu has no a11y violations', async () => {
    const { container } = render(DropdownMenu, {
      props: {
        open: true,
        portal: false,
        label: 'Options',
        items: [
          {
            type: 'group',
            label: 'Listing',
            items: [
              { value: 'edit', label: 'Edit', icon: 'pencil', shortcut: 'E' },
              { value: 'archive', label: 'Archive', disabled: true },
            ],
          },
          { type: 'separator' },
          { type: 'checkbox', value: 'grid', label: 'Show grid', checked: true },
          { value: 'delete', label: 'Delete', icon: 'trash', color: 'error' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
