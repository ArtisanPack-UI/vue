import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createToaster, Toast, Toaster, toast } from '../../components/feedback';
import { defaultToaster, routeCount } from '../../components/feedback/Toast/toaster';

const partOf = (name: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="toast"][data-part="${name}"]`);

const toasts = () => [...document.body.querySelectorAll<HTMLElement>('.apui-toast')];

/** Dismissal waits out Zag's exit delay; allow for a busy test run. */
const REMOVAL = { timeout: 5000 };

/** Lets the machines' effects run. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('Toast', () => {
  it('renders a static status toast with the default data attributes', () => {
    const { container } = render(Toast, {
      props: { title: 'Listing saved', description: 'Cedarwood Estates is live now.' },
    });
    const root = container.querySelector<HTMLElement>('.apui-toast')!;
    expect(root.getAttribute('role')).toBe('status');
    expect(root.getAttribute('data-scope')).toBe('toast');
    expect(root.getAttribute('data-part')).toBe('root');
    expect(root.getAttribute('data-color')).toBe('neutral');
    expect(root.getAttribute('data-variant')).toBe('default');
    expect(root.getAttribute('data-surface')).toBe('overlay');
    expect(root.getAttribute('aria-labelledby')).toBe(partOf('title', root)!.id);
    expect(root.getAttribute('aria-describedby')).toBe(partOf('description', root)!.id);
    expect(partOf('title', root)!.tagName).toBe('P');
    expect(partOf('icon', root)!.getAttribute('aria-hidden')).toBe('true');
    expect(partOf('icon', root)!.querySelector('svg')).not.toBeNull();
    expect(partOf('actions', root)).toBeNull();
  });

  it('makes an error toast an alert', () => {
    const { container } = render(Toast, { props: { title: 'Upload failed', color: 'error' } });
    const root = container.querySelector('.apui-toast')!;
    expect(root.getAttribute('role')).toBe('alert');
    expect(root.getAttribute('data-color')).toBe('error');
  });

  it('emits variant and surface', () => {
    const { container } = render(Toast, {
      props: { title: 'T', variant: 'inverse', surface: 'glass' },
    });
    const root = container.querySelector('.apui-toast')!;
    expect(root.getAttribute('data-variant')).toBe('inverse');
    expect(root.getAttribute('data-surface')).toBe('glass');
  });

  it('shows the color status icon unless an icon is given', () => {
    const status = render(Toast, { props: { title: 'T', color: 'success' } });
    const statusIcon = partOf('icon', status.container)!.innerHTML;
    status.unmount();
    const custom = render(Toast, { props: { title: 'T', color: 'success', icon: 'trash' } });
    expect(partOf('icon', custom.container)!.innerHTML).not.toBe(statusIcon);
  });

  it('renders actions from the slot or the prop', () => {
    const fromSlot = render(Toast, {
      props: { title: 'Listing archived' },
      slots: { actions: '<button>Undo</button>' },
    });
    expect(partOf('actions', fromSlot.container)!.querySelector('button')!.textContent).toBe(
      'Undo',
    );
    fromSlot.unmount();
    const fromProp = render(Toast, { props: { title: 'T', actions: 'Undo' } });
    expect(partOf('actions', fromProp.container)!.textContent).toBe('Undo');
  });

  it('emits open-change false from the close button', async () => {
    const { emitted } = render(Toast, { props: { title: 'T' } });
    const close = screen.getByRole('button', { name: 'Dismiss notification' });
    expect(close.getAttribute('data-part')).toBe('close-trigger');
    expect(close.getAttribute('data-variant')).toBe('ghost');
    await fireEvent.click(close);
    expect(emitted('open-change')).toEqual([[false]]);
  });

  it('names the close button with closeLabel', () => {
    render(Toast, { props: { title: 'T', closeLabel: 'Benachrichtigung schließen' } });
    expect(partOf('close-trigger')!.getAttribute('aria-label')).toBe('Benachrichtigung schließen');
  });

  it('hides the close button with hideClose', () => {
    render(Toast, { props: { title: 'T', hideClose: true } });
    expect(partOf('close-trigger')).toBeNull();
  });

  it('adds classes per part and sends attributes to the root', () => {
    const { container } = render(Toast, {
      props: { title: 'T', classes: { root: 'my-root', title: 'my-title' } },
      attrs: { class: 'extra', 'data-testid': 'toast' },
    });
    const root = screen.getByTestId('toast');
    expect(root).toBe(container.querySelector('.apui-toast'));
    expect(root.classList.contains('my-root')).toBe(true);
    expect(root.classList.contains('extra')).toBe(true);
    expect(partOf('title', root)!.classList.contains('my-title')).toBe(true);
  });
});

describe('Toaster', () => {
  afterEach(() => {
    toast.remove();
    defaultToaster.remove();
  });

  it('registers nothing when rendered on the server', async () => {
    await renderToString(createSSRApp({ render: () => h(Toaster, { placement: 'top-end' }) }));
    await renderToString(createSSRApp({ render: () => h(Toaster) }));
    expect(routeCount()).toBe(0);
  });

  it('routes toast while mounted and stops when unmounted', () => {
    const { unmount } = render(Toaster);
    expect(routeCount()).toBe(1);
    unmount();
    expect(routeCount()).toBe(0);
  });

  it('takes over toasts created before a region with options mounts', async () => {
    toast.create({ title: 'Early', duration: 0 });
    render(Toaster, { props: { placement: 'top-end' } });
    await settle();
    expect(partOf('group')!.getAttribute('data-placement')).toBe('top-end');
    expect(toasts().map((el) => partOf('title', el)!.textContent?.trim())).toEqual(['Early']);
    expect(defaultToaster.store.getVisibleToasts()).toHaveLength(0);
  });

  it('shows each toast once with two regions, and falls back when the newest unmounts', async () => {
    const second = ref(true);
    render(
      defineComponent({
        setup: () => () => [h(Toaster), second.value ? h(Toaster) : null],
      }),
    );
    await settle();
    toast.create({ title: 'Once', duration: 0 });
    await settle();
    expect(document.body.querySelectorAll('[data-scope="toast"][data-part="group"]')).toHaveLength(
      1,
    );
    expect(toasts()).toHaveLength(1);
    second.value = false;
    await settle();
    expect(routeCount()).toBe(1);
    expect(document.body.querySelectorAll('[data-scope="toast"][data-part="group"]')).toHaveLength(
      1,
    );
    expect(toasts()).toHaveLength(1);
  });

  it('renders a labelled region at the end of the body', () => {
    const { container } = render(Toaster);
    expect(container.querySelector('[data-part="group"]')).toBeNull();
    const region = partOf('group')!;
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-label')).toContain('Notifications');
    expect(region.getAttribute('aria-live')).toBe('polite');
  });

  it('shows toasts created with toast.create()', async () => {
    render(Toaster);
    toast.create({ title: 'Listing saved', description: 'Live now.', color: 'success' });
    await settle();
    const [shown] = toasts();
    expect(shown).toBeDefined();
    expect(partOf('title', shown)!.textContent?.trim()).toBe('Listing saved');
    expect(partOf('description', shown)!.textContent?.trim()).toBe('Live now.');
    expect(shown!.getAttribute('data-color')).toBe('success');
    expect(shown!.getAttribute('data-state')).toBe('open');
    expect(shown!.getAttribute('role')).toBe('status');
  });

  it('makes an error toast an alert', async () => {
    render(Toaster);
    toast.create({ title: 'Upload failed', color: 'error' });
    await settle();
    expect(toasts()[0]!.getAttribute('role')).toBe('alert');
  });

  it('dismisses a toast from its close button', async () => {
    render(Toaster);
    toast.create({ title: 'Listing saved', duration: 0 });
    await settle();
    await fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await vi.waitFor(() => expect(toasts()).toHaveLength(0), REMOVAL);
  });

  it('runs and dismisses an action', async () => {
    const onClick = vi.fn();
    render(Toaster);
    toast.create({ title: 'Listing archived', action: { label: 'Undo', onClick } });
    await settle();
    expect(partOf('actions')).not.toBeNull();
    const undo = screen.getByRole('button', { name: 'Undo' });
    expect(undo.getAttribute('data-part')).toBe('action-trigger');
    await fireEvent.click(undo);
    expect(onClick).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(toasts()).toHaveLength(0), REMOVAL);
  });

  it('dismisses a toast after its duration', async () => {
    render(Toaster);
    toast.create({ title: 'Brief', duration: 50 });
    await settle();
    expect(toasts()).toHaveLength(1);
    await vi.waitFor(() => expect(toasts()).toHaveLength(0), REMOVAL);
  });

  it('passes closeLabel to its toasts', async () => {
    render(Toaster, { props: { closeLabel: 'Fermer la notification' } });
    toast.create({ title: 'Saved', duration: 0 });
    await settle();
    expect(screen.getByRole('button', { name: 'Fermer la notification' })).toBeTruthy();
  });

  it('dismisses by id', async () => {
    render(Toaster);
    const id = toast.create({ title: 'Saving…', duration: 0 });
    await settle();
    toast.dismiss(id);
    await vi.waitFor(() => expect(toasts()).toHaveLength(0), REMOVAL);
  });

  it('renders a custom toaster', async () => {
    const custom = createToaster({ placement: 'top-start' });
    render(Toaster, { props: { toaster: custom, label: 'Alerts' } });
    expect(partOf('group')!.getAttribute('aria-label')).toContain('Alerts');
    custom.create({ title: 'From the custom toaster', duration: 0 });
    await settle();
    expect(partOf('title')!.textContent?.trim()).toBe('From the custom toaster');
    custom.remove();
  });

  it('sends toast.create() to a region with its own options', async () => {
    const { unmount } = render(Toaster, { props: { placement: 'top-end', duration: 0 } });
    toast.create({ title: 'Placed' });
    await settle();
    expect(partOf('group')!.getAttribute('data-placement')).toBe('top-end');
    expect(toasts()).toHaveLength(1);
    toast.remove();
    unmount();
  });
});
