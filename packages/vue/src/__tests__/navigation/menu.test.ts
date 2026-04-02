import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Menu } from '../../components/navigation';

const testItems = [
  { name: 'home', label: 'Home', href: '/' },
  { name: 'about', label: 'About', href: '/about' },
  { name: 'contact', label: 'Contact', disabled: true },
];

const nestedItems = [
  { name: 'home', label: 'Home', href: '/' },
  {
    name: 'products',
    label: 'Products',
    children: [
      { name: 'shirts', label: 'Shirts', href: '/products/shirts' },
      { name: 'pants', label: 'Pants', href: '/products/pants' },
    ],
  },
];

describe('Menu', () => {
  it('renders all menu items', () => {
    render(Menu, { props: { items: testItems } });
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('About')).toBeTruthy();
    expect(screen.getByText('Contact')).toBeTruthy();
  });

  it('renders items with href as links', () => {
    render(Menu, { props: { items: testItems } });
    const homeLink = screen.getByText('Home');
    expect(homeLink.tagName).toBe('A');
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('renders items without href as buttons', () => {
    render(Menu, { props: { items: testItems } });
    const contact = screen.getByText('Contact');
    expect(contact.tagName).toBe('BUTTON');
  });

  it('renders as a ul with menu class', () => {
    const { container } = render(Menu, { props: { items: testItems } });
    const ul = container.querySelector('ul.menu');
    expect(ul).toBeTruthy();
  });

  it('applies horizontal class', () => {
    const { container } = render(Menu, { props: { items: testItems, horizontal: true } });
    expect(container.querySelector('.menu-horizontal')).toBeTruthy();
  });

  it('applies size class', () => {
    const { container } = render(Menu, { props: { items: testItems, size: 'lg' } });
    expect(container.querySelector('.menu-lg')).toBeTruthy();
  });

  it('disables items with disabled prop', () => {
    render(Menu, { props: { items: testItems } });
    const contact = screen.getByText('Contact');
    expect(contact.getAttribute('disabled')).not.toBeNull();
  });

  it('marks active item with aria-current', () => {
    const items = [{ name: 'home', label: 'Home', href: '/', active: true }];
    render(Menu, { props: { items } });
    const home = screen.getByText('Home');
    expect(home.getAttribute('aria-current')).toBe('page');
  });

  it('emits select event on item click', async () => {
    const { emitted } = render(Menu, { props: { items: testItems } });
    const home = screen.getByText('Home');
    await fireEvent.click(home);
    expect(emitted().select).toBeTruthy();
    expect(emitted().select[0]).toEqual(['home']);
  });

  it('does not emit select for disabled items', async () => {
    const { emitted } = render(Menu, { props: { items: testItems } });
    const contact = screen.getByText('Contact');
    await fireEvent.click(contact);
    expect(emitted().select).toBeFalsy();
  });

  it('renders nested items with submenu', () => {
    render(Menu, { props: { items: nestedItems } });
    expect(screen.getByText('Products')).toBeTruthy();
    expect(screen.getByText('Shirts')).toBeTruthy();
    expect(screen.getByText('Pants')).toBeTruthy();
  });

  it('renders submenu as nested ul', () => {
    const { container } = render(Menu, { props: { items: nestedItems } });
    const nestedUls = container.querySelectorAll('details ul');
    expect(nestedUls.length).toBe(1);
  });

  it('applies custom className', () => {
    const { container } = render(Menu, { props: { items: testItems, className: 'custom-class' } });
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });
});
