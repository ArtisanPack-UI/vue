import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { nextTick } from 'vue';
import { Modal } from '../../components/layout';

// Mock dialog methods not available in jsdom
HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
});
HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute('open');
});

const teleportStubs = {
  global: {
    stubs: {
      teleport: true,
    },
  },
};

describe('Modal', () => {
  it('renders title', async () => {
    render(Modal, {
      props: { open: true, title: 'Test Modal' },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    expect(screen.getByText('Test Modal')).toBeTruthy();
    expect(screen.getByText('Test Modal').tagName).toBe('H3');
  });

  it('renders subtitle', async () => {
    render(Modal, {
      props: { open: true, title: 'Title', subtitle: 'Sub text' },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    expect(screen.getByText('Sub text')).toBeTruthy();
  });

  it('renders slot content', async () => {
    render(Modal, {
      props: { open: true },
      slots: { default: 'Modal body content' },
      ...teleportStubs,
    });
    await nextTick();
    expect(screen.getByText('Modal body content')).toBeTruthy();
  });

  it('renders actions slot', async () => {
    render(Modal, {
      props: { open: true },
      slots: { default: 'Body', actions: '<button>Confirm</button>' },
      ...teleportStubs,
    });
    await nextTick();
    expect(screen.getByText('Confirm')).toBeTruthy();
  });

  it('has aria-modal attribute', async () => {
    const { container } = render(Modal, {
      props: { open: true },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    const dialog = container.querySelector('dialog');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
  });

  it('has aria-labelledby when title is present', async () => {
    const { container } = render(Modal, {
      props: { open: true, title: 'Labeled' },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    const dialog = container.querySelector('dialog');
    const titleId = dialog?.getAttribute('aria-labelledby');
    expect(titleId).toBeTruthy();
    expect(container.querySelector(`#${titleId}`)).toBeTruthy();
  });

  it('shows close button when not persistent', async () => {
    render(Modal, {
      props: { open: true },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    expect(screen.getByLabelText('Close')).toBeTruthy();
  });

  it('hides close button when persistent', async () => {
    render(Modal, {
      props: { open: true, persistent: true },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    expect(screen.queryByLabelText('Close')).toBeFalsy();
  });

  it('applies glass class', async () => {
    const { container } = render(Modal, {
      props: { open: true, glass: true },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    expect(container.querySelector('.glass')).toBeTruthy();
  });

  it('applies bottom modal class', async () => {
    const { container } = render(Modal, {
      props: { open: true, bottom: true },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    expect(container.querySelector('.modal-bottom')).toBeTruthy();
  });

  it('emits update:open false when close button clicked', async () => {
    const { emitted } = render(Modal, {
      props: { open: true },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    await fireEvent.click(screen.getByLabelText('Close'));
    expect(emitted()['update:open']).toBeTruthy();
    expect(emitted()['update:open'][0]).toEqual([false]);
  });

  it('renders dialog element when open', async () => {
    const { container } = render(Modal, {
      props: { open: true },
      slots: { default: 'Body' },
      ...teleportStubs,
    });
    await nextTick();
    expect(container.querySelector('dialog')).toBeTruthy();
    expect(container.querySelector('.modal')).toBeTruthy();
  });
});
