import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Stack } from '../../components/layout';

describe('Stack', () => {
  it('renders the defaults as data attributes', () => {
    render(Stack, { slots: { default: '<div>A</div>' } });
    const root = document.querySelector('.apui-stack')!;
    expect(root.getAttribute('data-orientation')).toBe('vertical');
    expect(root.getAttribute('data-gap')).toBe('2');
    expect(root.getAttribute('data-align')).toBe('stretch');
    expect(root.getAttribute('data-justify')).toBe('start');
    expect(root.hasAttribute('data-wrap')).toBe(false);
  });

  it('renders a wrapping row', () => {
    render(Stack, { props: { orientation: 'horizontal', gap: 4, justify: 'between', wrap: true } });
    const root = document.querySelector('.apui-stack')!;
    expect(root.getAttribute('data-orientation')).toBe('horizontal');
    expect(root.getAttribute('data-gap')).toBe('4');
    expect(root.getAttribute('data-justify')).toBe('between');
    expect(root.hasAttribute('data-wrap')).toBe(true);
  });

  it('still reads the deprecated direction', () => {
    render(Stack, { props: { direction: 'horizontal' } });
    expect(document.querySelector('.apui-stack')!.getAttribute('data-orientation')).toBe(
      'horizontal',
    );
  });
});
