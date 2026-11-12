import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Skeleton } from '../../components/feedback';

describe('Skeleton', () => {
  it('is a hidden block by default', () => {
    const { container } = render(Skeleton);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('SPAN');
    expect(root.className).toBe('apui-skeleton');
    expect(root.getAttribute('data-shape')).toBe('block');
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.hasAttribute('style')).toBe(false);
  });

  it('writes width and height, numbers as px', () => {
    const { container } = render(Skeleton, {
      props: { shape: 'circle', width: 40, height: '2rem' },
      attrs: { class: 'extra' },
    });
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-shape')).toBe('circle');
    expect(root.style.width).toBe('40px');
    expect(root.style.height).toBe('2rem');
    expect(root.className).toBe('apui-skeleton extra');
  });
});
