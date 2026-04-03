import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Tooltip } from '../../components/utility';

describe('Tooltip', () => {
  it('renders slot content', () => {
    render(Tooltip, {
      props: { text: 'Tooltip text' },
      slots: { default: '<button>Hover me</button>' },
    });
    expect(screen.getByText('Hover me')).toBeTruthy();
  });

  it('sets data-tip attribute with tooltip text', () => {
    const { container } = render(Tooltip, {
      props: { text: 'Helpful tip' },
      slots: { default: '<span>Trigger</span>' },
    });
    expect(container.querySelector('[data-tip="Helpful tip"]')).toBeTruthy();
  });

  it('has tooltip class', () => {
    const { container } = render(Tooltip, {
      props: { text: 'Tip' },
      slots: { default: '<span>Trigger</span>' },
    });
    expect(container.querySelector('.tooltip')).toBeTruthy();
  });

  it('applies default top position', () => {
    const { container } = render(Tooltip, {
      props: { text: 'Tip' },
      slots: { default: '<span>Trigger</span>' },
    });
    expect(container.querySelector('.tooltip-top')).toBeTruthy();
  });

  it('applies all position variants', () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;
    positions.forEach((position) => {
      const { container, unmount } = render(Tooltip, {
        props: { text: 'Tip', position },
        slots: { default: '<span>Trigger</span>' },
      });
      expect(container.querySelector(`.tooltip-${position}`)).toBeTruthy();
      unmount();
    });
  });

  it('applies color variant class', () => {
    const { container } = render(Tooltip, {
      props: { text: 'Tip', color: 'primary' },
      slots: { default: '<span>Trigger</span>' },
    });
    expect(container.querySelector('.tooltip-primary')).toBeTruthy();
  });

  it('applies all color variants', () => {
    const colors = ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info', 'neutral'] as const;
    colors.forEach((color) => {
      const { container, unmount } = render(Tooltip, {
        props: { text: 'Tip', color },
        slots: { default: '<span>Trigger</span>' },
      });
      expect(container.querySelector(`.tooltip-${color}`)).toBeTruthy();
      unmount();
    });
  });

  it('applies tooltip-open class when forceOpen is true', () => {
    const { container } = render(Tooltip, {
      props: { text: 'Tip', forceOpen: true },
      slots: { default: '<span>Trigger</span>' },
    });
    expect(container.querySelector('.tooltip-open')).toBeTruthy();
  });

  it('does not apply tooltip-open class by default', () => {
    const { container } = render(Tooltip, {
      props: { text: 'Tip' },
      slots: { default: '<span>Trigger</span>' },
    });
    expect(container.querySelector('.tooltip-open')).toBeFalsy();
  });

  it('has aria-describedby linking to a role="tooltip" element', () => {
    const { container } = render(Tooltip, {
      props: { text: 'Accessible tip' },
      slots: { default: '<span>Trigger</span>' },
    });
    const wrapper = container.querySelector('.tooltip');
    const describedBy = wrapper?.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();

    const tooltipEl = screen.getByRole('tooltip');
    expect(tooltipEl).toBeTruthy();
    expect(tooltipEl.id).toBe(describedBy);
    expect(tooltipEl.textContent).toBe('Accessible tip');
  });

  it('hides the tooltip text visually with sr-only', () => {
    render(Tooltip, {
      props: { text: 'Hidden visually' },
      slots: { default: '<span>Trigger</span>' },
    });
    const tooltipEl = screen.getByRole('tooltip');
    expect(tooltipEl.classList.contains('sr-only')).toBe(true);
  });

  it('applies custom className', () => {
    const { container } = render(Tooltip, {
      props: { text: 'Tip', className: 'custom-tooltip' },
      slots: { default: '<span>Trigger</span>' },
    });
    expect(container.querySelector('.custom-tooltip')).toBeTruthy();
  });
});
