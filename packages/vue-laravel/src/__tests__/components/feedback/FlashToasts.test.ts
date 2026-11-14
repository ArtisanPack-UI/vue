import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/vue';
import { nextTick, reactive } from 'vue';
import { createToaster, toast } from '@artisanpack-ui/vue';

const mockPageProps = reactive({
  auth: { user: null },
  flash: {} as Record<string, string | undefined>,
  errors: {},
});

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({ props: mockPageProps }),
}));

import FlashToasts from '../../../components/feedback/FlashToasts.vue';

const toasts = () => [...document.body.querySelectorAll<HTMLElement>('.apui-toast')];
const titleOf = (el: HTMLElement) =>
  el.querySelector('[data-scope="toast"][data-part="title"]')?.textContent?.trim();

/** Lets the toaster machines settle. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('FlashToasts', () => {
  afterEach(() => {
    toast.remove();
    mockPageProps.flash = {};
  });

  it('shows flash messages as design-system toasts in its Toaster, with no DaisyUI markup', async () => {
    mockPageProps.flash = { success: 'Saved', error: 'Upload failed' };
    render(FlashToasts, { slots: { default: '<main>Page</main>' } });
    await settle();

    const region = document.body.querySelector('[data-scope="toast"][data-part="group"]')!;
    expect(region.getAttribute('role')).toBe('region');
    const byTitle = Object.fromEntries(toasts().map((el) => [titleOf(el), el]));
    expect(byTitle['Saved']!.getAttribute('data-color')).toBe('success');
    expect(byTitle['Upload failed']!.getAttribute('data-color')).toBe('error');
    expect(byTitle['Upload failed']!.getAttribute('role')).toBe('alert');
    expect(document.body.querySelector('.toast, .alert, .btn')).toBeNull();
    expect(document.body.textContent).toContain('Page');
  });

  it('takes a colorMap and passes Toaster props through', async () => {
    mockPageProps.flash = { status: 'Profile updated' };
    render(FlashToasts, {
      props: { colorMap: { status: 'success' } },
      attrs: { placement: 'top-end', label: 'Alerts' },
    });
    await settle();
    const region = document.body.querySelector('[data-scope="toast"][data-part="group"]')!;
    expect(region.getAttribute('data-placement')).toBe('top-end');
    expect(region.getAttribute('aria-label')).toContain('Alerts');
    expect(toasts().map((el) => el.getAttribute('data-color'))).toEqual(['success']);
  });

  it('renders no Toaster with region off, leaving the page toast to show them', async () => {
    const create = vi.spyOn(toast, 'create');
    mockPageProps.flash = { info: 'Heads up' };
    render(FlashToasts, { props: { region: false } });
    await settle();
    expect(document.body.querySelector('[data-scope="toast"][data-part="group"]')).toBeNull();
    expect(create).toHaveBeenCalledWith({ title: 'Heads up', color: 'info', duration: 5000 });
    create.mockRestore();
  });

  it('shows the toasts in a given toaster', async () => {
    const own = createToaster();
    mockPageProps.flash = { warning: 'Low disk space' };
    render(FlashToasts, { props: { toaster: own } });
    await settle();
    expect(toasts().map(titleOf)).toEqual(['Low disk space']);
    expect(own.store.getVisibleToasts()).toHaveLength(1);
    own.remove();
  });
});
