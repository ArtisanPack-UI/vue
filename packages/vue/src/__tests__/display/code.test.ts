import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Code } from '../../components/display';

describe('Code', () => {
  it('renders code content in block mode', () => {
    const { container } = render(Code, { props: { code: 'const x = 1;' } });
    expect(container.querySelector('.mockup-code')).toBeTruthy();
    expect(screen.getByText('const x = 1;')).toBeTruthy();
  });

  it('renders inline code when inline is true', () => {
    const { container } = render(Code, {
      props: { code: 'const x = 1;', inline: true },
    });
    expect(container.querySelector('code')).toBeTruthy();
    expect(container.querySelector('.mockup-code')).toBeFalsy();
  });

  it('shows language label', () => {
    render(Code, { props: { code: 'const x = 1;', language: 'javascript' } });
    expect(screen.getByText('javascript')).toBeTruthy();
  });

  it('shows copy button when copyable is true', () => {
    render(Code, { props: { code: 'const x = 1;', copyable: true } });
    expect(screen.getByText('Copy')).toBeTruthy();
  });

  it('does not show copy button by default', () => {
    render(Code, { props: { code: 'const x = 1;' } });
    expect(screen.queryByText('Copy')).toBeFalsy();
  });

  it('splits multi-line code into separate pre elements', () => {
    const { container } = render(Code, {
      props: { code: 'line1\nline2\nline3' },
    });
    const pres = container.querySelectorAll('pre');
    expect(pres.length).toBe(3);
  });

  it('adds data-prefix for line numbers', () => {
    const { container } = render(Code, {
      props: { code: 'line1\nline2', lineNumbers: true },
    });
    const firstPre = container.querySelector('pre');
    expect(firstPre?.getAttribute('data-prefix')).toBe('1');
  });

  it('has copy button with correct aria-label', () => {
    const { container } = render(Code, {
      props: { code: 'test', copyable: true },
    });
    expect(container.querySelector('[aria-label="Copy code"]')).toBeTruthy();
  });
});
