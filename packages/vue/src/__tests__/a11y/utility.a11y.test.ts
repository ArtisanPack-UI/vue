import { describe, it, expect, beforeAll } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import { type Component, defineComponent, h } from 'vue';
import { Clipboard, Icon, ThemeToggle, Tooltip } from '../../components/utility';
import { provideTheme } from '../../composables/use-theme';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

function withThemeProvider(
  component: Component,
  options: { props?: Record<string, unknown>; slots?: Record<string, string> } = {},
) {
  const wrapper = defineComponent({
    setup() {
      provideTheme();
    },
    render() {
      return h(component, options.props ?? {}, options.slots ?? {});
    },
  });
  return render(wrapper);
}

describe('Utility components accessibility', () => {
  it('Clipboard has no a11y violations', async () => {
    const { container } = render(Clipboard, {
      props: { text: 'Copy me' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Icon has no a11y violations', async () => {
    const { container } = render(Icon, {
      props: { ariaLabel: 'Check icon' },
      slots: { default: '<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ThemeToggle has no a11y violations', async () => {
    const { container } = withThemeProvider(ThemeToggle);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Tooltip has no a11y violations', async () => {
    const { container } = render(Tooltip, {
      props: { text: 'Helpful tip' },
      slots: { default: '<button>Hover me</button>' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
