import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  avatar: 'src-components-display-avatar-avatar-story-vue',
  badge: 'src-components-display-badge-badge-story-vue',
  carousel: 'src-components-display-carousel-carousel-story-vue',
  code: 'src-components-display-code-code-story-vue',
  diff: 'src-components-display-diff-diff-story-vue',
  imageGallery: 'src-components-display-imagegallery-imagegallery-story-vue',
  imageSlider: 'src-components-display-imageslider-imageslider-story-vue',
  kpiCard: 'src-components-display-kpicard-kpicard-story-vue',
  progress: 'src-components-display-progress-progress-story-vue',
  progressRadial: 'src-components-display-progressradial-progressradial-story-vue',
  sparkline: 'src-components-display-sparkline-sparkline-story-vue',
  stat: 'src-components-display-stat-stat-story-vue',
  timeline: 'src-components-display-timeline-timeline-story-vue',
};

test.describe('Display / Code', () => {
  test('numbered, highlighted line', async ({ page }) => {
    await testVariant(page, STORY.code, 0, 'code-numbered');
  });

  test('plain block', async ({ page }) => {
    await testVariant(page, STORY.code, 1, 'code-plain');
  });

  test('inline', async ({ page }) => {
    await testVariant(page, STORY.code, 2, 'code-inline');
  });
});

// Carousel's autoplay variant is left out: rotating content isn't deterministic.
test.describe('Display / Carousel', () => {
  test('several per view, with a header', async ({ page }) => {
    await testVariant(page, STORY.carousel, 0, 'carousel-several-per-view');
  });

  test('custom slides with overlay buttons', async ({ page }) => {
    await testVariant(page, STORY.carousel, 1, 'carousel-custom-slides');
  });
});

test.describe('Display / Avatar', () => {
  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.avatar, 0, 'avatar-sizes');
  });

  test('status, shape and fallback', async ({ page }) => {
    await testVariant(page, STORY.avatar, 1, 'avatar-status-shape-and-fallback');
  });

  test('group', async ({ page }) => {
    await testVariant(page, STORY.avatar, 2, 'avatar-group');
  });
});

test.describe('Display / Badge', () => {
  test('variants and colors', async ({ page }) => {
    await testVariant(page, STORY.badge, 0, 'badge-variants-and-colors');
  });

  test('dot, icon and size', async ({ page }) => {
    await testVariant(page, STORY.badge, 1, 'badge-dot-icon-and-size');
  });
});

test.describe('Display / Progress', () => {
  test('labeled', async ({ page }) => {
    await testVariant(page, STORY.progress, 0, 'progress-labeled');
  });

  test('indeterminate and segmented', async ({ page }) => {
    await testVariant(page, STORY.progress, 1, 'progress-indeterminate-and-segmented');
  });
});

test.describe('Display / ProgressRadial', () => {
  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.progressRadial, 0, 'progress-radial-sizes');
  });

  test('colors and indeterminate', async ({ page }) => {
    await testVariant(page, STORY.progressRadial, 1, 'progress-radial-colors-and-indeterminate');
  });
});

test.describe('Display / Stat', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.stat, 0, 'stat-default');
  });

  test('row, one emphasized', async ({ page }) => {
    await testVariant(page, STORY.stat, 1, 'stat-row-one-emphasized');
  });

  test('sizes and bare', async ({ page }) => {
    await testVariant(page, STORY.stat, 2, 'stat-sizes-and-bare');
  });
});

test.describe('Display / KpiCard', () => {
  test('trend and target', async ({ page }) => {
    await testVariant(page, STORY.kpiCard, 0, 'kpi-card-trend-and-target');
  });

  test('with a period control', async ({ page }) => {
    await testVariant(page, STORY.kpiCard, 1, 'kpi-card-with-a-period-control');
  });
});

test.describe('Display / Timeline', () => {
  test('activity feed', async ({ page }) => {
    await testVariant(page, STORY.timeline, 0, 'timeline-activity-feed');
  });

  test('dots, from data', async ({ page }) => {
    await testVariant(page, STORY.timeline, 1, 'timeline-dots-from-data');
  });
});

test.describe('Display / Diff', () => {
  test('unified', async ({ page }) => {
    await testVariant(page, STORY.diff, 0, 'diff-unified');
  });

  test('split', async ({ page }) => {
    await testVariant(page, STORY.diff, 1, 'diff-split');
  });

  test('without word marks', async ({ page }) => {
    await testVariant(page, STORY.diff, 2, 'diff-without-word-marks');
  });
});

test.describe('Display / Sparkline', () => {
  test('line, area, bar and large', async ({ page }) => {
    await testVariant(page, STORY.sparkline, 0, 'sparkline-line-area-bar-and-large');
  });

  test('crossing zero', async ({ page }) => {
    await testVariant(page, STORY.sparkline, 1, 'sparkline-crossing-zero');
  });
});

test.describe('Display / ImageGallery', () => {
  test('grid', async ({ page }) => {
    await testVariant(page, STORY.imageGallery, 0, 'image-gallery-grid');
  });

  test('featured, lightbox open', async ({ page }) => {
    await testVariant(page, STORY.imageGallery, 1, 'image-gallery-featured-lightbox-open');
  });
});

test.describe('Display / ImageSlider', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.imageSlider, 0, 'image-slider-default');
  });
});
