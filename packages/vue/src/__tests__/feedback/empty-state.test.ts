import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { EmptyState } from '../../components/feedback';

describe('EmptyState', () => {
  it('renders heading', () => {
    render(EmptyState, { props: { heading: 'No items found' } });
    expect(screen.getByText('No items found')).toBeTruthy();
  });

  it('renders description', () => {
    render(EmptyState, { props: { description: 'Try adjusting your filters' } });
    expect(screen.getByText('Try adjusting your filters')).toBeTruthy();
  });

  it('renders icon slot', () => {
    render(EmptyState, {
      slots: { icon: '<span data-testid="icon">📭</span>' },
    });
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('renders action slot', () => {
    render(EmptyState, {
      slots: { action: '<button>Add item</button>' },
    });
    expect(screen.getByText('Add item')).toBeTruthy();
  });

  it('renders default slot content', () => {
    render(EmptyState, { slots: { default: 'Custom content' } });
    expect(screen.getByText('Custom content')).toBeTruthy();
  });

  it('renders all parts together', () => {
    render(EmptyState, {
      props: { heading: 'No results', description: 'Nothing here yet' },
      slots: {
        icon: '<span data-testid="icon">📭</span>',
        action: '<button>Create</button>',
      },
    });
    expect(screen.getByTestId('icon')).toBeTruthy();
    expect(screen.getByText('No results')).toBeTruthy();
    expect(screen.getByText('Nothing here yet')).toBeTruthy();
    expect(screen.getByText('Create')).toBeTruthy();
  });

  it('renders correct element via headingAs prop', () => {
    render(EmptyState, {
      props: { heading: 'Custom Heading', headingAs: 'h2' },
    });
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toBe('Custom Heading');
  });

  it('defaults heading to h3', () => {
    render(EmptyState, { props: { heading: 'Default Heading' } });
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading.textContent).toBe('Default Heading');
  });

  it('applies custom className', () => {
    const { container } = render(EmptyState, {
      props: { className: 'custom' },
    });
    expect(container.querySelector('.custom')).toBeTruthy();
  });
});
