import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Breadcrumbs } from '../../components/navigation';

const testItems = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Current Page' },
];

describe('Breadcrumbs', () => {
  it('renders all breadcrumb items', () => {
    render(Breadcrumbs, { props: { items: testItems } });
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Products')).toBeTruthy();
    expect(screen.getByText('Current Page')).toBeTruthy();
  });

  it('renders non-last items with href as links', () => {
    render(Breadcrumbs, { props: { items: testItems } });
    const home = screen.getByText('Home');
    expect(home.closest('a')).toBeTruthy();
    expect(home.closest('a')?.getAttribute('href')).toBe('/');
  });

  it('renders last item as a span (not a link)', () => {
    render(Breadcrumbs, { props: { items: testItems } });
    const current = screen.getByText('Current Page');
    expect(current.closest('a')).toBeFalsy();
    expect(current.closest('span')).toBeTruthy();
  });

  it('sets aria-current on the last item', () => {
    const { container } = render(Breadcrumbs, { props: { items: testItems } });
    const listItems = container.querySelectorAll('li');
    const lastItem = listItems[listItems.length - 1];
    const span = lastItem.querySelector('span');
    expect(span?.getAttribute('aria-current')).toBe('page');
  });

  it('does not set aria-current on non-last items', () => {
    const { container } = render(Breadcrumbs, { props: { items: testItems } });
    const listItems = container.querySelectorAll('li');
    expect(listItems[0].getAttribute('aria-current')).toBeNull();
    expect(listItems[1].getAttribute('aria-current')).toBeNull();
  });

  it('applies breadcrumbs class', () => {
    const { container } = render(Breadcrumbs, { props: { items: testItems } });
    expect(container.querySelector('.breadcrumbs')).toBeTruthy();
  });

  it('renders items in a ul list', () => {
    const { container } = render(Breadcrumbs, { props: { items: testItems } });
    const ul = container.querySelector('ul');
    expect(ul).toBeTruthy();
    expect(ul?.querySelectorAll('li').length).toBe(3);
  });

  it('applies custom className', () => {
    const { container } = render(Breadcrumbs, {
      props: { items: testItems, className: 'custom' },
    });
    expect(container.querySelector('.custom')).toBeTruthy();
  });

  it('handles single item', () => {
    render(Breadcrumbs, { props: { items: [{ label: 'Home' }] } });
    const home = screen.getByText('Home');
    expect(home.closest('a')).toBeFalsy();
  });

  it('renders last item with href as span not link', () => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Last', href: '/last' },
    ];
    render(Breadcrumbs, { props: { items } });
    const last = screen.getByText('Last');
    expect(last.closest('a')).toBeFalsy();
    expect(last.closest('span')).toBeTruthy();
  });
});
