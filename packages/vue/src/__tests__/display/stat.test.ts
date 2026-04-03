import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Stat } from '../../components/display';

describe('Stat', () => {
  it('renders title', () => {
    render(Stat, { props: { title: 'Total Users', value: '1,234' } });
    expect(screen.getByText('Total Users')).toBeTruthy();
  });

  it('renders value', () => {
    render(Stat, { props: { title: 'Revenue', value: '$5,678' } });
    expect(screen.getByText('$5,678')).toBeTruthy();
  });

  it('renders description', () => {
    render(Stat, {
      props: { title: 'Users', value: '100', description: 'Jan 1st - Feb 1st' },
    });
    expect(screen.getByText('Jan 1st - Feb 1st')).toBeTruthy();
  });

  it('renders change indicator', () => {
    render(Stat, {
      props: { title: 'Users', value: '100', change: '+21% (30 days)' },
    });
    expect(screen.getByText('+21% (30 days)')).toBeTruthy();
  });

  it('applies success color for up direction', () => {
    const { container } = render(Stat, {
      props: { title: 'Users', value: '100', change: '+21%', changeDirection: 'up' },
    });
    expect(container.querySelector('.text-success')).toBeTruthy();
  });

  it('applies error color for down direction', () => {
    const { container } = render(Stat, {
      props: { title: 'Users', value: '100', change: '-5%', changeDirection: 'down' },
    });
    expect(container.querySelector('.text-error')).toBeTruthy();
  });

  it('applies stat base class', () => {
    const { container } = render(Stat, { props: { title: 'Users', value: '100' } });
    expect(container.querySelector('.stat')).toBeTruthy();
  });

  it('renders figure slot', () => {
    const { container } = render(Stat, {
      props: { title: 'Users', value: '100' },
      slots: { figure: '<span>Icon</span>' },
    });
    expect(container.querySelector('.stat-figure')).toBeTruthy();
    expect(screen.getByText('Icon')).toBeTruthy();
  });

  it('renders actions slot', () => {
    const { container } = render(Stat, {
      props: { title: 'Users', value: '100' },
      slots: { actions: '<button>View</button>' },
    });
    expect(container.querySelector('.stat-actions')).toBeTruthy();
    expect(screen.getByText('View')).toBeTruthy();
  });
});
