import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Accordion } from '../../components/layout';

describe('Accordion', () => {
  it('renders with join classes by default', () => {
    const { container } = render(Accordion, { slots: { default: '<div>Panel</div>' } });
    const el = container.firstElementChild!;
    expect(el.classList.contains('join')).toBe(true);
    expect(el.classList.contains('join-vertical')).toBe(true);
  });

  it('does not apply join classes when join is false', () => {
    const { container } = render(Accordion, {
      props: { join: false },
      slots: { default: '<div>Panel</div>' },
    });
    const el = container.firstElementChild!;
    expect(el.classList.contains('join')).toBe(false);
    expect(el.classList.contains('join-vertical')).toBe(false);
  });

  it('renders slot content', () => {
    const { container } = render(Accordion, {
      slots: { default: '<div class="test-panel">Panel Content</div>' },
    });
    expect(container.querySelector('.test-panel')).toBeTruthy();
  });
});
