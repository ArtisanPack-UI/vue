import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { h, nextTick } from 'vue';
import { Popover } from '../../components/layout';
import { Button } from '../../components/form';

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="popover"][data-part="${name}"]`);

const panel = () => document.body.querySelector<HTMLElement>('.apui-popover')!;

const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('Popover', () => {
  it('renders a hidden, non-modal dialog panel with the requested placement', () => {
    render(Popover, { props: { title: 'Share report', trigger: 'Share' } });
    const root = panel();
    expect(root.getAttribute('data-part')).toBe('content');
    expect(root.getAttribute('role')).toBe('dialog');
    expect(root.hasAttribute('aria-modal')).toBe(false);
    expect(root.getAttribute('data-placement')).toBe('bottom');
    expect(root.hidden).toBe(true);
  });

  it('renders arrow, title, body and actions in order', () => {
    render(Popover, {
      props: { open: true, portal: false, title: 'Share report', actions: 'Copy link' },
      slots: { default: 'Body' },
    });
    expect([...panel().children].map((el) => el.getAttribute('data-part'))).toEqual([
      'arrow',
      'title',
      'body',
      'actions',
    ]);
    expect(partOf('arrow')!.getAttribute('aria-hidden')).toBe('true');
    expect(partOf('title')!.tagName).toBe('H3');
    expect(screen.getByRole('dialog', { name: 'Share report' })).toBe(panel());
  });

  it('renders a text trigger as an outline Button that controls the panel', () => {
    render(Popover, { props: { title: 'T', trigger: 'Share' } });
    const trigger = screen.getByRole('button', { name: 'Share' });
    expect(trigger.getAttribute('data-part')).toBe('trigger');
    expect(trigger.getAttribute('data-variant')).toBe('outline');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-controls')).toBe(panel().id);
  });

  it('uses an element in the trigger slot as the trigger itself', async () => {
    render(Popover, {
      props: { title: 'About visits' },
      slots: {
        trigger: () =>
          h(Button, {
            id: 'about',
            variant: 'ghost',
            iconOnly: true,
            leadingIcon: 'info',
            'aria-label': 'About visits',
          }),
        default: 'Text',
      },
    });
    const trigger = screen.getByRole('button', { name: 'About visits' });
    expect(trigger.id).toBe('about');
    expect(trigger.getAttribute('data-variant')).toBe('ghost');
    expect(trigger.getAttribute('data-part')).toBe('trigger');
    expect(document.querySelectorAll('[data-part="trigger"]')).toHaveLength(1);
    await fireEvent.click(trigger);
    await settle();
    expect(panel().hidden).toBe(false);
  });

  it('opens on click, reports it, and closes on Escape', async () => {
    const { emitted } = render(Popover, {
      props: { title: 'Share report', trigger: 'Share' },
      slots: { default: '<button>Copy</button>' },
    });
    await fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    await settle();
    expect(panel().hidden).toBe(false);
    await fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    await settle();
    expect(emitted('update:open')).toEqual([[true], [false]]);
    expect(panel().hidden).toBe(true);
  });

  it('emits placement and drops the arrow', () => {
    render(Popover, { props: { open: true, title: 'T', placement: 'end', arrow: false } });
    expect(panel().getAttribute('data-placement')).toBe('end');
    expect(partOf('arrow')).toBeNull();
  });

  it('uses no DaisyUI classes', () => {
    render(Popover, { props: { open: true, title: 'T', trigger: 'Share' } });
    expect(document.body.innerHTML).not.toMatch(/\b(dropdown-content|bg-base-100|rounded-box)\b/);
  });
});
