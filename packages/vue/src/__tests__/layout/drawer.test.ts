import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Drawer } from '../../components/layout';

describe('Drawer', () => {
  it('renders with drawer class', () => {
    const { container } = render(Drawer, {
      props: { open: false },
      slots: { default: 'Main Content', side: 'Side Content' },
    });
    expect(container.querySelector('.drawer')).toBeTruthy();
  });

  it('applies drawer-end class when end is true', () => {
    const { container } = render(Drawer, {
      props: { open: false, end: true },
      slots: { default: 'Main', side: 'Side' },
    });
    expect(container.querySelector('.drawer-end')).toBeTruthy();
  });

  it('renders main content in drawer-content', () => {
    render(Drawer, {
      props: { open: false },
      slots: { default: 'Main Content', side: 'Side Content' },
    });
    expect(screen.getByText('Main Content')).toBeTruthy();
  });

  it('renders side content in drawer side panel', () => {
    render(Drawer, {
      props: { open: false },
      slots: { default: 'Main', side: 'Side Panel Content' },
    });
    expect(screen.getByText('Side Panel Content')).toBeTruthy();
  });

  it('has dialog role on side panel', () => {
    const { container } = render(Drawer, {
      props: { open: true },
      slots: { default: 'Main', side: 'Side' },
    });
    expect(container.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('has aria-modal on side panel', () => {
    const { container } = render(Drawer, {
      props: { open: true },
      slots: { default: 'Main', side: 'Side' },
    });
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
  });

  it('has drawer-toggle checkbox', () => {
    const { container } = render(Drawer, {
      props: { open: true },
      slots: { default: 'Main', side: 'Side' },
    });
    const checkbox = container.querySelector('.drawer-toggle') as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);
  });

  it('checkbox is unchecked when drawer is closed', () => {
    const { container } = render(Drawer, {
      props: { open: false },
      slots: { default: 'Main', side: 'Side' },
    });
    const checkbox = container.querySelector('.drawer-toggle') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });
});
