import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Badge } from '../../components/display';

describe('Badge', () => {
  it('renders value text', () => {
    render(Badge, { props: { value: 'New' } });
    expect(screen.getByText('New')).toBeTruthy();
  });

  it('renders numeric value', () => {
    render(Badge, { props: { value: 42 } });
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('renders slot content when no value provided', () => {
    render(Badge, { slots: { default: 'Slot content' } });
    expect(screen.getByText('Slot content')).toBeTruthy();
  });

  it('applies badge base class', () => {
    const { container } = render(Badge, { props: { value: 'Test' } });
    expect(container.querySelector('.badge')).toBeTruthy();
  });

  it('applies color variant', () => {
    const { container } = render(Badge, {
      props: { value: 'Test', color: 'primary' },
    });
    expect(container.querySelector('.badge-primary')).toBeTruthy();
  });

  it('applies size class', () => {
    const { container } = render(Badge, {
      props: { value: 'Test', size: 'lg' },
    });
    expect(container.querySelector('.badge-lg')).toBeTruthy();
  });

  it('applies outline variant', () => {
    const { container } = render(Badge, {
      props: { value: 'Test', outline: true },
    });
    expect(container.querySelector('.badge-outline')).toBeTruthy();
  });

  it('applies ghost variant', () => {
    const { container } = render(Badge, {
      props: { value: 'Test', ghost: true },
    });
    expect(container.querySelector('.badge-ghost')).toBeTruthy();
  });

  it('renders as a span element', () => {
    const { container } = render(Badge, { props: { value: 'Test' } });
    expect(container.querySelector('span.badge')).toBeTruthy();
  });
});
