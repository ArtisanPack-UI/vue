import { afterEach, describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import {
  registerDirectionalIcons,
  registerIcons,
  resetIcons,
} from '@artisanpack-ui/behavior/icons';
import { Icon } from '../../components/utility';

const root = (container: Element) => container.querySelector<HTMLElement>('.apui-icon')!;

afterEach(() => resetIcons());

describe('Icon', () => {
  it('renders a decorative registry glyph at md by default', () => {
    const { container } = render(Icon, { props: { name: 'house' } });
    const icon = root(container);
    expect(icon.tagName).toBe('SPAN');
    expect(icon.getAttribute('data-scope')).toBe('icon');
    expect(icon.getAttribute('data-variant')).toBe('plain');
    expect(icon.getAttribute('data-size')).toBe('md');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
    expect(icon.hasAttribute('data-color')).toBe(false);
    const svg = icon.querySelector('svg[data-scope="icon"][data-part="svg"]')!;
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('stroke-width')).toBe('1.5');
    expect(svg.innerHTML).toContain('<path');
  });

  it('is a named image with a label', () => {
    const icon = root(
      render(Icon, { props: { name: 'circle-alert', label: 'Payment failed' } }).container,
    );
    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Payment failed');
    expect(icon.hasAttribute('aria-hidden')).toBe(false);
  });

  it('keeps a caller aria-label or aria-labelledby and stays exposed', () => {
    const named = (attrs: Record<string, string>, props: Record<string, unknown> = {}) =>
      root(render(Icon, { props: { name: 'circle-alert', ...props }, attrs }).container);
    const byLabel = named({ 'aria-label': 'Error' });
    expect(byLabel.getAttribute('aria-label')).toBe('Error');
    expect(byLabel.getAttribute('role')).toBe('img');
    expect(byLabel.hasAttribute('aria-hidden')).toBe(false);
    const byId = named({ 'aria-labelledby': 'msg' });
    expect(byId.getAttribute('aria-labelledby')).toBe('msg');
    expect(byId.getAttribute('role')).toBe('img');
    expect(byId.hasAttribute('aria-hidden')).toBe(false);
    // label still wins, and an unnamed icon is still hidden.
    expect(
      named({ 'aria-label': 'Error' }, { label: 'Payment failed' }).getAttribute('aria-label'),
    ).toBe('Payment failed');
    const both = named({ 'aria-labelledby': 'msg' }, { label: 'Payment failed' });
    expect(both.getAttribute('aria-label')).toBe('Payment failed');
    expect(both.hasAttribute('aria-labelledby')).toBe(false);
    const unnamed = named({ title: 'x' });
    expect(unnamed.getAttribute('aria-hidden')).toBe('true');
    expect(unnamed.hasAttribute('role')).toBe(false);
  });

  it('writes size, color and the tile variant', () => {
    const icon = root(
      render(Icon, { props: { name: 'wallet', variant: 'tile', color: 'success', size: 'xl' } })
        .container,
    );
    expect(icon.className).toBe('apui-icon apui-icon-tile');
    expect(icon.getAttribute('data-variant')).toBe('tile');
    expect(icon.getAttribute('data-size')).toBe('xl');
    expect(icon.getAttribute('data-color')).toBe('success');
  });

  it('mirrors directional icons unless mirror says otherwise', () => {
    const mirrored = (props: Record<string, unknown>) =>
      root(render(Icon, { props }).container).hasAttribute('data-mirror');
    expect(mirrored({ name: 'arrow-right' })).toBe(true);
    expect(mirrored({ name: 'house' })).toBe(false);
    expect(mirrored({ name: 'arrow-right', mirror: false })).toBe(false);
    expect(mirrored({ name: 'house', mirror: true })).toBe(true);
    registerIcons({ send: '<path d="M4 12h16" />' });
    registerDirectionalIcons(['send']);
    expect(mirrored({ name: 'send' })).toBe(true);
  });

  it('draws the default slot in place of the name', () => {
    const icon = root(
      render(Icon, {
        props: { name: 'arrow-right', label: 'Grid' },
        slots: { default: '<svg viewBox="0 0 24 24"><rect width="18" height="18" /></svg>' },
      }).container,
    );
    expect(icon.querySelector('rect')).not.toBeNull();
    expect(icon.querySelector('[data-part="svg"]')).toBeNull();
    expect(icon.hasAttribute('data-mirror')).toBe(false);
  });

  it('takes classes and a class attribute', () => {
    const icon = root(
      render(Icon, {
        props: { name: 'house', classes: { root: 'r', svg: 's' } },
        attrs: { class: 'x' },
      }).container,
    );
    expect(icon.classList.contains('r')).toBe(true);
    expect(icon.classList.contains('x')).toBe(true);
    expect(icon.querySelector('svg')!.classList.contains('s')).toBe(true);
  });
});
