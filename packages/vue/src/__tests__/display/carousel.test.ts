import { afterAll, beforeAll, describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue';
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

  it('keeps a caller aria-label ahead of the title and the generic name', () => {
    render(Carousel, {
      props: { slides, title: 'Featured' },
      attrs: { 'aria-label': 'Homes for sale' },
    });
    expect(screen.getByRole('region').getAttribute('aria-label')).toBe('Homes for sale');
    const { container } = render(Carousel, {
      props: { slides, label: 'Picked', title: 'Featured' },
      attrs: { 'aria-label': 'Homes for sale' },
    });
    expect(container.querySelector('.apui-carousel')!.getAttribute('aria-label')).toBe('Picked');
  });

  it('puts the autoplay button first in the Tab order, before the slides and buttons', () => {
    const { container } = render(Carousel, {
      props: { slides, autoplay: true, title: 'Featured' },
    });
    const root = container.querySelector('.apui-carousel')!;
    expect(root.firstElementChild!.getAttribute('data-part')).toBe('autoplay-trigger');
    const focusable = Array.from(root.querySelectorAll('button, [tabindex="0"]'));
    expect(focusable[0]!.getAttribute('data-part')).toBe('autoplay-trigger');
  });

  it('keys slides by a unique id, so reordered slot state stays with its slide', async () => {
    const list = ref([
      { id: 'a', title: 'A' },
      { id: 'b', title: 'B' },
    ]);
    const Host = defineComponent({
      setup: () => () =>
        h(
          Carousel,
          { slides: list.value },
          {
            slide: ({ slide }: { slide: { title: string } }) =>
              h('input', { 'aria-label': slide.title }),
          },
        ),
    });
    const { container } = render(Host);
    const inputs = () => Array.from(container.querySelectorAll('input'));
    inputs()[0]!.value = 'typed in A';
    list.value = [list.value[1]!, list.value[0]!];
    await nextTick();
    expect(inputs()[1]!.getAttribute('aria-label')).toBe('A');
    expect(inputs()[1]!.value).toBe('typed in A');
    expect(inputs()[0]!.value).toBe('');
  });

  it('falls back to position keys without unique ids', async () => {
    const list = ref([
      { id: 'x', title: 'A' },
      { id: 'x', title: 'B' },
    ]);
    const Host = defineComponent({
      setup: () => () =>
        h(
          Carousel,
          { slides: list.value },
          {
            slide: ({ slide }: { slide: { title: string } }) =>
              h('input', { 'aria-label': slide.title }),
          },
        ),
    });
    const { container } = render(Host);
    container.querySelector('input')!.value = 'first';
    list.value = [list.value[1]!, list.value[0]!];
    await nextTick();
    expect(container.querySelector('input')!.value).toBe('first');
  });

  it('never matches a position key to an id when slides gain ids', async () => {
    const list = ref<{ id?: number; title: string }[]>([{ title: 'A' }, { title: 'B' }]);
    const Host = defineComponent({
      setup: () => () =>
        h(
          Carousel,
          { slides: list.value },
          {
            slide: ({ slide }: { slide: { title: string } }) =>
              h('input', { 'aria-label': slide.title }),
          },
        ),
    });
    const { container } = render(Host);
    const inputs = () => Array.from(container.querySelectorAll('input'));
    inputs()[0]!.value = 'typed in A';
    // B takes id 0 and A id 1: the numbers A and B had as positions.
    list.value = [
      { id: 0, title: 'B' },
      { id: 1, title: 'A' },
    ];
    await nextTick();
    expect(inputs()[0]!.getAttribute('aria-label')).toBe('B');
    expect(inputs()[0]!.value).toBe('');
  });

  /**
   * jsdom has no layout, so the machine would measure one position. Lay the
   * track out as 100px slides in a 100px view, enough for its snap points.
   */
  describe('navigation', () => {
    const restore: (() => void)[] = [];
    const partOf = (el: Element) =>
      el.getAttribute('data-scope') === 'carousel' ? el.getAttribute('data-part') : null;
    beforeAll(() => {
      const rect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function getBoundingClientRect(this: Element) {
        const part = partOf(this);
        const left =
          part === 'item' ? Number(this.getAttribute('data-index')) * 100 : part ? 0 : null;
        if (left === null || (part !== 'item' && part !== 'item-group')) return rect.call(this);
        return DOMRect.fromRect({ x: left, y: 0, width: 100, height: 80 });
      };
      restore.push(() => (Element.prototype.getBoundingClientRect = rect));
      const size = (name: 'offsetWidth' | 'scrollWidth', value: (el: HTMLElement) => number) => {
        const own = Object.getOwnPropertyDescriptor(HTMLElement.prototype, name);
        Object.defineProperty(HTMLElement.prototype, name, {
          configurable: true,
          get(this: HTMLElement) {
            return partOf(this) === 'item-group' ? value(this) : (own?.get?.call(this) ?? 0);
          },
        });
        restore.push(() =>
          own
            ? Object.defineProperty(HTMLElement.prototype, name, own)
            : delete (HTMLElement.prototype as unknown as Record<string, unknown>)[name],
        );
      };
      size('offsetWidth', () => 100);
      size('scrollWidth', (el) => el.children.length * 100);
    });
    afterAll(() => restore.splice(0).forEach((undo) => undo()));

    it('moves with next, previous and the dots, emitting index-change', async () => {
      const { container, emitted } = render(Carousel, { props: { slides } });
      const current = () =>
        all('indicator', container).findIndex((dot) => dot.getAttribute('aria-current') === 'true');
      const next = screen.getByRole('button', { name: 'Next slide' });
      const previous = screen.getByRole('button', { name: 'Previous slide' });
      expect(current()).toBe(0);
      await fireEvent.click(next);
      await nextTick();
      expect(current()).toBe(1);
      await fireEvent.click(all('indicator', container)[3]!);
      await nextTick();
      expect(current()).toBe(3);
      expect((next as HTMLButtonElement).disabled).toBe(true);
      await fireEvent.click(previous);
      await nextTick();
      expect(current()).toBe(2);
      expect(emitted()['index-change']).toEqual([[1], [3], [2]]);
    });

    it('wraps at the ends with loop', async () => {
      const { container, emitted } = render(Carousel, { props: { slides, loop: true } });
      await fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }));
      await nextTick();
      expect(all('indicator', container)[3]!.getAttribute('aria-current')).toBe('true');
      expect(emitted()['index-change']).toEqual([[3]]);
    });

    it('shows only what a bound index says, and reports the move it asks for', async () => {
      const { container, emitted, rerender } = render(Carousel, { props: { slides, index: 1 } });
      const current = () =>
        all('indicator', container).findIndex((dot) => dot.getAttribute('aria-current') === 'true');
      expect(current()).toBe(1);
      await fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
      await nextTick();
      expect(emitted()['index-change']).toEqual([[2]]);
      // The parent didn't take it, so the carousel stays where index says.
      expect(current()).toBe(1);
      await rerender({ index: 3 });
      await nextTick();
      expect(current()).toBe(3);
    });
  });
});
