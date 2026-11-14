import { beforeAll, describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { nextTick } from 'vue';
import { ImageSlider } from '../../components/display';

const images = [
  { src: '/lake.jpg', alt: 'Lake view', caption: 'Lake view from 4A', description: '11th floor' },
  { src: '/ridge.jpg', alt: 'Sunrise over the ridge', caption: 'Sunrise' },
  { src: '/garden.jpg', alt: 'Courtyard garden' },
];

const q = (part: string, root: ParentNode = document.body) =>
  root.querySelector<HTMLElement>(`[data-scope="image-slider"][data-part="${part}"]`);
const all = (part: string, root: ParentNode = document.body) =>
  Array.from(
    root.querySelectorAll<HTMLElement>(`[data-scope="image-slider"][data-part="${part}"]`),
  );

const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

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
});

describe('ImageSlider', () => {
  it('renders the carousel region, slides with alt text, captions and the ratio', () => {
    const { container } = render(ImageSlider, { props: { images, aspectRatio: '16 / 9' } });
    const root = container.querySelector<HTMLElement>('.apui-image-slider')!;
    expect(root.getAttribute('data-part')).toBe('root');
    expect(root.getAttribute('role')).toBe('region');
    expect(root.getAttribute('aria-roledescription')).toBe('carousel');
    expect(root.getAttribute('aria-label')).toBe('Photos');
    expect(root.style.getPropertyValue('--apui-_image-slider-ratio')).toBe('16 / 9');
    const items = all('item', container);
    expect(items).toHaveLength(3);
    expect(items[1]!.getAttribute('aria-roledescription')).toBe('slide');
    expect(items[1]!.getAttribute('aria-label')).toBe('2 of 3');
    const imgs = all('image', container) as HTMLImageElement[];
    expect(imgs.map((img) => img.alt)).toEqual([
      'Lake view',
      'Sunrise over the ridge',
      'Courtyard garden',
    ]);
    expect(imgs[0]!.hasAttribute('loading')).toBe(false);
    expect(imgs[1]!.getAttribute('loading')).toBe('lazy');
    expect(all('caption', container)).toHaveLength(2);
    expect(q('title', container)!.textContent?.trim()).toBe('Lake view from 4A');
    expect(q('description', container)!.textContent?.trim()).toBe('11th floor');
    expect(q('progress-text', container)!.textContent).toBe('1 / 3');
    expect(all('indicator', container)[0]!.getAttribute('aria-current')).toBe('true');
    expect(q('thumbs', container)).toBeNull();
    expect(q('autoplay-trigger', container)).toBeNull();
  });

  it('takes its labels as props', () => {
    const { container } = render(ImageSlider, {
      props: {
        images,
        label: 'Fotos del edificio',
        previousLabel: 'Anterior',
        nextLabel: 'Siguiente',
        indicatorLabel: 'Foto {index}',
        slideLabel: '{index} de {count}',
        counterLabel: '{index} de {count}',
      },
    });
    expect(container.querySelector('.apui-image-slider')!.getAttribute('aria-label')).toBe(
      'Fotos del edificio',
    );
    expect(q('prev-trigger', container)!.getAttribute('aria-label')).toBe('Anterior');
    expect(q('next-trigger', container)!.getAttribute('aria-label')).toBe('Siguiente');
    expect(all('indicator', container)[2]!.getAttribute('aria-label')).toBe('Foto 3');
    expect(all('item', container)[0]!.getAttribute('aria-label')).toBe('1 de 3');
    expect(q('progress-text', container)!.textContent).toBe('1 de 3');
  });

  it('renders thumbnails and the autoplay button with their labels', () => {
    const { container } = render(ImageSlider, {
      props: { images, thumbnails: true, autoplay: true, playLabel: 'Play', pauseLabel: 'Pause' },
    });
    const thumbs = all('thumb', container);
    expect(thumbs).toHaveLength(3);
    expect(thumbs[0]!.getAttribute('aria-current')).toBe('true');
    expect(thumbs[1]!.querySelector('img')!.alt).toBe('Sunrise over the ridge');
    const autoplay = q('autoplay-trigger', container)!;
    expect(['Play', 'Pause']).toContain(autoplay.getAttribute('aria-label'));
    expect(autoplay.querySelector('svg')).not.toBeNull();
  });

  // Moving between slides needs layout (the machine measures snap points), which
  // jsdom lacks: index, index-change and the arrow keys in LTR and RTL are
  // covered in Chromium by the design system's behavior tests (useCarousel).
  it('passes clicks on the dots and thumbs to the machine without errors', async () => {
    const { container } = render(ImageSlider, { props: { images, thumbnails: true, index: 0 } });
    await fireEvent.click(all('indicator', container)[2]!);
    await fireEvent.click(all('thumb', container)[1]!);
    await settle();
    expect(container.querySelector('.apui-image-slider')).not.toBeNull();
  });
});
