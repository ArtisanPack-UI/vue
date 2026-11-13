import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Text } from '../../components/layout';

describe('Text', () => {
  it('renders a paragraph with the default size, tone and weight', () => {
    render(Text, { slots: { default: 'Body copy' } });
    const text = screen.getByText('Body copy');
    expect(text.tagName).toBe('P');
    expect(text.classList.contains('apui-text')).toBe(true);
    expect(text.getAttribute('data-size')).toBe('md');
    expect(text.getAttribute('data-tone')).toBe('default');
    expect(text.getAttribute('data-weight')).toBe('regular');
  });

  it('renders as a span with size, tone and weight', () => {
    render(Text, {
      props: { as: 'span', size: 'lead', tone: 'error', weight: 'semibold' },
      slots: { default: 'Failed' },
    });
    const text = screen.getByText('Failed');
    expect(text.tagName).toBe('SPAN');
    expect(text.getAttribute('data-size')).toBe('lead');
    expect(text.getAttribute('data-tone')).toBe('error');
  });

  it('copies plain text to title when it is cut, keeping an explicit title', () => {
    render(Text, { props: { truncate: true }, slots: { default: 'ARK Genomic & Co' } });
    const text = screen.getByText('ARK Genomic & Co');
    expect(text.getAttribute('title')).toBe('ARK Genomic & Co');
    expect(text.getAttribute('data-truncate')).toBe('');
    render(Text, {
      props: { truncate: true },
      attrs: { title: 'Full' },
      slots: { default: 'Short' },
    });
    expect(screen.getByText('Short').getAttribute('title')).toBe('Full');
  });

  it('clamps to a number of lines', () => {
    render(Text, { props: { clamp: 3 }, slots: { default: 'Long' } });
    const text = screen.getByText('Long');
    expect(text.getAttribute('data-clamp')).toBe('3');
    expect(text.style.getPropertyValue('--apui-text-clamp')).toBe('3');
  });
});
