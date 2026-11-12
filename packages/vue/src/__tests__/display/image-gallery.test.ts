import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { ImageGallery } from '../../components/display';

const images = [
  { src: '/lobby.jpg', alt: 'The lobby', caption: 'Lobby' },
  { src: '/roof.jpg', alt: 'The roof terrace', caption: 'Roof' },
  { src: '/street.jpg', alt: 'The street at night' },
];

const q = <T extends HTMLElement = HTMLElement>(part: string, root: ParentNode = document.body) =>
  root.querySelector<T>(`[data-scope="image-gallery"][data-part="${part}"]`);
const all = (part: string, root: ParentNode = document.body) =>
  Array.from(
    root.querySelectorAll<HTMLElement>(`[data-scope="image-gallery"][data-part="${part}"]`),
  );
const panel = () => document.body.querySelector<HTMLElement>('.apui-lightbox')!;
const stageImage = () => q<HTMLImageElement>('stage')!.querySelector('img')!;

const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('ImageGallery', () => {
  it('renders the grid with alt text, captions and the column count', () => {
    const { container } = render(ImageGallery, { props: { images, columns: 3 } });
    const root = container.querySelector<HTMLElement>('.apui-image-gallery')!;
    expect(root.getAttribute('data-part')).toBe('root');
    expect(root.style.getPropertyValue('--apui-_image-gallery-columns')).toBe('3');
    expect(root.hasAttribute('data-featured')).toBe(false);
    const items = all('item', container);
    expect(items).toHaveLength(3);
    expect(items[0]!.tagName).toBe('FIGURE');
    const imgs = all('image', container) as HTMLImageElement[];
    expect(imgs.map((img) => img.alt)).toEqual([
      'The lobby',
      'The roof terrace',
      'The street at night',
    ]);
    expect(imgs[0]!.getAttribute('loading')).toBe('lazy');
    expect(all('caption', container).map((el) => el.textContent?.trim())).toEqual([
      'Lobby',
      'Roof',
    ]);
    expect(all('trigger', container)[0]!.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('marks featured, and renders plain figures without the lightbox', () => {
    const { container } = render(ImageGallery, {
      props: { images, featured: true, lightbox: false },
    });
    expect(container.querySelector('.apui-image-gallery')!.hasAttribute('data-featured')).toBe(
      true,
    );
    expect(all('trigger', container)).toHaveLength(0);
    expect(document.body.querySelector('.apui-lightbox')).toBeNull();
  });

  it('opens on the clicked image and steps with the arrow keys, Home and End', async () => {
    const { container, emitted } = render(ImageGallery, { props: { images, portal: false } });
    expect(panel().hidden).toBe(true);
    await fireEvent.click(all('trigger', container)[1]!);
    await settle();
    expect(panel().hidden).toBe(false);
    expect(panel().getAttribute('role')).toBe('dialog');
    expect(q('title')!.textContent).toBe('2 / 3 · Roof');
    expect(stageImage().alt).toBe('The roof terrace');
    expect(all('thumb').map((el) => el.getAttribute('aria-current'))).toEqual([null, 'true', null]);
    await fireEvent.keyDown(panel(), { key: 'ArrowRight' });
    expect(stageImage().alt).toBe('The street at night');
    expect(q('title')!.textContent).toBe('3 / 3');
    await fireEvent.keyDown(panel(), { key: 'ArrowRight' });
    expect(stageImage().alt).toBe('The lobby');
    await fireEvent.keyDown(panel(), { key: 'End' });
    expect(stageImage().alt).toBe('The street at night');
    await fireEvent.keyDown(panel(), { key: 'Home' });
    expect(stageImage().alt).toBe('The lobby');
    expect(emitted()['update:open']).toEqual([[true]]);
    expect(emitted()['index-change']).toEqual([[1], [2], [0], [2], [0]]);
  });

  it('follows the text direction in RTL: ArrowLeft shows the next image', async () => {
    const { container } = render(ImageGallery, { props: { images, portal: false } });
    await fireEvent.click(all('trigger', container)[0]!);
    await settle();
    // jsdom doesn't inherit `direction`, so set it where the keys are read.
    panel().style.direction = 'rtl';
    await fireEvent.keyDown(panel(), { key: 'ArrowLeft' });
    expect(stageImage().alt).toBe('The roof terrace');
    await fireEvent.keyDown(panel(), { key: 'ArrowRight' });
    expect(stageImage().alt).toBe('The lobby');
  });

  it('moves with the previous and next buttons and the thumbs, and closes', async () => {
    const { container, emitted } = render(ImageGallery, { props: { images, portal: false } });
    await fireEvent.click(all('trigger', container)[0]!);
    await settle();
    await fireEvent.click(q('prev-trigger')!);
    expect(stageImage().alt).toBe('The street at night');
    await fireEvent.click(q('next-trigger')!);
    expect(stageImage().alt).toBe('The lobby');
    await fireEvent.click(all('thumb')[1]!);
    expect(stageImage().alt).toBe('The roof terrace');
    await fireEvent.click(q('close-trigger')!);
    await settle();
    expect(panel().hidden).toBe(true);
    expect(emitted()['update:open']).toEqual([[true], [false]]);
  });

  it('takes its labels as props', async () => {
    render(ImageGallery, {
      props: {
        images,
        portal: false,
        open: true,
        downloadable: true,
        closeLabel: 'Cerrar',
        previousLabel: 'Foto anterior',
        nextLabel: 'Foto siguiente',
        downloadLabel: 'Descargar',
        counterLabel: 'Foto {index} de {count}',
        thumbsLabel: 'Fotos',
      },
    });
    await settle();
    expect(q('close-trigger')!.getAttribute('aria-label')).toBe('Cerrar');
    expect(q('prev-trigger')!.getAttribute('aria-label')).toBe('Foto anterior');
    expect(q('next-trigger')!.getAttribute('aria-label')).toBe('Foto siguiente');
    expect(q('download')!.getAttribute('aria-label')).toBe('Descargar');
    expect(q('download')!.getAttribute('href')).toBe('/lobby.jpg');
    expect(q('thumbs')!.getAttribute('aria-label')).toBe('Fotos');
    expect(q('title')!.textContent).toBe('Foto 1 de 3 · Lobby');
  });

  it('shows what a bound index says, and reports changes', async () => {
    const index = ref(2);
    const changes: number[] = [];
    const Host = defineComponent(
      () => () =>
        h(ImageGallery, {
          images,
          portal: false,
          open: true,
          index: index.value,
          onIndexChange: (value: number) => changes.push(value),
        }),
    );
    render(Host);
    await settle();
    expect(stageImage().alt).toBe('The street at night');
    await fireEvent.keyDown(panel(), { key: 'ArrowRight' });
    // Controlled: reported, but the shown image follows the prop.
    expect(changes).toEqual([0]);
    expect(stageImage().alt).toBe('The street at night');
    index.value = 1;
    await settle();
    expect(stageImage().alt).toBe('The roof terrace');
  });
});
