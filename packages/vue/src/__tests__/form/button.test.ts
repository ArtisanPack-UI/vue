import { afterEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { registerIcons, resetIcons } from '@artisanpack-ui/behavior/icons';
import { Button } from '../../components/form';

const SVG_ATTRIBUTES = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '1.5',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="button"][data-part="${name}"]`);

afterEach(() => resetIcons());

describe('Button', () => {
  it('renders a native button with the default data attributes', () => {
    const { container } = render(Button, { slots: { default: 'Save' } });
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.tagName).toBe('BUTTON');
    expect(button.className).toBe('apui-button');
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('data-variant')).toBe('solid');
    expect(button.getAttribute('data-color')).toBe('primary');
    expect(button.getAttribute('data-size')).toBe('md');
    expect(button.hasAttribute('data-disabled')).toBe(false);
    expect(button.hasAttribute('aria-busy')).toBe(false);
    expect(partOf(container, 'label')?.textContent).toBe('Save');
  });

  it('emits variant, color and size as data attributes', () => {
    render(Button, {
      props: { variant: 'outline', color: 'error', size: 'xl' },
      slots: { default: 'Delete' },
    });
    const button = screen.getByRole('button');
    expect(button.getAttribute('data-variant')).toBe('outline');
    expect(button.getAttribute('data-color')).toBe('error');
    expect(button.getAttribute('data-size')).toBe('xl');
  });

  it('passes the native type through', () => {
    render(Button, { props: { type: 'submit' }, slots: { default: 'Send' } });
    expect(screen.getByRole('button').getAttribute('type')).toBe('submit');
  });

  it('renders an anchor with href and no type', () => {
    render(Button, { props: { href: '/dashboard' }, slots: { default: 'Go' } });
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/dashboard');
    expect(link.hasAttribute('type')).toBe(false);
    expect(link.getAttribute('data-variant')).toBe('solid');
  });

  it('renders a disabled anchor without href, with aria-disabled and no tabindex', () => {
    const onClick = vi.fn();
    const { container } = render(Button, {
      props: { href: '/dashboard', disabled: true },
      attrs: { onClick },
      slots: { default: 'Go' },
    });
    const anchor = container.querySelector('a.apui-button')!;
    expect(anchor.hasAttribute('href')).toBe(false);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.getAttribute('data-disabled')).toBe('');
    expect(anchor.hasAttribute('tabindex')).toBe(false);
    anchor.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disables a native button with disabled and data-disabled', () => {
    render(Button, { props: { disabled: true }, slots: { default: 'Save' } });
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('data-disabled')).toBe('');
    expect(button.hasAttribute('aria-disabled')).toBe(false);
  });

  it('forwards clicks when idle', async () => {
    const onClick = vi.fn();
    render(Button, { attrs: { onClick }, slots: { default: 'Save' } });
    await fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows the spinner, keeps the label and ignores clicks while loading', async () => {
    const onClick = vi.fn();
    const { container } = render(Button, {
      props: { loading: true },
      attrs: { onClick },
      slots: { default: 'Save' },
    });
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect((button as HTMLButtonElement).disabled).toBe(false);
    expect(partOf(container, 'label')?.textContent).toBe('Save');
    const spinner = partOf(container, 'spinner')!;
    expect(spinner.getAttribute('aria-hidden')).toBe('true');
    expect(spinner.innerHTML).toBe('');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(event);
    expect(onClick).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(true);
  });

  it('renders no spinner when not loading', () => {
    const { container } = render(Button, { slots: { default: 'Save' } });
    expect(partOf(container, 'spinner')).toBeNull();
  });

  it('renders icon-only buttons without a label part', () => {
    const { container } = render(Button, {
      props: { iconOnly: true, leadingIcon: 'plus' },
      attrs: { 'aria-label': 'Add' },
      slots: { default: 'Add' },
    });
    const button = screen.getByRole('button', { name: 'Add' });
    expect(button.getAttribute('data-icon-only')).toBe('');
    expect(partOf(container, 'label')).toBeNull();
    expect(partOf(container, 'icon')?.querySelector('svg')).not.toBeNull();
  });

  it('omits the label part without content', () => {
    const { container } = render(Button, { props: { leadingIcon: 'plus' } });
    expect(partOf(container, 'label')).toBeNull();
  });

  it('resolves leading and trailing icons with the contract svg attributes', () => {
    const { container } = render(Button, {
      props: { leadingIcon: 'plus', trailingIcon: 'arrow-right' },
      slots: { default: 'Next' },
    });
    const icon = partOf(container, 'icon')!;
    const iconEnd = partOf(container, 'iconEnd')!;
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(iconEnd.getAttribute('aria-hidden')).toBe('true');
    const svg = icon.querySelector('svg')!;
    for (const [name, value] of Object.entries(SVG_ATTRIBUTES)) {
      expect(svg.getAttribute(name)).toBe(value);
    }
    expect(svg.innerHTML).not.toBe('');
    const parts = [...container.querySelectorAll('[data-part]')].map((el) =>
      el.getAttribute('data-part'),
    );
    expect(parts).toEqual(['icon', 'label', 'iconEnd']);
  });

  it('mirrors directional icons only', () => {
    const { container } = render(Button, {
      props: { leadingIcon: 'plus', trailingIcon: 'arrow-right' },
      slots: { default: 'Next' },
    });
    expect(partOf(container, 'icon')!.hasAttribute('data-mirror')).toBe(false);
    expect(partOf(container, 'iconEnd')!.getAttribute('data-mirror')).toBe('');
  });

  it('keeps the part span but renders no svg for an unknown icon', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(Button, {
      props: { leadingIcon: 'does-not-exist' },
      slots: { default: 'Save' },
    });
    const icon = partOf(container, 'icon')!;
    expect(icon).not.toBeNull();
    expect(icon.querySelector('svg')).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('resolves icons registered by the app', () => {
    registerIcons({ star: '<path d="M1 1h2" />' });
    const { container } = render(Button, {
      props: { leadingIcon: 'star' },
      slots: { default: 'Star' },
    });
    expect(partOf(container, 'icon')!.querySelector('svg path')?.getAttribute('d')).toBe('M1 1h2');
  });

  it('lets the icon and iconEnd slots override the icon names', () => {
    const { container } = render(Button, {
      props: { leadingIcon: 'plus', trailingIcon: 'arrow-right' },
      slots: {
        default: 'Next',
        icon: '<i class="custom-start" />',
        iconEnd: '<i class="custom-end" />',
      },
    });
    const icon = partOf(container, 'icon')!;
    const iconEnd = partOf(container, 'iconEnd')!;
    expect(icon.querySelector('.custom-start')).not.toBeNull();
    expect(icon.querySelector('svg')).toBeNull();
    expect(iconEnd.querySelector('.custom-end')).not.toBeNull();
    expect(iconEnd.hasAttribute('data-mirror')).toBe(false);
  });

  it('routes class and attributes to the root and classes to each part', () => {
    const { container } = render(Button, {
      props: {
        leadingIcon: 'plus',
        loading: true,
        classes: { root: 'r', label: 'l', icon: 'i', spinner: 's' },
      },
      attrs: { class: 'extra', 'data-testid': 'btn', name: 'action' },
      slots: { default: 'Save' },
    });
    const button = screen.getByTestId('btn');
    expect(button.className).toBe('apui-button extra r');
    expect(button.getAttribute('name')).toBe('action');
    expect(partOf(container, 'label')!.className).toBe('l');
    expect(partOf(container, 'icon')!.className).toBe('i');
    expect(partOf(container, 'spinner')!.className).toBe('s');
  });

  it('renders no class attribute on parts without classes', () => {
    const { container } = render(Button, { slots: { default: 'Save' } });
    expect(partOf(container, 'label')!.hasAttribute('class')).toBe(false);
  });

  it('renders a loading link without href, with aria-disabled and aria-busy but not data-disabled', () => {
    const onClick = vi.fn();
    const { container } = render(Button, {
      props: { href: '/save', loading: true },
      attrs: { onClick },
      slots: { default: 'Save' },
    });
    const anchor = container.querySelector('a.apui-button')!;
    expect(anchor.hasAttribute('href')).toBe(false);
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.getAttribute('aria-busy')).toBe('true');
    expect(anchor.hasAttribute('data-disabled')).toBe(false);
    anchor.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([
    'javascript:alert(1)',
    '  JaVa\tScRiPt:alert(1)',
    '\u0001javascript:alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html,<script>alert(1)</script>',
    'ftp://example.com/file',
    'file:///etc/passwd',
    'intent://scan',
  ])('ignores the href %j outside the allowlist and renders a button', (href) => {
    const { container } = render(Button, { props: { href }, slots: { default: 'Go' } });
    expect(container.querySelector('a')).toBeNull();
    expect(screen.getByRole('button').getAttribute('type')).toBe('button');
  });

  it.each([
    '/dashboard',
    './next',
    '../up',
    'page',
    '?tab=2',
    '#section',
    '//cdn.example.com/a',
    'http://example.com',
    'HTTPS://example.com',
    'mailto:hi@example.com',
    'tel:+15555550100',
    'sms:+15555550100',
    '/path:with:colons',
  ])('keeps the allowlisted href %j', (href) => {
    render(Button, { props: { href }, slots: { default: 'Go' } });
    expect(screen.getByRole('link').getAttribute('href')).toBe(href);
  });

  it('resolves the new directional icons and mirrors them', () => {
    const { container } = render(Button, {
      props: { leadingIcon: 'chevron-left', trailingIcon: 'chevron-right' },
      slots: { default: 'Page' },
    });
    for (const name of ['icon', 'iconEnd']) {
      expect(partOf(container, name)!.getAttribute('data-mirror')).toBe('');
      expect(partOf(container, name)!.querySelector('svg')).not.toBeNull();
    }
  });
});
