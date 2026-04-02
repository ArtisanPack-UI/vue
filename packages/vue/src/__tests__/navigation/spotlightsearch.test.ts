import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { nextTick } from 'vue';
import { SpotlightSearch } from '../../components/navigation';

// Mock HTMLDialogElement methods
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

const testItems = [
  { id: 'home', label: 'Go to Home', description: 'Navigate to the home page' },
  { id: 'settings', label: 'Open Settings', description: 'Manage your preferences' },
  { id: 'profile', label: 'View Profile', description: 'See your profile', group: 'Account' },
  { id: 'logout', label: 'Log Out', group: 'Account' },
  { id: 'disabled', label: 'Disabled Action', disabled: true },
];

// SpotlightSearch uses Teleport to body, so we must query document.body
function queryBody(selector: string) {
  return document.body.querySelector(selector);
}

function queryAllBody(selector: string) {
  return document.body.querySelectorAll(selector);
}

/** Wait for Vue reactivity + post-flush dialog updates. */
async function waitForDialog() {
  await nextTick();
  await nextTick();
}

describe('SpotlightSearch', () => {
  it('renders dialog element', () => {
    render(SpotlightSearch, { props: { items: testItems } });
    expect(queryBody('dialog')).toBeTruthy();
  });

  it('shows modal when open is true', async () => {
    render(SpotlightSearch, {
      props: { items: testItems, open: true },
      global: { stubs: { teleport: true } },
    });
    await waitForDialog();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('renders search input', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    const input = queryBody('input[type="text"]');
    expect(input).toBeTruthy();
  });

  it('uses custom placeholder', async () => {
    render(SpotlightSearch, {
      props: { items: testItems, open: true, placeholder: 'Type a command…' },
    });
    await waitForDialog();
    const input = queryBody('input[type="text"]') as HTMLInputElement;
    expect(input.placeholder).toBe('Type a command…');
  });

  it('displays all non-disabled items when no query', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    expect(screen.getByText('Go to Home')).toBeTruthy();
    expect(screen.getByText('Open Settings')).toBeTruthy();
    expect(screen.getByText('View Profile')).toBeTruthy();
    expect(screen.getByText('Log Out')).toBeTruthy();
  });

  it('filters items based on query', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    const input = queryBody('input[type="text"]') as HTMLInputElement;
    await fireEvent.update(input, 'settings');
    await nextTick();
    expect(screen.getByText('Open Settings')).toBeTruthy();
    expect(screen.queryByText('Go to Home')).toBeFalsy();
  });

  it('shows no results message when nothing matches', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    const input = queryBody('input[type="text"]') as HTMLInputElement;
    await fireEvent.update(input, 'xyznonexistent');
    await nextTick();
    expect(screen.getByText('No results found.')).toBeTruthy();
  });

  it('excludes disabled items from results', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    expect(screen.queryByText('Disabled Action')).toBeFalsy();
  });

  it('displays group headers', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    expect(screen.getByText('Account')).toBeTruthy();
  });

  it('renders item descriptions', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    expect(screen.getByText('Navigate to the home page')).toBeTruthy();
  });

  it('emits select when item is clicked', async () => {
    const { emitted } = render(SpotlightSearch, {
      props: { items: testItems, open: true },
    });
    await waitForDialog();
    const homeItem = screen.getByText('Go to Home');
    await fireEvent.click(homeItem.closest('[role="option"]')!);
    const selectEvents = emitted().select as Array<[(typeof testItems)[0]]>;
    expect(selectEvents).toBeTruthy();
    expect(selectEvents[0][0]).toEqual(testItems[0]);
  });

  it('has combobox role on input', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    expect(queryBody('[role="combobox"]')).toBeTruthy();
  });

  it('has listbox role on results', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    expect(queryBody('[role="listbox"]')).toBeTruthy();
  });

  it('has option role on items', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    const options = queryAllBody('[role="option"]');
    expect(options.length).toBe(4); // 4 non-disabled items
  });

  it('highlights first item by default', async () => {
    render(SpotlightSearch, { props: { items: testItems, open: true } });
    await waitForDialog();
    const options = queryAllBody('[role="option"]');
    expect(options[0].getAttribute('aria-selected')).toBe('true');
  });

  it('has aria-modal on dialog', () => {
    render(SpotlightSearch, { props: { items: testItems } });
    const dialog = queryBody('dialog');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
  });

  it('closes dialog on Escape keydown', async () => {
    const { emitted } = render(SpotlightSearch, {
      props: { items: testItems, open: true },
    });
    await waitForDialog();
    const dialog = queryBody('dialog') as HTMLDialogElement;
    await fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(emitted()['update:open']).toBeTruthy();
    expect(emitted()['update:open'][0]).toEqual([false]);
  });
});
