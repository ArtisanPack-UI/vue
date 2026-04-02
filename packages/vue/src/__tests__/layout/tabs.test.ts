import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Tabs } from '../../components/layout';

const testTabs = [
  { name: 'tab1', label: 'Tab One' },
  { name: 'tab2', label: 'Tab Two' },
  { name: 'tab3', label: 'Tab Three', disabled: true },
];

describe('Tabs', () => {
  it('renders all tab buttons', () => {
    render(Tabs, { props: { tabs: testTabs } });
    expect(screen.getByText('Tab One')).toBeTruthy();
    expect(screen.getByText('Tab Two')).toBeTruthy();
    expect(screen.getByText('Tab Three')).toBeTruthy();
  });

  it('sets first non-disabled tab as active by default', () => {
    render(Tabs, { props: { tabs: testTabs } });
    const tab1 = screen.getByText('Tab One');
    expect(tab1.getAttribute('aria-selected')).toBe('true');
  });

  it('uses defaultTab when provided', () => {
    render(Tabs, { props: { tabs: testTabs, defaultTab: 'tab2' } });
    const tab2 = screen.getByText('Tab Two');
    expect(tab2.getAttribute('aria-selected')).toBe('true');
  });

  it('switches tab on click', async () => {
    render(Tabs, { props: { tabs: testTabs } });
    const tab2 = screen.getByText('Tab Two');
    await fireEvent.click(tab2);
    expect(tab2.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Tab One').getAttribute('aria-selected')).toBe('false');
  });

  it('does not activate disabled tab on click', async () => {
    render(Tabs, { props: { tabs: testTabs } });
    const tab3 = screen.getByText('Tab Three');
    await fireEvent.click(tab3);
    expect(tab3.getAttribute('aria-selected')).toBe('false');
  });

  it('has correct ARIA roles', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs } });
    expect(container.querySelector('[role="tablist"]')).toBeTruthy();
    expect(container.querySelectorAll('[role="tab"]').length).toBe(3);
    expect(container.querySelectorAll('[role="tabpanel"]').length).toBe(3);
  });

  it('links tab to tabpanel via aria-controls', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs } });
    const tab1 = screen.getByText('Tab One');
    const controlledId = tab1.getAttribute('aria-controls');
    expect(controlledId).toBeTruthy();
    expect(container.querySelector(`#${controlledId}`)).toBeTruthy();
  });

  it('applies variant class', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, variant: 'lifted' } });
    expect(container.querySelector('.tabs-lifted')).toBeTruthy();
  });

  it('applies size class', () => {
    const { container } = render(Tabs, { props: { tabs: testTabs, size: 'lg' } });
    expect(container.querySelector('.tabs-lg')).toBeTruthy();
  });

  it('applies color class to active tab', () => {
    render(Tabs, { props: { tabs: testTabs, color: 'primary' } });
    const tab1 = screen.getByText('Tab One');
    expect(tab1.classList.contains('text-primary')).toBe(true);
  });

  it('sets disabled tab as aria-disabled', () => {
    render(Tabs, { props: { tabs: testTabs } });
    const tab3 = screen.getByText('Tab Three');
    expect(tab3.getAttribute('aria-disabled')).toBe('true');
  });

  it('sets inactive tabs to tabindex -1', () => {
    render(Tabs, { props: { tabs: testTabs } });
    const tab2 = screen.getByText('Tab Two');
    expect(tab2.getAttribute('tabindex')).toBe('-1');
  });

  it('sets active tab to tabindex 0', () => {
    render(Tabs, { props: { tabs: testTabs } });
    const tab1 = screen.getByText('Tab One');
    expect(tab1.getAttribute('tabindex')).toBe('0');
  });
});
