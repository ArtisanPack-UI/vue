import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Navbar } from '../../components/navigation';

describe('Navbar', () => {
  it('renders with navbar class', () => {
    const { container } = render(Navbar);
    expect(container.querySelector('.navbar')).toBeTruthy();
  });

  it('has navigation role', () => {
    const { container } = render(Navbar);
    expect(container.querySelector('[role="navigation"]')).toBeTruthy();
  });

  it('has aria-label', () => {
    const { container } = render(Navbar);
    const nav = container.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('renders start slot', () => {
    render(Navbar, {
      slots: { start: '<span>Logo</span>' },
    });
    expect(screen.getByText('Logo')).toBeTruthy();
  });

  it('renders center slot', () => {
    render(Navbar, {
      slots: { center: '<span>Title</span>' },
    });
    expect(screen.getByText('Title')).toBeTruthy();
  });

  it('renders end slot', () => {
    render(Navbar, {
      slots: { end: '<span>Actions</span>' },
    });
    expect(screen.getByText('Actions')).toBeTruthy();
  });

  it('renders start slot in navbar-start', () => {
    const { container } = render(Navbar, {
      slots: { start: '<span>Logo</span>' },
    });
    expect(container.querySelector('.navbar-start')).toBeTruthy();
  });

  it('renders center slot in navbar-center', () => {
    const { container } = render(Navbar, {
      slots: { center: '<span>Title</span>' },
    });
    expect(container.querySelector('.navbar-center')).toBeTruthy();
  });

  it('renders end slot in navbar-end', () => {
    const { container } = render(Navbar, {
      slots: { end: '<span>Actions</span>' },
    });
    expect(container.querySelector('.navbar-end')).toBeTruthy();
  });

  it('applies color classes', () => {
    const { container } = render(Navbar, { props: { color: 'primary' } });
    expect(container.querySelector('.bg-primary')).toBeTruthy();
    expect(container.querySelector('.text-primary-content')).toBeTruthy();
  });

  it('applies glass class', () => {
    const { container } = render(Navbar, { props: { glass: true } });
    expect(container.querySelector('.glass')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(Navbar, { props: { className: 'custom-nav' } });
    expect(container.querySelector('.custom-nav')).toBeTruthy();
  });

  it('renders default slot content', () => {
    render(Navbar, {
      slots: { default: '<span>Custom Content</span>' },
    });
    expect(screen.getByText('Custom Content')).toBeTruthy();
  });

  it('does not render navbar-start when slot is empty', () => {
    const { container } = render(Navbar, {
      slots: { end: '<span>Only End</span>' },
    });
    expect(container.querySelector('.navbar-start')).toBeFalsy();
  });
});
