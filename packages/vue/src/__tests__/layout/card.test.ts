import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { Card } from '../../components/layout';

describe('Card', () => {
  it('renders as a div by default', () => {
    const { container } = render(Card, { slots: { default: 'Content' } });
    const card = container.querySelector('.card');
    expect(card?.tagName).toBe('DIV');
  });

  it('renders as an anchor when link prop is provided', () => {
    const { container } = render(Card, {
      props: { link: '/dashboard' },
      slots: { default: 'Content' },
    });
    const card = container.querySelector('.card');
    expect(card?.tagName).toBe('A');
    expect(card?.getAttribute('href')).toBe('/dashboard');
  });

  it('opens in new tab when external and link are set', () => {
    const { container } = render(Card, {
      props: { link: '/ext', external: true },
      slots: { default: 'Content' },
    });
    const card = container.querySelector('.card');
    expect(card?.getAttribute('target')).toBe('_blank');
    expect(card?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders title as h2', () => {
    render(Card, { props: { title: 'Test Title' }, slots: { default: 'Content' } });
    expect(screen.getByText('Test Title').tagName).toBe('H2');
  });

  it('renders subtitle', () => {
    render(Card, { props: { title: 'Title', subtitle: 'Sub' }, slots: { default: 'Content' } });
    expect(screen.getByText('Sub')).toBeTruthy();
  });

  it('applies shadow by default', () => {
    const { container } = render(Card, { slots: { default: 'Content' } });
    expect(container.querySelector('.shadow-xl')).toBeTruthy();
  });

  it('removes shadow when noShadow is true', () => {
    const { container } = render(Card, {
      props: { noShadow: true },
      slots: { default: 'Content' },
    });
    expect(container.querySelector('.shadow-xl')).toBeFalsy();
  });

  it('applies bordered class', () => {
    const { container } = render(Card, {
      props: { bordered: true },
      slots: { default: 'Content' },
    });
    expect(container.querySelector('.card-border')).toBeTruthy();
  });

  it('applies compact class', () => {
    const { container } = render(Card, { props: { compact: true }, slots: { default: 'Content' } });
    expect(container.querySelector('.card-compact')).toBeTruthy();
  });

  it('applies glass class', () => {
    const { container } = render(Card, { props: { glass: true }, slots: { default: 'Content' } });
    expect(container.querySelector('.glass')).toBeTruthy();
  });

  it('applies card-side class for left figure position', () => {
    const { container } = render(Card, {
      props: { figurePosition: 'left' },
      slots: { default: 'Content', figure: '<img src="test.jpg" />' },
    });
    expect(container.querySelector('.card-side')).toBeTruthy();
  });

  it('renders footer slot in card-actions', () => {
    const { container } = render(Card, {
      slots: { default: 'Content', footer: '<button>Action</button>' },
    });
    expect(container.querySelector('.card-actions')).toBeTruthy();
    expect(screen.getByText('Action')).toBeTruthy();
  });

  it('renders default slot content', () => {
    render(Card, { slots: { default: 'Card body content' } });
    expect(screen.getByText('Card body content')).toBeTruthy();
  });
});
