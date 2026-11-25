import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h, type Component } from 'vue';
import {
  Avatar,
  AvatarGroup,
  Carousel,
  Code,
  ImageGallery,
  ImageSlider,
} from '../../components/display';
import Diff from '../../components/display/Diff/Diff.vue';
import KpiCard from '../../components/display/KpiCard/KpiCard.vue';
import Sparkline from '../../components/display/Sparkline/Sparkline.vue';
import Stat from '../../components/display/Stat/Stat.vue';
import { TranslationProvider, type TranslationMessages } from '../../i18n/translator';

/** Renders `component` under a French TranslationProvider with `messages`. */
function renderInFrench(
  component: Component,
  props: Record<string, unknown>,
  messages: TranslationMessages,
) {
  return render(() =>
    h(TranslationProvider, { locale: 'fr', messages }, () => h(component, props)),
  );
}

const images = [
  { src: '/lobby.jpg', alt: 'The lobby' },
  { src: '/roof.jpg', alt: 'The roof terrace' },
];

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

describe('display translations', () => {
  it('translates the Avatar status words, a statusLabel winning', () => {
    renderInFrench(Avatar, { name: 'Olivia Rhye', status: 'online' }, { Online: 'En ligne' });
    expect(screen.getByRole('img', { name: 'Olivia Rhye (En ligne)' })).toBeTruthy();

    renderInFrench(
      Avatar,
      { name: 'Phoenix Baker', status: 'away', statusLabel: 'Busy' },
      { Away: 'Absent' },
    );
    expect(screen.getByRole('img', { name: 'Phoenix Baker (Busy)' })).toBeTruthy();
  });

  it('translates the AvatarGroup +N name with plural forms, a moreLabel winning', () => {
    const avatars = [{ name: 'A B' }, { name: 'C D' }, { name: 'E F' }];
    const messages = { '{count} more': '{count} autre|{count} autres' };
    renderInFrench(AvatarGroup, { avatars, max: 1 }, messages);
    expect(screen.getByRole('img', { name: '2 autres' })).toBeTruthy();

    renderInFrench(AvatarGroup, { avatars, max: 2 }, messages);
    expect(screen.getByRole('img', { name: '1 autre' })).toBeTruthy();

    renderInFrench(AvatarGroup, { avatars, max: 1, moreLabel: '+{count} people' }, messages);
    expect(screen.getByRole('img', { name: '+2 people' })).toBeTruthy();
  });

  it('translates the Carousel names, an explicit label winning', () => {
    const slides = [{ title: 'One' }, { title: 'Two' }];
    const messages = { Carousel: 'Carrousel', 'Previous slide': 'Diapositive précédente' };
    const { container } = renderInFrench(Carousel, { slides }, messages);
    expect(container.querySelector('.apui-carousel')!.getAttribute('aria-label')).toBe('Carrousel');
    expect(container.querySelector('[aria-label="Diapositive précédente"]')).not.toBeNull();

    const own = renderInFrench(Carousel, { slides, previousLabel: 'Back' }, messages);
    expect(own.container.querySelector('[aria-label="Back"]')).not.toBeNull();
    expect(own.container.querySelector('[aria-label="Diapositive précédente"]')).toBeNull();
  });

  it('translates the Code copy button and region name, a copyLabel winning', () => {
    const messages = { Copy: 'Copier', Code: 'Code source' };
    const { container } = renderInFrench(Code, { code: 'const a = 1;' }, messages);
    expect(screen.getByRole('region', { name: 'Code source' })).toBeTruthy();
    expect(container.querySelector('button')!.textContent).toContain('Copier');

    const own = renderInFrench(Code, { code: 'a', copyLabel: 'Duplicate' }, messages);
    expect(own.container.querySelector('button')!.textContent).toContain('Duplicate');
  });

  it('translates the Diff counts and empty text, an emptyLabel winning', () => {
    const messages = {
      '{additions} additions, {deletions} deletions':
        '{additions} ajouts, {deletions} suppressions',
      'No changes': 'Aucun changement',
    };
    const changed = renderInFrench(Diff, { oldContent: 'a\n', newContent: 'b\nc\n' }, messages);
    expect(changed.container.querySelector('.apui-sr-only')!.textContent).toBe(
      '2 ajouts, 1 suppressions',
    );

    const same = renderInFrench(Diff, { oldContent: 'a\n', newContent: 'a\n' }, messages);
    expect(same.container.textContent).toContain('Aucun changement');

    const own = renderInFrench(
      Diff,
      { oldContent: 'a\n', newContent: 'a\n', emptyLabel: 'Identical' },
      messages,
    );
    expect(own.container.textContent).toContain('Identical');
  });

  it('translates the ImageGallery lightbox names, a closeLabel winning', () => {
    const messages = { Close: 'Fermer', Photos: 'Clichés' };
    const { container } = renderInFrench(ImageGallery, { images, portal: false }, messages);
    expect(container.querySelector('[aria-label="Fermer"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Clichés"]')).not.toBeNull();

    const own = renderInFrench(
      ImageGallery,
      { images, portal: false, closeLabel: 'Dismiss' },
      messages,
    );
    expect(own.container.querySelector('[aria-label="Dismiss"]')).not.toBeNull();
    expect(own.container.querySelector('[aria-label="Fermer"]')).toBeNull();
  });

  it('translates the ImageSlider names, a label winning', () => {
    const messages = { Photos: 'Clichés', 'Next photo': 'Photo suivante' };
    const { container } = renderInFrench(ImageSlider, { images }, messages);
    expect(container.querySelector('.apui-image-slider')!.getAttribute('aria-label')).toBe(
      'Clichés',
    );
    expect(container.querySelector('[aria-label="Photo suivante"]')).not.toBeNull();

    const own = renderInFrench(ImageSlider, { images, label: 'Gallery' }, messages);
    expect(own.container.querySelector('.apui-image-slider')!.getAttribute('aria-label')).toBe(
      'Gallery',
    );
  });

  it('translates the Stat trend word, an upLabel winning', () => {
    const messages = { Increase: 'Hausse' };
    const { container } = renderInFrench(Stat, { value: '10', change: 5 }, messages);
    expect(container.querySelector('.apui-sr-only')!.textContent).toContain('Hausse');

    const own = renderInFrench(Stat, { value: '10', change: 5, upLabel: 'Up' }, messages);
    expect(own.container.querySelector('.apui-sr-only')!.textContent).toContain('Up');
  });

  it('translates the Sparkline name, a label winning', () => {
    const messages = { 'Trend from {first} to {latest}': 'Tendance de {first} à {latest}' };
    const { container } = renderInFrench(Sparkline, { data: [1, 2, 3] }, messages);
    expect(container.querySelector('svg')!.getAttribute('aria-label')).toBe('Tendance de 1 à 3');

    const own = renderInFrench(Sparkline, { data: [1, 2, 3], label: 'Up to {latest}' }, messages);
    expect(own.container.querySelector('svg')!.getAttribute('aria-label')).toBe('Up to 3');
  });

  it('translates the KpiCard trend, sparkline and goal, a targetLabel winning', () => {
    const messages = {
      Increase: 'Hausse',
      'Trend from {first} to {latest}': 'Tendance de {first} à {latest}',
      '{percent}% of goal': '{percent} % de l’objectif',
    };
    const props = {
      stat: { label: 'Profit', value: '10', change: 5 },
      sparkline: [2, 4, 8],
      target: { value: 50, max: 100 },
    };
    const { container } = renderInFrench(KpiCard, props, messages);
    expect(container.querySelector('[data-part="delta"]')!.textContent).toContain('Hausse');
    expect(container.querySelector('svg.apui-sparkline')!.getAttribute('aria-label')).toBe(
      'Tendance de 2 à 8',
    );
    expect(container.textContent).toContain('50 % de l’objectif');

    const own = renderInFrench(KpiCard, { ...props, targetLabel: '{percent}% done' }, messages);
    expect(own.container.textContent).toContain('50% done');
  });
});
