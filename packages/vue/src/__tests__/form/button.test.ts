import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Button } from '../../components/form';

describe('Button', () => {
  it('renders with label text', () => {
    render(Button, { props: { label: 'Click Me' } });
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('renders as a button element by default', () => {
    render(Button, { props: { label: 'Test' } });
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('renders as an anchor when link prop is provided', () => {
    render(Button, { props: { label: 'Link', link: '/dashboard' } });
    const link = screen.getByRole('button');
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/dashboard');
  });

  it('opens in new tab when external and link are set', () => {
    render(Button, { props: { label: 'External', link: '/ext', external: true } });
    const link = screen.getByRole('button');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('applies color variant class', () => {
    render(Button, { props: { label: 'Primary', color: 'primary' } });
    expect(screen.getByRole('button').classList.contains('btn-primary')).toBe(true);
  });

  it('applies size class', () => {
    render(Button, { props: { label: 'Small', size: 'sm' } });
    expect(screen.getByRole('button').classList.contains('btn-sm')).toBe(true);
  });

  it('shows loading spinner when loading', () => {
    render(Button, { props: { label: 'Loading', loading: true } });
    const spinner = document.querySelector('.loading-spinner');
    expect(spinner).toBeTruthy();
  });

  it('disables button when disabled prop is true', () => {
    render(Button, { props: { label: 'Disabled', disabled: true } });
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('disables button when loading', () => {
    render(Button, { props: { label: 'Loading', loading: true } });
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('renders badge when badge prop is provided', () => {
    render(Button, { props: { label: 'Badge', badge: '3' } });
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('3').classList.contains('badge')).toBe(true);
  });

  it('wraps in tooltip when tooltip prop is provided', () => {
    render(Button, { props: { label: 'Tip', tooltip: 'Hello' } });
    const tooltip = document.querySelector('.tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.getAttribute('data-tip')).toBe('Hello');
  });

  it('applies tooltip position class', () => {
    render(Button, { props: { label: 'Tip', tooltip: 'Hello', tooltipPosition: 'bottom' } });
    const tooltip = document.querySelector('.tooltip');
    expect(tooltip?.classList.contains('tooltip-bottom')).toBe(true);
  });

  it('hides label on small screens when responsive', () => {
    render(Button, { props: { label: 'Responsive', responsive: true } });
    const labelSpan = screen.getByText('Responsive');
    expect(labelSpan.classList.contains('hidden')).toBe(true);
  });

  it('sets aria-busy when loading', () => {
    render(Button, { props: { label: 'Busy', loading: true } });
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true');
  });

  it('defaults to type="button"', () => {
    render(Button, { props: { label: 'Default' } });
    expect(screen.getByRole('button').getAttribute('type')).toBe('button');
  });

  it('accepts type="submit"', () => {
    render(Button, { props: { label: 'Submit', type: 'submit' } });
    expect(screen.getByRole('button').getAttribute('type')).toBe('submit');
  });

  it('renders slot content', () => {
    render(Button, { slots: { default: 'Slot Content' } });
    expect(screen.getByText('Slot Content')).toBeTruthy();
  });
});
