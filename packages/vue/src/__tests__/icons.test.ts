import { afterEach, describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { resetIcons } from '@artisanpack-ui/behavior/icons';
import { Button, registerIcons, UnsafeIconError } from '../index';

afterEach(() => resetIcons());

describe('icon registry re-exports', () => {
  it('registers icons the components resolve', () => {
    registerIcons({ sparkle: '<path d="M2 2h4" />' });
    const { container } = render(Button, {
      props: { leadingIcon: 'sparkle' },
      slots: { default: 'New' },
    });
    expect(container.querySelector('[data-part="icon"] svg path')?.getAttribute('d')).toBe(
      'M2 2h4',
    );
  });

  it.each([
    '<script>alert(1)</script>',
    '<path onload="alert(1)" />',
    '<a href="javascript:alert(1)"><path d="M0 0" /></a>',
    '<foreignObject><div /></foreignObject>',
  ])('rejects the unsafe body %j with UnsafeIconError', (body) => {
    expect(() => registerIcons({ bad: body })).toThrow(UnsafeIconError);
  });
});
