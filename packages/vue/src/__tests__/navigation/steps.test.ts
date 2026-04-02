import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Steps } from '../../components/navigation';

const testSteps = [
  { label: 'Register' },
  { label: 'Choose Plan' },
  { label: 'Payment' },
  { label: 'Complete' },
];

describe('Steps', () => {
  it('renders all step labels', () => {
    render(Steps, { props: { steps: testSteps } });
    expect(screen.getByText('Register')).toBeTruthy();
    expect(screen.getByText('Choose Plan')).toBeTruthy();
    expect(screen.getByText('Payment')).toBeTruthy();
    expect(screen.getByText('Complete')).toBeTruthy();
  });

  it('applies step-primary to completed steps', () => {
    const { container } = render(Steps, {
      props: { steps: testSteps, currentStep: 1 },
    });
    const stepEls = container.querySelectorAll('.step');
    expect(stepEls[0].classList.contains('step-primary')).toBe(true);
    expect(stepEls[1].classList.contains('step-primary')).toBe(true);
    expect(stepEls[2].classList.contains('step-primary')).toBe(false);
  });

  it('applies default color (primary) to completed steps', () => {
    const { container } = render(Steps, {
      props: { steps: testSteps, currentStep: 0 },
    });
    const stepEls = container.querySelectorAll('.step');
    expect(stepEls[0].classList.contains('step-primary')).toBe(true);
    expect(stepEls[1].classList.contains('step-primary')).toBe(false);
  });

  it('applies custom color to completed steps', () => {
    const { container } = render(Steps, {
      props: { steps: testSteps, currentStep: 2, color: 'success' },
    });
    const stepEls = container.querySelectorAll('.step');
    expect(stepEls[0].classList.contains('step-success')).toBe(true);
    expect(stepEls[2].classList.contains('step-success')).toBe(true);
    expect(stepEls[3].classList.contains('step-success')).toBe(false);
  });

  it('supports per-step color override', () => {
    const steps = [{ label: 'Step 1', color: 'error' as const }, { label: 'Step 2' }];
    const { container } = render(Steps, {
      props: { steps, currentStep: 1 },
    });
    const stepEls = container.querySelectorAll('.step');
    expect(stepEls[0].classList.contains('step-error')).toBe(true);
    expect(stepEls[1].classList.contains('step-primary')).toBe(true);
  });

  it('applies vertical class', () => {
    const { container } = render(Steps, {
      props: { steps: testSteps, vertical: true },
    });
    expect(container.querySelector('.steps-vertical')).toBeTruthy();
  });

  it('has list role', () => {
    const { container } = render(Steps, { props: { steps: testSteps } });
    expect(container.querySelector('[role="list"]')).toBeTruthy();
  });

  it('has listitem role on each step', () => {
    const { container } = render(Steps, { props: { steps: testSteps } });
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items.length).toBe(4);
  });

  it('sets aria-current on active step', () => {
    const { container } = render(Steps, {
      props: { steps: testSteps, currentStep: 2 },
    });
    const items = container.querySelectorAll('[role="listitem"]');
    expect(items[2].getAttribute('aria-current')).toBe('step');
    expect(items[0].getAttribute('aria-current')).toBeNull();
    expect(items[3].getAttribute('aria-current')).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(Steps, {
      props: { steps: testSteps, className: 'custom-steps' },
    });
    expect(container.querySelector('.custom-steps')).toBeTruthy();
  });
});
