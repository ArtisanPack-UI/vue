import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Sidebar } from '../../components/navigation';

describe('Sidebar', () => {
  it('renders with drawer class', () => {
    const { container } = render(Sidebar);
    expect(container.querySelector('.drawer')).toBeTruthy();
  });

  it('renders default slot as main content', () => {
    render(Sidebar, {
      slots: { default: '<p>Main Content</p>' },
    });
    expect(screen.getByText('Main Content')).toBeTruthy();
  });

  it('renders sidebar slot', () => {
    render(Sidebar, {
      slots: { sidebar: '<p>Sidebar Content</p>' },
    });
    expect(screen.getByText('Sidebar Content')).toBeTruthy();
  });

  it('places main content in drawer-content', () => {
    const { container } = render(Sidebar, {
      slots: { default: '<p>Main</p>' },
    });
    const drawerContent = container.querySelector('.drawer-content');
    expect(drawerContent?.textContent).toContain('Main');
  });

  it('applies drawer-end class for right side', () => {
    const { container } = render(Sidebar, { props: { side: 'right' } });
    expect(container.querySelector('.drawer-end')).toBeTruthy();
  });

  it('applies lg:drawer-open when responsive', () => {
    const { container } = render(Sidebar, { props: { responsive: true } });
    const drawer = container.querySelector('.drawer');
    expect(drawer?.classList.contains('lg:drawer-open')).toBe(true);
  });

  it('does not apply lg:drawer-open when not responsive', () => {
    const { container } = render(Sidebar, { props: { responsive: false } });
    const drawer = container.querySelector('.drawer');
    expect(drawer?.classList.contains('lg:drawer-open')).toBe(false);
  });

  it('has navigation role on sidebar aside', () => {
    const { container } = render(Sidebar);
    const aside = container.querySelector('aside[role="navigation"]');
    expect(aside).toBeTruthy();
  });

  it('has aria-label on sidebar', () => {
    const { container } = render(Sidebar, { props: { ariaLabel: 'Site navigation' } });
    const aside = container.querySelector('aside');
    expect(aside?.getAttribute('aria-label')).toBe('Site navigation');
  });

  it('uses default aria-label', () => {
    const { container } = render(Sidebar);
    const aside = container.querySelector('aside');
    expect(aside?.getAttribute('aria-label')).toBe('Sidebar navigation');
  });

  it('has drawer-toggle checkbox', () => {
    const { container } = render(Sidebar);
    const checkbox = container.querySelector('.drawer-toggle');
    expect(checkbox).toBeTruthy();
    expect(checkbox?.getAttribute('type')).toBe('checkbox');
  });

  it('has drawer-overlay label', () => {
    const { container } = render(Sidebar);
    const overlay = container.querySelector('.drawer-overlay');
    expect(overlay).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(Sidebar, { props: { className: 'custom-sidebar' } });
    expect(container.querySelector('.custom-sidebar')).toBeTruthy();
  });
});
