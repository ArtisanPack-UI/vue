import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Heading } from '../../components/layout';

describe('Heading', () => {
  it('renders an h2 by default, with size following level', () => {
    render(Heading, { slots: { default: 'Listings' } });
    const heading = screen.getByRole('heading', { level: 2, name: 'Listings' });
    expect(heading.classList.contains('apui-heading')).toBe(true);
    expect(heading.getAttribute('data-level')).toBe('2');
    expect(heading.getAttribute('data-size')).toBe('2');
  });

  it('sets level and size apart, as numbers or strings', () => {
    render(Heading, { props: { level: 3, size: '5' }, slots: { default: 'Recent' } });
    expect(screen.getByRole('heading', { level: 3 }).getAttribute('data-size')).toBe('5');
  });

  it('renders the eyebrow as a paragraph just before the heading, and attributes on the heading', () => {
    const { container } = render(Heading, {
      props: { eyebrow: 'Portfolio', classes: { eyebrow: 'x' } },
      attrs: { id: 't', class: 'y' },
      slots: { default: 'Every property' },
    });
    const eyebrow = container.querySelector('p[data-scope="heading"][data-part="eyebrow"]')!;
    expect(eyebrow.textContent?.trim()).toBe('Portfolio');
    expect(eyebrow.classList.contains('x')).toBe(true);
    expect(eyebrow.nextElementSibling?.tagName).toBe('H2');
    expect(container.querySelector('h2#t.y.apui-heading')).not.toBeNull();
  });
});
