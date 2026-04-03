import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Diff } from '../../components/display';

describe('Diff', () => {
  const before = 'line one\nline two\nline three';
  const after = 'line one\nline modified\nline three\nline four';

  it('renders side-by-side view by default', () => {
    render(Diff, { props: { before, after } });
    expect(screen.getByText('Before')).toBeTruthy();
    expect(screen.getByText('After')).toBeTruthy();
  });

  it('renders inline view', () => {
    render(Diff, { props: { before, after, mode: 'inline' } });
    expect(screen.getByText('Before → After')).toBeTruthy();
  });

  it('shows custom labels', () => {
    render(Diff, {
      props: { before, after, beforeLabel: 'Original', afterLabel: 'Modified' },
    });
    expect(screen.getByText('Original')).toBeTruthy();
    expect(screen.getByText('Modified')).toBeTruthy();
  });

  it('displays unchanged lines', () => {
    render(Diff, { props: { before, after } });
    expect(screen.getAllByText('line one').length).toBeGreaterThan(0);
    expect(screen.getAllByText('line three').length).toBeGreaterThan(0);
  });

  it('highlights modified lines', () => {
    const { container } = render(Diff, { props: { before, after } });
    const errorCells = container.querySelectorAll('.bg-error\\/10');
    const successCells = container.querySelectorAll('.bg-success\\/10');
    expect(errorCells.length).toBeGreaterThan(0);
    expect(successCells.length).toBeGreaterThan(0);
  });

  it('highlights added lines', () => {
    const { container } = render(Diff, { props: { before, after } });
    const addedCells = container.querySelectorAll('.bg-success\\/20');
    expect(addedCells.length).toBeGreaterThan(0);
  });

  it('shows line numbers by default', () => {
    const { container } = render(Diff, { props: { before, after } });
    expect(container.querySelector('th')?.textContent).toContain('#');
  });

  it('hides line numbers when disabled', () => {
    const { container } = render(Diff, {
      props: { before, after, lineNumbers: false },
    });
    const headers = container.querySelectorAll('th');
    const hasLineNumHeader = Array.from(headers).some((h) => h.textContent?.includes('#'));
    expect(hasLineNumHeader).toBe(false);
  });

  it('has correct ARIA role', () => {
    const { container } = render(Diff, { props: { before, after } });
    expect(container.querySelector('[role="region"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Diff viewer"]')).toBeTruthy();
  });
});
