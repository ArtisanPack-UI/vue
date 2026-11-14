import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { Link } from '../../components/navigation';

describe('Link', () => {
  it('renders an anchor with the tone', () => {
    render(Link, { props: { href: '/terms' }, slots: { default: 'Listing terms' } });
    const link = screen.getByRole('link', { name: 'Listing terms' });
    expect(link.className).toBe('apui-link');
    expect(link.getAttribute('href')).toBe('/terms');
    expect(link.getAttribute('data-tone')).toBe('primary');
    expect(link.hasAttribute('data-standalone')).toBe(false);
    expect(link.hasAttribute('target')).toBe(false);
  });

  it('renders a button without an href, or with an unsafe one', async () => {
    const clicks: string[] = [];
    render(Link, {
      attrs: { onClick: () => clicks.push('click') },
      slots: { default: 'Log out' },
    });
    const button = screen.getByRole('button', { name: 'Log out' });
    expect(button.getAttribute('type')).toBe('button');
    await fireEvent.click(button);
    expect(clicks).toEqual(['click']);

    render(Link, { props: { href: 'javascript:alert(1)' }, slots: { default: 'Bad' } });
    expect(screen.getByRole('button', { name: 'Bad' }).hasAttribute('href')).toBe(false);
  });

  it('emits tone and standalone', () => {
    render(Link, {
      props: { href: '/', tone: 'muted', standalone: true },
      slots: { default: 'A' },
    });
    const link = screen.getByRole('link');
    expect(link.getAttribute('data-tone')).toBe('muted');
    expect(link.getAttribute('data-standalone')).toBe('');
  });

  it('opens external links in a new tab and announces it', () => {
    const { container } = render(Link, {
      props: { href: 'https://example.com', external: true, externalLabel: '(neuer Tab)' },
      slots: { default: 'Docs' },
    });
    const link = screen.getByRole('link', { name: /Docs ?\(neuer Tab\)/ });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(container.querySelector('[data-part="iconEnd"] svg')).not.toBeNull();
  });

  it('renders icon parts and mirrors arrows', () => {
    const { container } = render(Link, {
      props: { href: '/', standalone: true, leadingIcon: 'download', trailingIcon: 'arrow-right' },
      slots: { default: 'View all' },
    });
    const icon = container.querySelector('[data-scope="link"][data-part="icon"]')!;
    const iconEnd = container.querySelector('[data-scope="link"][data-part="iconEnd"]')!;
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('data-mirror')).toBe(false);
    expect(iconEnd.getAttribute('data-mirror')).toBe('');
  });

  it('lets slots override the icons, and takes part classes', () => {
    const { container } = render(Link, {
      props: { href: '/', external: true, classes: { root: 'r', iconEnd: 'e' } },
      slots: { default: 'Home', iconEnd: '<i>X</i>' },
    });
    const iconEnd = container.querySelector('[data-part="iconEnd"]')!;
    expect(iconEnd.innerHTML).toBe('<i>X</i>');
    expect(iconEnd.className).toBe('e');
    expect(container.querySelector('a')!.className).toBe('apui-link r');
  });
});
