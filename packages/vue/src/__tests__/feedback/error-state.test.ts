import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { ErrorState } from '../../components/feedback';
import type { ErrorStateProps } from '../../components/feedback';

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="error-state"][data-part="${name}"]`);

describe('ErrorState', () => {
  it('is an alert with the contract anatomy', () => {
    const { container } = render(ErrorState, {
      props: {
        title: 'Couldn’t load transactions',
        description: 'Your data is safe.',
        code: 'Error 503 · req_8f2c91',
        actions: 'Try again',
      },
    });
    const root = screen.getByRole('alert');
    expect(root.className).toBe('apui-error-state');
    expect(root.getAttribute('data-variant')).toBe('request');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'title',
      'description',
      'code',
      'actions',
    ]);
    expect(part(container, 'code')!.textContent).toBe('Error 503 · req_8f2c91');
    expect(part(container, 'title')!.tagName).toBe('H3');
    expect(part(container, 'title')!.hasAttribute('tabindex')).toBe(false);
  });

  it('shows 404 instead of an icon for not-found', () => {
    const { container } = render(ErrorState, { props: { variant: 'not-found', title: 'Gone' } });
    expect(part(container, 'icon')).toBeNull();
    expect(part(container, 'numeral')!.textContent).toBe('404');
  });

  it('replaces the default icon with a numeral, but keeps an explicit icon', () => {
    const numeral = render(ErrorState, { props: { numeral: '503', title: 'x' } });
    expect(part(numeral.container, 'icon')).toBeNull();
    expect(part(numeral.container, 'numeral')!.textContent).toBe('503');
    const both = render(ErrorState, { props: { numeral: '503', icon: 'lock', title: 'y' } });
    expect(part(both.container, 'icon')!.querySelector('svg')).not.toBeNull();
  });

  it('uses a different default icon per variant', () => {
    const icon = (variant: NonNullable<ErrorStateProps['variant']>) => {
      const { container, unmount } = render(ErrorState, { props: { variant, title: 'x' } });
      const html = part(container, 'icon')!.innerHTML;
      unmount();
      return html;
    };
    expect(icon('request')).not.toBe(icon('offline'));
    expect(icon('offline')).not.toBe(icon('forbidden'));
  });

  it('focuses the title with focusTitle, at the heading level given', async () => {
    const wrapper = mount(ErrorState, {
      props: { title: 'Page not found', headingLevel: 1, focusTitle: true },
      attachTo: document.body,
    });
    await nextTick();
    const title = part(wrapper.element, 'title') as HTMLElement;
    expect(title.tagName).toBe('H1');
    expect(title.getAttribute('tabindex')).toBe('-1');
    expect(title.getAttribute('data-focus-title')).toBe('');
    expect(document.activeElement).toBe(title);
    wrapper.unmount();
  });

  it('focuses the title when focusTitle turns on after mount', async () => {
    const { rerender } = render(ErrorState, { props: { title: 'Couldn’t load' } });
    const title = screen.getByRole('heading');
    expect(title.hasAttribute('id')).toBe(false);
    expect(document.activeElement).not.toBe(title);
    await rerender({ title: 'Couldn’t load', focusTitle: true });
    await nextTick();
    expect(document.activeElement).toBe(title);
  });
});
