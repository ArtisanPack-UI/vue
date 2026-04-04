import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import { Alert, EmptyState, ErrorDisplay, Loading, Skeleton } from '../../components/feedback';

describe('Feedback components accessibility', () => {
  it('Alert info has no a11y violations', async () => {
    const { container } = render(Alert, {
      props: { color: 'info' },
      slots: { default: 'This is an info message.' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Alert error has no a11y violations', async () => {
    const { container } = render(Alert, {
      props: { color: 'error' },
      slots: { default: 'Something went wrong.' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('EmptyState has no a11y violations', async () => {
    const { container } = render(EmptyState, {
      props: { heading: 'No results', description: 'Try adjusting your filters.' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ErrorDisplay has no a11y violations', async () => {
    const { container } = render(ErrorDisplay, {
      props: { title: 'Error', message: 'Something went wrong.' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Loading has no a11y violations', async () => {
    const { container } = render(Loading);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Skeleton has no a11y violations', async () => {
    const { container } = render(Skeleton);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
