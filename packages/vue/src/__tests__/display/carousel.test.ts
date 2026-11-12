import { beforeAll, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { createSSRApp, h, nextTick } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { Carousel } from '../../components/display';

const slides = [1, 2, 3, 4].map((i) => ({
  image: `/photos/${i}.jpg`,
  alt: `Photo ${i}`,
  title: `Property ${i}`,
  description: `City ${i}`,
}));

const q = (part: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="carousel"][data-part="${part}"]`);
const all = (part: string, root: ParentNode = document.body) =>
  Array.from(root.querySelectorAll<HTMLElement>(`[data-scope="carousel"][data-part="${part}"]`));

/** jsdom has no layout observers; the carousel machine needs both to exist. */
beforeAll(() => {
  class Observer {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  const win = window as unknown as Record<string, unknown>;
  win.IntersectionObserver ??= Observer;
  win.ResizeObserver ??= Observer;
  Element.prototype.scrollTo = function scrollTo() {};
});

describe('Carousel', () => {
  it('renders the carousel region with a Card per slide', () => {
    const { container } = render(Carousel, { props: { slides } });
    const root = container.querySelector<HTMLElement>('.apui-carousel')!;
    expect(root.getAttribute('data-part')).toBe('root');
    expect(root.getAttribute('role')).toBe('region');
    expect(root.getAttribute('aria-roledescription')).toBe('carousel');
    expect(root.getAttribute('aria-label')).toBe('Carousel');
    expect(root.style.getPropertyValue('--slides-per-page')).toBe('1');
    expect(root.style.getPropertyValue('--slide-spacing')).toBe('12px');
    const items = all('item', container);
    expect(items).toHaveLength(4);
    expect(items[1]!.getAttribute('aria-label')).toBe('2 of 4');
    expect(items[0]!.querySelector('.apui-card img')!.getAttribute('alt')).toBe('Photo 1');
    expect(items[1]!.textContent).toContain('Property 2');
    expect(q('item-group', container)!.getAttribute('tabindex')).toBe('0');
    expect(all('indicator', container)).toHaveLength(4);
    expect(q('autoplay-trigger', container)).toBeNull();
  });

  it('peeks with perView above one and has one dot per start position', () => {
    const { container } = render(Carousel, { props: { slides, perView: 3 } });
    expect(
      container
        .querySelector<HTMLElement>('.apui-carousel')!
        .style.getPropertyValue('--slides-per-page'),
    ).toBe('3.15');
    expect(all('indicator', container)).toHaveLength(2);
    expect(all('indicator', container)[1]!.getAttribute('aria-label')).toBe('Go to slide 2');
  });

  it('server-renders the dots and triggers the mounted carousel measures to', async () => {
    // Five slides, three per view: three positions, the last at the end of the track.
    const five = [...slides, { ...slides[0]!, alt: 'Photo 5' }];
    const host = document.createElement('div');
    host.innerHTML = await renderToString(
      createSSRApp({ render: () => h(Carousel, { slides: five, perView: 3, index: 2 }) }),
    );
    const dots = all('indicator', host);
    expect(dots).toHaveLength(3);
    expect(dots.map((dot) => dot.getAttribute('aria-current'))).toEqual([null, null, 'true']);
    expect(q('next-trigger', host)!.hasAttribute('disabled')).toBe(true);
    expect(q('prev-trigger', host)!.hasAttribute('disabled')).toBe(false);
  });

  it('puts a title and outline buttons in the header', () => {
    render(Carousel, { props: { slides, title: 'Featured properties', headingLevel: 2 } });
    const region = screen.getByRole('region', { name: 'Featured properties' });
    const header = q('header', region)!;
    expect(header.querySelector('h2[data-part="title"]')!.textContent?.trim()).toBe(
      'Featured properties',
    );
    const previous = screen.getByRole('button', { name: 'Previous slide' });
    expect(header.contains(previous)).toBe(true);
    expect(previous.getAttribute('data-variant')).toBe('outline');
    expect((previous as HTMLButtonElement).disabled).toBe(true);
  });

  it('overlays soft buttons on the viewport without a title', () => {
    render(Carousel, { props: { slides, label: 'Notes', loop: true } });
    const next = screen.getByRole('button', { name: 'Next slide' });
    expect(q('viewport')!.contains(next)).toBe(true);
    expect(next.getAttribute('data-variant')).toBe('soft');
    expect(next.querySelector('[data-mirror]')).not.toBeNull();
    expect(
      (screen.getByRole('button', { name: 'Previous slide' }) as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  it('renders the slide slot, and the 2.x src and caption keys', () => {
    const { container } = render(Carousel, {
      props: { slides: [{ text: 'One' }, { text: 'Two' }] },
      slots: {
        slide: ({ slide, index }: { slide: { text: string }; index: number }) =>
          h('q', { 'data-i': index }, slide.text),
      },
    });
    expect(container.querySelectorAll('[data-part="item"] > q')).toHaveLength(2);
    expect(container.querySelector('q[data-i="1"]')!.textContent).toBe('Two');
    const old = render(Carousel, {
      props: { slides: [{ src: '/a.jpg', alt: 'A', caption: 'Old' }] },
    });
    expect(old.container.querySelector('.apui-card img')!.getAttribute('src')).toBe('/a.jpg');
    expect(old.container.textContent).toContain('Old');
  });

  // The position shown needs layout (the machine snaps to measured slides),
  // which jsdom lacks: the behavior package's Chromium tests cover it.
  it('shows a pause button with autoplay', async () => {
    render(Carousel, { props: { slides, autoplay: true } });
    await nextTick();
    expect(
      screen.getByRole('button', { name: 'Stop slide rotation' }).getAttribute('data-part'),
    ).toBe('autoplay-trigger');
    expect(q('item-group')!.getAttribute('aria-live')).toBe('off');
  });
});
