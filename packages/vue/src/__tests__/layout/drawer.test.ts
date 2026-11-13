import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Drawer } from '../../components/layout';

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="drawer"][data-part="${name}"]`);

const panel = () => document.body.querySelector<HTMLElement>('.apui-drawer')!;

const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('Drawer', () => {
  it('renders the closed panel hidden, scoped drawer, at the end by default', () => {
    render(Drawer, { props: { title: 'Filters' } });
    const root = panel();
    expect(root.tagName).toBe('ASIDE');
    expect(root.getAttribute('data-scope')).toBe('drawer');
    expect(root.getAttribute('data-part')).toBe('content');
    expect(root.getAttribute('role')).toBe('dialog');
    expect(root.getAttribute('data-side')).toBe('end');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-surface')).toBe('overlay');
    expect(root.hidden).toBe(true);
    expect(partOf('positioner')!.getAttribute('data-side')).toBe('end');
    expect(partOf('backdrop')!.hidden).toBe(true);
  });

  it('renders the header, body and footer, and the sheet handle for bottom', () => {
    render(Drawer, {
      props: {
        open: true,
        side: 'bottom',
        title: 'Filters',
        description: '218 match',
        footer: 'Apply',
        portal: false,
      },
      slots: { default: 'Body' },
    });
    expect([...panel().children].map((el) => el.getAttribute('data-part'))).toEqual([
      'handle',
      'header',
      'body',
      'footer',
    ]);
    expect(partOf('handle')!.getAttribute('aria-hidden')).toBe('true');
    expect(screen.getByRole('dialog', { name: 'Filters' })).toBe(panel());
    expect(panel().getAttribute('aria-describedby')).toBe(partOf('description')!.id);
  });

  it('emits side, size and surface, and hides the close button', () => {
    render(Drawer, {
      props: {
        open: true,
        title: 'T',
        side: 'start',
        size: 'lg',
        surface: 'glass',
        hideClose: true,
      },
    });
    expect(panel().getAttribute('data-side')).toBe('start');
    expect(panel().getAttribute('data-size')).toBe('lg');
    expect(panel().getAttribute('data-surface')).toBe('glass');
    expect(partOf('close-trigger')).toBeNull();
  });

  it('opens from the trigger, reports it, and closes from the close button', async () => {
    const { emitted } = render(Drawer, {
      props: { title: 'Filters', trigger: 'Filters', closeLabel: 'Fermer' },
    });
    const trigger = screen.getByRole('button', { name: 'Filters' });
    expect(trigger.getAttribute('data-scope')).toBe('drawer');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    await fireEvent.click(trigger);
    await settle();
    expect(panel().hidden).toBe(false);
    expect(panel().getAttribute('aria-modal')).toBe('true');
    await fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    await settle();
    expect(emitted('update:open')).toEqual([[true], [false]]);
    expect(panel().hidden).toBe(true);
  });

  it('follows v-model:open', async () => {
    const open = ref(false);
    render(
      defineComponent({
        setup: () => () =>
          h(Drawer, {
            title: 'Filters',
            open: open.value,
            'onUpdate:open': (value: boolean) => (open.value = value),
          }),
      }),
    );
    expect(panel().hidden).toBe(true);
    open.value = true;
    await settle();
    expect(panel().hidden).toBe(false);
    await fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    await settle();
    expect(open.value).toBe(false);
  });

  it('puts class and attributes on the panel and classes on the parts', () => {
    render(Drawer, {
      props: { open: true, title: 'T', classes: { body: 'b', root: 'r' } },
      attrs: { class: 'extra', 'data-testid': 'drawer' },
      slots: { default: 'Body' },
    });
    expect(panel().classList.contains('apui-drawer')).toBe(true);
    expect(panel().classList.contains('r')).toBe(true);
    expect(panel().classList.contains('extra')).toBe(true);
    expect(panel().getAttribute('data-testid')).toBe('drawer');
    expect(partOf('body')!.classList.contains('b')).toBe(true);
  });

  it('uses no DaisyUI classes', () => {
    render(Drawer, { props: { open: true, title: 'T', trigger: 'Open' } });
    expect(document.body.innerHTML).not.toMatch(
      /\b(drawer-side|drawer-toggle|drawer-overlay|bg-base-100)\b/,
    );
  });

  it('keeps the author aria-label as the name of an untitled drawer', () => {
    render(Drawer, { props: { open: true }, attrs: { 'aria-label': 'Filters' } });
    expect(panel().getAttribute('aria-label')).toBe('Filters');
  });
});
