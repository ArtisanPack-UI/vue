import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { Dialog } from '../../components/layout';

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="dialog"][data-part="${name}"]`);

const panel = () => document.body.querySelector<HTMLElement>('.apui-dialog')!;

/** Lets the machine's effects run (focus, dismissal listeners). */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

/** A parent that binds `v-model:open`. */
function bound(props: Record<string, unknown> = {}, initial = false) {
  const open = ref(initial);
  const Host = defineComponent({
    setup: () => () =>
      h(
        Dialog,
        {
          title: 'Invite member',
          ...props,
          open: open.value,
          'onUpdate:open': (value: boolean) => (open.value = value),
        },
        { default: () => h('input', { 'aria-label': 'Email' }) },
      ),
  });
  return { open, ...render(Host) };
}

describe('Dialog', () => {
  it('renders the closed panel hidden, with its default data attributes', () => {
    render(Dialog, { props: { title: 'Invite member' } });
    const root = panel();
    expect(root.tagName).toBe('DIV');
    expect(root.getAttribute('data-scope')).toBe('dialog');
    expect(root.getAttribute('data-part')).toBe('content');
    expect(root.getAttribute('role')).toBe('dialog');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-surface')).toBe('overlay');
    expect(root.hasAttribute('data-color')).toBe(false);
    expect(root.hidden).toBe(true);
    expect(partOf('backdrop')!.hidden).toBe(true);
    expect(partOf('positioner')).not.toBeNull();
  });

  it('teleports to the body by default and renders in place without portal', () => {
    const teleported = render(Dialog, { props: { title: 'Teleported' } });
    expect(teleported.container.querySelector('.apui-dialog')).toBeNull();
    teleported.unmount();

    const inPlace = render(Dialog, { props: { title: 'In place', portal: false } });
    expect(inPlace.container.querySelector('.apui-dialog')).not.toBeNull();
    expect(partOf('backdrop', inPlace.container)).not.toBeNull();
  });

  it('renders the header, body and footer parts', () => {
    render(Dialog, {
      props: {
        open: true,
        icon: 'user',
        title: 'Invite member',
        description: 'Members can edit every listing.',
        footer: 'Send invite',
      },
      slots: { default: 'Body' },
    });
    const header = partOf('header')!;
    expect([...header.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'title',
      'description',
      'close-trigger',
    ]);
    expect(partOf('icon')!.getAttribute('aria-hidden')).toBe('true');
    expect(partOf('icon')!.querySelector('svg')).not.toBeNull();
    expect(partOf('title')!.tagName).toBe('H2');
    expect(partOf('description')!.tagName).toBe('P');
    expect(partOf('body')!.textContent).toBe('Body');
    expect(partOf('footer')!.textContent).toBe('Send invite');
  });

  it('links the title and description to the panel', () => {
    render(Dialog, {
      props: { open: true, title: 'Invite member', description: 'Members can edit.' },
    });
    expect(screen.getByRole('dialog', { name: 'Invite member' })).toBe(panel());
    expect(panel().getAttribute('aria-describedby')).toBe(partOf('description')!.id);
  });

  it('emits size, surface and color', () => {
    render(Dialog, {
      props: { open: true, title: 'T', size: 'lg', surface: 'glass', color: 'error' },
    });
    expect(panel().getAttribute('data-size')).toBe('lg');
    expect(panel().getAttribute('data-surface')).toBe('glass');
    expect(panel().getAttribute('data-color')).toBe('error');
  });

  it('lets slots override the props', () => {
    render(Dialog, {
      props: { open: true, title: 'Prop title', icon: 'user', footer: 'Prop footer' },
      slots: {
        title: '<em>Slot title</em>',
        description: 'Slot description',
        icon: '<svg data-testid="custom-icon" />',
        footer: '<button>Save</button>',
      },
    });
    expect(partOf('title')!.innerHTML).toBe('<em>Slot title</em>');
    expect(partOf('description')!.textContent).toBe('Slot description');
    expect(screen.getByTestId('custom-icon')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy();
  });

  it('renders the close button as an icon-only ghost Button named Close', () => {
    render(Dialog, { props: { open: true, title: 'T' } });
    const close = partOf('close-trigger')!;
    expect(close.classList.contains('apui-button')).toBe(true);
    expect(close.getAttribute('data-variant')).toBe('ghost');
    expect(close.getAttribute('data-color')).toBe('neutral');
    expect(close.getAttribute('data-size')).toBe('sm');
    expect(close.hasAttribute('data-icon-only')).toBe(true);
    expect(close.getAttribute('aria-label')).toBe('Close');
  });

  it('names the close button with closeLabel', () => {
    render(Dialog, { props: { open: true, title: 'T', closeLabel: 'Schließen' } });
    expect(partOf('close-trigger')!.getAttribute('aria-label')).toBe('Schließen');
  });

  it('hides the close button with hideClose, and the header with nothing in it', () => {
    render(Dialog, { props: { open: true, hideClose: true }, slots: { default: 'Body' } });
    expect(partOf('close-trigger')).toBeNull();
    expect(partOf('header')).toBeNull();
  });

  it('renders the trigger only when given, as an outline neutral Button', () => {
    const without = render(Dialog, { props: { title: 'T' } });
    expect(partOf('trigger')).toBeNull();
    without.unmount();

    render(Dialog, { props: { title: 'T', trigger: 'Invite' } });
    const trigger = screen.getByRole('button', { name: 'Invite' });
    expect(trigger.getAttribute('data-part')).toBe('trigger');
    expect(trigger.getAttribute('data-variant')).toBe('outline');
    expect(trigger.getAttribute('data-color')).toBe('neutral');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens from the trigger and reports it, even without v-model', async () => {
    const { emitted } = render(Dialog, { props: { title: 'T', trigger: 'Invite' } });
    await fireEvent.click(screen.getByRole('button', { name: 'Invite' }));
    await settle();
    expect(emitted('update:open')).toEqual([[true]]);
    expect(panel().hidden).toBe(false);
    expect(panel().getAttribute('data-state')).toBe('open');
  });

  it('follows v-model:open', async () => {
    const { open } = bound();
    expect(panel().hidden).toBe(true);
    open.value = true;
    await settle();
    expect(panel().hidden).toBe(false);
    open.value = false;
    await settle();
    expect(panel().hidden).toBe(true);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const { open } = bound({ trigger: 'Invite' });
    const trigger = screen.getByRole('button', { name: 'Invite' });
    trigger.focus();
    await fireEvent.click(trigger);
    await settle();
    expect(open.value).toBe(true);
    await vi.waitFor(() => expect(panel().contains(document.activeElement)).toBe(true));

    await fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    await settle();
    expect(open.value).toBe(false);
    expect(panel().hidden).toBe(true);
    await vi.waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('stays open when the parent vetoes the change', async () => {
    const onUpdate = vi.fn();
    render(
      defineComponent({
        setup: () => () => h(Dialog, { title: 'T', open: true, 'onUpdate:open': onUpdate }),
      }),
    );
    await settle();
    await fireEvent.keyDown(panel(), { key: 'Escape' });
    await fireEvent.click(partOf('close-trigger')!);
    await settle();
    expect(onUpdate).toHaveBeenCalledWith(false);
    expect(panel().hidden).toBe(false);
    expect(panel().getAttribute('data-state')).toBe('open');
  });

  it('keeps a static :open="true" open', async () => {
    const { emitted } = render(Dialog, { props: { title: 'T', open: true } });
    await settle();
    await fireEvent.click(partOf('close-trigger')!);
    await settle();
    expect(emitted('update:open')).toEqual([[false]]);
    expect(panel().hidden).toBe(false);
  });

  it('closes from the close button', async () => {
    const { open } = bound({}, true);
    await settle();
    await fireEvent.click(partOf('close-trigger')!);
    await settle();
    expect(open.value).toBe(false);
  });

  it('closes a dialog on a pointer-down outside the panel', async () => {
    const { open } = bound({}, true);
    await settle();
    await new Promise((resolve) => setTimeout(resolve, 50));
    await fireEvent.pointerDown(partOf('backdrop')!);
    await fireEvent.pointerUp(partOf('backdrop')!);
    await vi.waitFor(() => expect(open.value).toBe(false));
    expect(panel().hidden).toBe(true);
  });

  it("doesn't close an alertdialog on a pointer-down outside the panel", async () => {
    const { open } = bound({ role: 'alertdialog' }, true);
    await settle();
    await new Promise((resolve) => setTimeout(resolve, 50));
    await fireEvent.pointerDown(partOf('backdrop')!);
    await fireEvent.pointerUp(partOf('backdrop')!);
    await settle();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(open.value).toBe(true);
    expect(panel().hidden).toBe(false);
  });

  it('starts focus on the close button for an alertdialog', async () => {
    // jsdom has no layout, so the focus trap would think every button hidden.
    const rects = vi
      .spyOn(HTMLElement.prototype, 'getClientRects')
      .mockReturnValue([new DOMRect(0, 0, 10, 10)] as unknown as DOMRectList);
    try {
      bound({ role: 'alertdialog' }, true);
      await settle();
      expect(panel().getAttribute('role')).toBe('alertdialog');
      await vi.waitFor(() => expect(document.activeElement).toBe(partOf('close-trigger')));
    } finally {
      rects.mockRestore();
    }
  });

  it('sets aria-modal only while modal', () => {
    const modal = render(Dialog, { props: { open: true, title: 'T' } });
    expect(panel().getAttribute('aria-modal')).toBe('true');
    modal.unmount();
    render(Dialog, { props: { open: true, title: 'T', modal: false } });
    expect(panel().getAttribute('aria-modal')).not.toBe('true');
  });

  it('adds classes per part and sends attributes to the panel', () => {
    render(Dialog, {
      props: {
        open: true,
        title: 'T',
        trigger: 'Open',
        footer: 'F',
        classes: {
          root: 'my-root',
          header: 'my-header',
          footer: 'my-footer',
          trigger: 'my-trigger',
        },
      },
      attrs: { class: 'extra', 'data-testid': 'panel' },
    });
    expect(screen.getByTestId('panel')).toBe(panel());
    expect(panel().classList.contains('my-root')).toBe(true);
    expect(panel().classList.contains('extra')).toBe(true);
    expect(partOf('header')!.classList.contains('my-header')).toBe(true);
    expect(partOf('footer')!.classList.contains('my-footer')).toBe(true);
    expect(partOf('trigger')!.classList.contains('my-trigger')).toBe(true);
  });

  it('renders on the server, teleported or in place', async () => {
    const context: { teleports?: Record<string, string> } = {};
    const html = (props: Record<string, unknown>) =>
      renderToString(createSSRApp({ render: () => h(Dialog, { title: 'T', ...props }) }), context);
    await html({ open: true });
    expect(context.teleports?.body).toContain('class="apui-dialog"');
    const inPlace = await html({ open: true, portal: false, modal: false });
    expect(inPlace).toContain('class="apui-dialog"');
    expect(inPlace).toContain('data-state="open"');
  });
});
