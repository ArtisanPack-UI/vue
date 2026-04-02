import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { nextTick } from 'vue';
import { Dropdown, DropdownItem } from '../../components/layout';

describe('Dropdown', () => {
  it('renders with default label', () => {
    render(Dropdown);
    expect(screen.getByText('Options')).toBeTruthy();
  });

  it('renders with custom label', () => {
    render(Dropdown, { props: { label: 'Menu' } });
    expect(screen.getByText('Menu')).toBeTruthy();
  });

  it('has correct ARIA attributes on trigger', () => {
    render(Dropdown);
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-haspopup')).toBe('true');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('has menu role on dropdown content', () => {
    const { container } = render(Dropdown, {
      props: { open: true },
      slots: { default: '<li>Item</li>' },
    });
    expect(container.querySelector('[role="menu"]')).toBeTruthy();
  });

  it('applies dropdown-end class', () => {
    const { container } = render(Dropdown, { props: { end: true } });
    expect(container.querySelector('.dropdown-end')).toBeTruthy();
  });

  it('applies dropdown-top class', () => {
    const { container } = render(Dropdown, { props: { top: true } });
    expect(container.querySelector('.dropdown-top')).toBeTruthy();
  });

  it('applies dropdown-hover class', () => {
    const { container } = render(Dropdown, { props: { hover: true } });
    expect(container.querySelector('.dropdown-hover')).toBeTruthy();
  });

  it('toggles open on trigger click in uncontrolled mode', async () => {
    const { container } = render(Dropdown);
    const trigger = screen.getByRole('button');

    await fireEvent.click(trigger);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    await fireEvent.click(trigger);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeFalsy();
  });

  it('renders slot content', () => {
    render(Dropdown, {
      props: { open: true },
      slots: { default: '<li>Test Item</li>' },
    });
    expect(screen.getByText('Test Item')).toBeTruthy();
  });
});

describe('DropdownItem', () => {
  it('renders as a button with menuitem role', () => {
    const { container } = render(DropdownItem, { slots: { default: 'Click me' } });
    const btn = container.querySelector('[role="menuitem"]');
    expect(btn).toBeTruthy();
    expect(btn?.tagName).toBe('BUTTON');
  });

  it('renders slot content', () => {
    render(DropdownItem, { slots: { default: 'Item Text' } });
    expect(screen.getByText('Item Text')).toBeTruthy();
  });

  it('disables the button when disabled is true', () => {
    const { container } = render(DropdownItem, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    });
    const btn = container.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('sets aria-disabled when disabled', () => {
    const { container } = render(DropdownItem, {
      props: { disabled: true },
      slots: { default: 'Disabled' },
    });
    const btn = container.querySelector('[role="menuitem"]');
    expect(btn?.getAttribute('aria-disabled')).toBe('true');
  });

  it('wraps button in li with role none', () => {
    const { container } = render(DropdownItem, { slots: { default: 'Item' } });
    const li = container.querySelector('li');
    expect(li?.getAttribute('role')).toBe('none');
  });
});
