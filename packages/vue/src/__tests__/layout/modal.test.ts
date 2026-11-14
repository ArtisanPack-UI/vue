import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { Modal } from '../../components/layout';

const panel = () => document.body.querySelector<HTMLElement>('.apui-dialog')!;
const partOf = (name: string) =>
  document.body.querySelector<HTMLElement>(`[data-scope="dialog"][data-part="${name}"]`);

/** Lets the machine's effects run (focus, dismissal listeners). */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

/** A parent that binds `v-model:open`. */
function bound(props: Record<string, unknown> = {}) {
  const open = ref(true);
  const Host = defineComponent({
    setup: () => () =>
      h(
        Modal,
        {
          title: 'Delete listing',
          ...props,
          open: open.value,
          'onUpdate:open': (value: boolean) => (open.value = value),
        },
        { default: () => h('button', 'Inside') },
      ),
  });
  return { open, ...render(Host) };
}

describe('Modal (deprecated alias of Dialog)', () => {
  it('warns once in development that it is deprecated', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(Modal, { props: { open: true, title: 'One' } });
    render(Modal, { props: { open: true, title: 'Two' } });
    const calls = warn.mock.calls.filter(([message]) => String(message).includes('Modal'));
    expect(calls).toHaveLength(1);
    expect(calls[0]![0]).toContain('Modal is deprecated; use Dialog.');
    warn.mockRestore();
  });

  it('renders the design-system Dialog, with no DaisyUI markup', async () => {
    render(Modal, { props: { open: true, title: 'Confirm' }, slots: { default: 'Body' } });
    await settle();
    expect(panel().getAttribute('data-scope')).toBe('dialog');
    expect(panel().getAttribute('role')).toBe('dialog');
    expect(document.body.querySelector('.modal, .modal-box, .btn, dialog')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Confirm' }).tagName).toBe('H2');
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('maps subtitle to the description and the actions slot to the footer', async () => {
    render(Modal, {
      props: { open: true, title: 'Title', subtitle: 'Sub text' },
      slots: { default: 'Body', actions: '<button>Confirm</button>' },
    });
    await settle();
    expect(partOf('description')!.textContent).toBe('Sub text');
    expect(partOf('footer')!.textContent).toBe('Confirm');
  });

  it('maps glass to the glass surface', async () => {
    render(Modal, { props: { open: true, title: 'Glass', glass: true } });
    await settle();
    expect(panel().getAttribute('data-surface')).toBe('glass');
  });

  it('names the panel with ariaLabel when there is no title', async () => {
    render(Modal, { props: { open: true, ariaLabel: 'Settings' } });
    await settle();
    expect(panel().getAttribute('aria-label')).toBe('Settings');
  });

  it('consumes bottom instead of leaking it onto the panel', async () => {
    render(Modal, { props: { open: true, title: 'Bottom', bottom: true } });
    await settle();
    expect(panel().hasAttribute('bottom')).toBe(false);
  });

  it('passes Dialog props and attributes through', async () => {
    render(Modal, {
      props: { open: true, title: 'Wide' },
      attrs: { size: 'lg', 'data-testid': 'modal' },
    });
    await settle();
    expect(panel().getAttribute('data-size')).toBe('lg');
    expect(panel().getAttribute('data-testid')).toBe('modal');
  });

  it('emits update:open false from the close button', async () => {
    const { open } = bound();
    await settle();
    await fireEvent.click(partOf('close-trigger')!);
    await settle();
    expect(open.value).toBe(false);
  });

  it('persistent renders an alertdialog without a close button that ignores Escape', async () => {
    const { open } = bound({ persistent: true });
    await settle();
    expect(panel().getAttribute('role')).toBe('alertdialog');
    expect(partOf('close-trigger')).toBeNull();
    await fireEvent.keyDown(panel(), { key: 'Escape' });
    await settle();
    expect(open.value).toBe(true);
    expect(panel().hidden).toBe(false);
  });
});
