import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Timeline } from '../../components/display';

const sampleItems = [
  { id: 1, title: 'First event', description: 'Description 1', time: '2024-01-01' },
  { id: 2, title: 'Second event', description: 'Description 2', time: '2024-01-15' },
  { id: 3, title: 'Third event', time: '2024-02-01' },
];

describe('Timeline', () => {
  it('renders all timeline items', () => {
    render(Timeline, { props: { items: sampleItems } });
    expect(screen.getByText('First event')).toBeTruthy();
    expect(screen.getByText('Second event')).toBeTruthy();
    expect(screen.getByText('Third event')).toBeTruthy();
  });

  it('renders descriptions', () => {
    render(Timeline, { props: { items: sampleItems } });
    expect(screen.getByText('Description 1')).toBeTruthy();
    expect(screen.getByText('Description 2')).toBeTruthy();
  });

  it('renders time labels', () => {
    render(Timeline, { props: { items: sampleItems } });
    expect(screen.getByText('2024-01-01')).toBeTruthy();
    expect(screen.getByText('2024-01-15')).toBeTruthy();
  });

  it('applies vertical class by default', () => {
    const { container } = render(Timeline, { props: { items: sampleItems } });
    expect(container.querySelector('.timeline-vertical')).toBeTruthy();
  });

  it('applies horizontal class when vertical is false', () => {
    const { container } = render(Timeline, {
      props: { items: sampleItems, vertical: false },
    });
    expect(container.querySelector('.timeline-horizontal')).toBeTruthy();
  });

  it('applies snap class', () => {
    const { container } = render(Timeline, {
      props: { items: sampleItems, snap: true },
    });
    expect(container.querySelector('.timeline-snap-icon')).toBeTruthy();
  });

  it('applies compact class', () => {
    const { container } = render(Timeline, {
      props: { items: sampleItems, compact: true },
    });
    expect(container.querySelector('.timeline-compact')).toBeTruthy();
  });

  it('has correct ARIA role', () => {
    const { container } = render(Timeline, { props: { items: sampleItems } });
    expect(container.querySelector('ul[aria-label="Timeline"]')).toBeTruthy();
  });

  it('renders correct number of list items', () => {
    const { container } = render(Timeline, { props: { items: sampleItems } });
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);
  });
});
