import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Divider } from '../../components/layout';

describe('Divider', () => {
  it('renders a horizontal divider by default', () => {
    const { container } = render(Divider);
    const el = container.querySelector('.divider');
    expect(el).toBeTruthy();
    expect(el?.getAttribute('role')).toBe('separator');
    expect(el?.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('renders a vertical divider when vertical is true', () => {
    const { container } = render(Divider, { props: { vertical: true } });
    const el = container.querySelector('.divider');
    expect(el?.classList.contains('divider-horizontal')).toBe(true);
    expect(el?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('renders label text', () => {
    render(Divider, { props: { label: 'OR' } });
    expect(screen.getByText('OR')).toBeTruthy();
  });

  it('applies color variant class', () => {
    const { container } = render(Divider, { props: { color: 'primary' } });
    expect(container.querySelector('.divider-primary')).toBeTruthy();
  });

  it('applies label position class', () => {
    const { container } = render(Divider, { props: { label: 'Test', labelPosition: 'start' } });
    expect(container.querySelector('.divider-start')).toBeTruthy();
  });

  it('applies end label position class', () => {
    const { container } = render(Divider, { props: { label: 'Test', labelPosition: 'end' } });
    expect(container.querySelector('.divider-end')).toBeTruthy();
  });
});
