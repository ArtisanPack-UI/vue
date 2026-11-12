import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { EmptyState } from '../../components/feedback';
import type { EmptyStateProps } from '../../components/feedback';

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="empty-state"][data-part="${name}"]`);

describe('EmptyState', () => {
  it('renders the contract anatomy with an h3 title', () => {
    const { container } = render(EmptyState, {
      props: { title: 'No properties yet', description: 'Add one.', actions: 'Add property' },
    });
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-empty-state');
    expect(root.getAttribute('data-variant')).toBe('first-use');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-align')).toBe('center');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'title',
      'description',
      'actions',
    ]);
    expect(screen.getByRole('heading', { level: 3, name: 'No properties yet' })).toBeTruthy();
    expect(part(root, 'icon')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('picks a default icon per variant, and a heading level', () => {
    const icon = (variant: NonNullable<EmptyStateProps['variant']>) => {
      const { container, unmount } = render(EmptyState, { props: { variant, title: 'x' } });
      const html = part(container, 'icon')!.innerHTML;
      unmount();
      return html;
    };
    expect(icon('first-use')).not.toBe(icon('no-results'));
    expect(icon('no-results')).not.toBe(icon('cleared'));
    render(EmptyState, { props: { title: 'Caught up', headingLevel: 5 } });
    expect(screen.getByRole('heading', { level: 5 })).toBeTruthy();
    render(EmptyState, { props: { title: 'Clamped', headingLevel: 1 } });
    expect(screen.getByRole('heading', { name: 'Clamped' }).tagName).toBe('H2');
  });

  it('fills the description from the default slot and emits size and align', () => {
    const { container } = render(EmptyState, {
      props: { size: 'sm', align: 'start' },
      slots: { default: 'Nothing here.' },
    });
    const root = container.firstElementChild!;
    expect(root.getAttribute('data-size')).toBe('sm');
    expect(root.getAttribute('data-align')).toBe('start');
    expect(part(root, 'description')!.textContent).toBe('Nothing here.');
    expect(part(root, 'title')).toBeNull();
  });
});
