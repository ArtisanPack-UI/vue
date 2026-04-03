import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { Carousel } from '../../components/display';

const slides = [
  { id: 1, src: '/img1.jpg', alt: 'Image 1', caption: 'First slide' },
  { id: 2, src: '/img2.jpg', alt: 'Image 2', caption: 'Second slide' },
  { id: 3, src: '/img3.jpg', alt: 'Image 3', caption: 'Third slide' },
];

describe('Carousel', () => {
  it('renders first slide by default', () => {
    render(Carousel, { props: { slides } });
    expect(screen.getByText('First slide')).toBeTruthy();
  });

  it('shows navigation arrows', () => {
    const { container } = render(Carousel, { props: { slides } });
    expect(container.querySelector('[aria-label="Previous slide"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Next slide"]')).toBeTruthy();
  });

  it('hides arrows when showArrows is false', () => {
    const { container } = render(Carousel, {
      props: { slides, showArrows: false },
    });
    expect(container.querySelector('[aria-label="Previous slide"]')).toBeFalsy();
  });

  it('shows dot indicators', () => {
    const { container } = render(Carousel, { props: { slides } });
    const dots = container.querySelectorAll('[aria-label^="Go to slide"]');
    expect(dots.length).toBe(3);
  });

  it('navigates to next slide on arrow click', async () => {
    const { container, emitted } = render(Carousel, { props: { slides } });
    const nextBtn = container.querySelector('[aria-label="Next slide"]')!;
    await fireEvent.click(nextBtn);
    expect(emitted()['update:modelValue']).toBeTruthy();
    expect(emitted()['update:modelValue'][0]).toEqual([1]);
  });

  it('navigates to previous slide with wrap-around', async () => {
    const { container, emitted } = render(Carousel, {
      props: { slides, modelValue: 0 },
    });
    const prevBtn = container.querySelector('[aria-label="Previous slide"]')!;
    await fireEvent.click(prevBtn);
    expect(emitted()['update:modelValue'][0]).toEqual([2]);
  });

  it('has correct ARIA attributes', () => {
    const { container } = render(Carousel, { props: { slides } });
    expect(container.querySelector('[role="region"]')).toBeTruthy();
    expect(container.querySelector('[aria-roledescription="carousel"]')).toBeTruthy();
  });

  it('marks inactive slides as aria-hidden', () => {
    const { container } = render(Carousel, { props: { slides } });
    const groups = container.querySelectorAll('[role="group"]');
    expect(groups[0]?.getAttribute('aria-hidden')).toBe('false');
    expect(groups[1]?.getAttribute('aria-hidden')).toBe('true');
  });

  it('hides indicators when showIndicators is false', () => {
    const { container } = render(Carousel, {
      props: { slides, showIndicators: false },
    });
    expect(container.querySelector('[aria-label^="Go to slide"]')).toBeFalsy();
  });
});
