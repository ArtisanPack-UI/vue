import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { h } from 'vue';
import { Alert } from '../../components/feedback';
import type { AlertColor } from '../../components/feedback';

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="alert"][data-part="${name}"]`);

describe('Alert', () => {
  it('renders the contract anatomy in order', () => {
    const { container } = render(Alert, {
      props: {
        title: 'Listing published',
        description: 'Live in search.',
        actions: 'Undo',
        dismissible: true,
      },
    });
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-alert');
    expect(root.getAttribute('role')).toBe('status');
    expect(root.getAttribute('data-color')).toBe('neutral');
    expect(root.getAttribute('data-variant')).toBe('soft');
    expect(root.getAttribute('data-surface')).toBe('default');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'title',
      'description',
      'actions',
      'close-trigger',
    ]);
    expect(part(root, 'title')!.tagName).toBe('P');
    expect(part(root, 'description')!.tagName).toBe('DIV');
    expect(part(root, 'icon')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('makes an error an alert, and every other color a status', () => {
    render(Alert, { props: { color: 'error', title: 'Payment failed' } });
    expect(screen.getByRole('alert').getAttribute('data-color')).toBe('error');
  });

  it("shows the color's status icon, a named icon, or a slot", () => {
    const svg = (color: AlertColor, icon?: string) => {
      const { container, unmount } = render(Alert, { props: { color, icon, title: 'x' } });
      const html = part(container, 'icon')!.innerHTML;
      unmount();
      return html;
    };
    expect(svg('success')).not.toBe(svg('info'));
    expect(svg('primary')).toBe(svg('info'));
    expect(svg('info', 'trash')).not.toBe(svg('info'));
    const { container } = render(Alert, {
      props: { title: 'x' },
      slots: { icon: () => h('i', { 'data-testid': 'own' }) },
    });
    expect(part(container, 'icon')!.querySelector('[data-testid="own"]')).not.toBeNull();
  });

  it('fills the description from the default slot', () => {
    const { container } = render(Alert, { slots: { default: 'Update the card.' } });
    expect(part(container, 'description')!.textContent).toBe('Update the card.');
  });

  it('dismisses itself and emits open-change false', async () => {
    const { container, emitted } = render(Alert, {
      props: { title: 'Saved', dismissible: true, closeLabel: 'Fermer' },
    });
    const close = screen.getByRole('button', { name: 'Fermer' });
    expect(close.getAttribute('data-variant')).toBe('ghost');
    expect(close.getAttribute('data-size')).toBe('xs');
    await fireEvent.click(close);
    expect(container.firstElementChild!.hasAttribute('hidden')).toBe(true);
    expect(emitted()['open-change']).toEqual([[false]]);
  });

  it('names the close button Dismiss by default, and has none unless dismissible', () => {
    const { container } = render(Alert, { props: { title: 'x', dismissible: true } });
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeTruthy();
    const plain = render(Alert, { props: { title: 'y' } });
    expect(part(plain.container, 'close-trigger')).toBeNull();
    expect(part(container, 'close-trigger')).not.toBeNull();
  });

  it('emits variant and surface, and applies classes and attributes', () => {
    const { container } = render(Alert, {
      props: { variant: 'solid', surface: 'glass', title: 'x', classes: { root: 'r', title: 't' } },
      attrs: { class: 'extra', 'data-testid': 'a' },
    });
    const root = container.firstElementChild!;
    expect(root.getAttribute('data-variant')).toBe('solid');
    expect(root.getAttribute('data-surface')).toBe('glass');
    expect(root.className).toBe('apui-alert extra r');
    expect(root.getAttribute('data-testid')).toBe('a');
    expect(part(root, 'title')!.className).toBe('t');
  });
});
