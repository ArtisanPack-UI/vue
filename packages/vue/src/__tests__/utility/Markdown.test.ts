import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { Markdown } from '../../components/utility';

describe('Markdown', () => {
  it('renders a prose container', () => {
    const { container } = render(Markdown, { props: { content: 'Hello' } });
    expect(container.querySelector('.prose')).toBeTruthy();
  });

  it('renders paragraphs', () => {
    const { container } = render(Markdown, { props: { content: 'Hello world' } });
    expect(container.querySelector('p')?.textContent).toBe('Hello world');
  });

  it('renders headings h1 through h6', () => {
    const content = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
    const { container } = render(Markdown, { props: { content } });
    expect(container.querySelector('h1')?.textContent).toBe('H1');
    expect(container.querySelector('h2')?.textContent).toBe('H2');
    expect(container.querySelector('h3')?.textContent).toBe('H3');
    expect(container.querySelector('h4')?.textContent).toBe('H4');
    expect(container.querySelector('h5')?.textContent).toBe('H5');
    expect(container.querySelector('h6')?.textContent).toBe('H6');
  });

  it('renders bold text', () => {
    const { container } = render(Markdown, { props: { content: '**bold**' } });
    expect(container.querySelector('strong')?.textContent).toBe('bold');
  });

  it('renders italic text', () => {
    const { container } = render(Markdown, { props: { content: '*italic*' } });
    expect(container.querySelector('em')?.textContent).toBe('italic');
  });

  it('renders links', () => {
    const { container } = render(Markdown, {
      props: { content: '[Click here](https://example.com)' },
    });
    const link = container.querySelector('a');
    expect(link?.textContent).toBe('Click here');
    expect(link?.getAttribute('href')).toBe('https://example.com');
  });

  it('renders images', () => {
    const { container } = render(Markdown, {
      props: { content: '![Alt text](https://example.com/img.png)' },
    });
    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('Alt text');
    expect(img?.getAttribute('src')).toBe('https://example.com/img.png');
  });

  it('renders unordered lists', () => {
    const content = '- Item 1\n- Item 2\n- Item 3';
    const { container } = render(Markdown, { props: { content } });
    const items = container.querySelectorAll('ul > li');
    expect(items.length).toBe(3);
    expect(items[0].textContent).toBe('Item 1');
  });

  it('renders ordered lists', () => {
    const content = '1. First\n2. Second\n3. Third';
    const { container } = render(Markdown, { props: { content } });
    const items = container.querySelectorAll('ol > li');
    expect(items.length).toBe(3);
    expect(items[0].textContent).toBe('First');
  });

  it('renders inline code', () => {
    const { container } = render(Markdown, {
      props: { content: 'Use `const` for constants' },
    });
    expect(container.querySelector('code')?.textContent).toBe('const');
  });

  it('renders fenced code blocks', () => {
    const content = '```js\nconst x = 1;\n```';
    const { container } = render(Markdown, { props: { content } });
    expect(container.querySelector('pre code')).toBeTruthy();
    expect(container.querySelector('pre code')?.textContent).toBe('const x = 1;');
  });

  it('escapes HTML in code blocks', () => {
    const content = '```\n<div>test</div>\n```';
    const { container } = render(Markdown, { props: { content } });
    const code = container.querySelector('pre code');
    expect(code?.textContent).toBe('<div>test</div>');
    // Should be escaped, not rendered as a real div
    expect(code?.innerHTML).toContain('&lt;div&gt;');
  });

  it('renders blockquotes', () => {
    const { container } = render(Markdown, {
      props: { content: '> This is a quote' },
    });
    expect(container.querySelector('blockquote')).toBeTruthy();
    expect(container.querySelector('blockquote p')?.textContent).toBe('This is a quote');
  });

  it('renders horizontal rules', () => {
    const { container } = render(Markdown, {
      props: { content: 'Above\n\n---\n\nBelow' },
    });
    expect(container.querySelector('hr')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(Markdown, {
      props: { content: 'Hello', className: 'custom-prose' },
    });
    expect(container.querySelector('.custom-prose')).toBeTruthy();
  });

  it('escapes HTML in inline text to prevent XSS', () => {
    const { container } = render(Markdown, {
      props: { content: '<script>alert("xss")</script>' },
    });
    // Should not render as a real script element
    expect(container.querySelector('script')).toBeFalsy();
    expect(container.querySelector('p')?.textContent).toContain('<script>');
  });

  it('sanitizes javascript: URLs in links', () => {
    const { container } = render(Markdown, {
      props: { content: '[Click](javascript:alert(1))' },
    });
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('#');
  });

  it('sanitizes javascript: URLs in images', () => {
    const { container } = render(Markdown, {
      props: { content: '![img](javascript:alert(1))' },
    });
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('#');
  });

  it('sanitizes data: URLs in links', () => {
    const { container } = render(Markdown, {
      props: { content: '[Click](data:text/html,<script>alert(1)</script>)' },
    });
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('#');
  });

  it('allows safe URLs', () => {
    const { container } = render(Markdown, {
      props: { content: '[Safe](https://example.com)' },
    });
    const link = container.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://example.com');
  });
});
