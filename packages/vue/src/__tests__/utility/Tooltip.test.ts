import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { h, nextTick } from 'vue';
import { Tooltip } from '../../components/utility';
import { Button } from '../../components/form';

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="tooltip"][data-part="${name}"]`);

const label = () => document.body.querySelector<HTMLElement>('.apui-tooltip')!;

const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('Tooltip', () => {
  it('renders the label with role tooltip, placement, size and shortcut keys', () => {
    render(Tooltip, {
      props: {
        open: true,
        portal: false,
        content: 'Archive',
        shortcut: '⌘+E',
        placement: 'bottom',
        size: 'lg',
      },
      slots: { default: '<button>A</button>' },
    });
    const root = label();
    expect(root.getAttribute('data-part')).toBe('content');
    expect(root.getAttribute('role')).toBe('tooltip');
    expect(root.getAttribute('data-placement')).toBe('bottom');
    expect(root.getAttribute('data-size')).toBe('lg');
    expect(root.getAttribute('data-state')).toBe('open');
    expect(root.hidden).toBe(false);
    expect(root.firstElementChild!.getAttribute('data-part')).toBe('arrow');
    expect([...root.querySelectorAll('kbd')].map((el) => el.textContent)).toEqual(['⌘', 'E']);
    expect(root.textContent).toBe('Archive⌘E');
  });

  it('puts the trigger part on the slot element, keeping its id and name', () => {
    render(Tooltip, {
      props: { open: true, portal: false, content: 'Archive this listing' },
      slots: {
        default: () =>
          h(Button, {
            id: 'archive',
            iconOnly: true,
            leadingIcon: 'pencil',
            'aria-label': 'Archive',
          }),
      },
    });
    const trigger = screen.getByRole('button', { name: 'Archive' });
    expect(trigger.id).toBe('archive');
    expect(trigger.getAttribute('data-scope')).toBe('tooltip');
    expect(trigger.getAttribute('data-part')).toBe('trigger');
    expect(trigger.getAttribute('aria-describedby')).toBe(label().id);
    expect(document.querySelectorAll('[data-part="trigger"]')).toHaveLength(1);
  });

  it('wraps text in a focusable span', () => {
    render(Tooltip, { props: { content: 'More' }, slots: { default: 'Help' } });
    const trigger = partOf('trigger')!;
    expect(trigger.tagName).toBe('SPAN');
    expect(trigger.getAttribute('tabindex')).toBe('0');
    expect(trigger.textContent).toBe('Help');
  });

  it('is hidden until focus, reports it, and Escape hides it', async () => {
    const { emitted } = render(Tooltip, {
      props: { content: 'Archive' },
      slots: { default: '<button>A</button>' },
    });
    expect(label().hidden).toBe(true);
    const trigger = screen.getByRole('button', { name: 'A' });
    await fireEvent.keyDown(document.body, { key: 'Tab' });
    trigger.focus();
    await settle();
    expect(label().hidden).toBe(false);
    await fireEvent.keyDown(document, { key: 'Escape' });
    await settle();
    expect(label().hidden).toBe(true);
    expect(emitted('update:open')).toEqual([[true], [false]]);
  });

  it('lets the content slot override the prop', () => {
    render(Tooltip, {
      props: { open: true, content: 'Plain' },
      slots: { default: '<button>A</button>', content: '<strong>Bold</strong>' },
    });
    expect(label().querySelector('strong')!.textContent).toBe('Bold');
  });

  it('marks a disabled tooltip and merges classes', () => {
    render(Tooltip, {
      props: { open: true, disabled: true, content: 'A', classes: { trigger: 't', root: 'r' } },
      slots: { default: '<button class="own">A</button>' },
    });
    expect(label().hasAttribute('data-disabled')).toBe(true);
    expect(label().classList.contains('r')).toBe(true);
    const trigger = screen.getByRole('button', { name: 'A' });
    expect(trigger.classList.contains('own')).toBe(true);
    expect(trigger.classList.contains('t')).toBe(true);
  });

  it('uses no DaisyUI classes', () => {
    render(Tooltip, {
      props: { open: true, content: 'A' },
      slots: { default: '<button>A</button>' },
    });
    expect(document.body.innerHTML).not.toMatch(/\b(tooltip-open|tooltip-top|data-tip)\b/);
  });

  it('keeps an author aria-label on the label', () => {
    render(Tooltip, {
      props: { open: true, content: 'A' },
      attrs: { 'aria-label': 'Archive item' },
      slots: { default: '<button>A</button>' },
    });
    expect(label().getAttribute('aria-label')).toBe('Archive item');
  });
});
