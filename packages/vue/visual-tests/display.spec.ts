import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  avatar: 'src-components-display-avatar-avatar-story-vue',
  badge: 'src-components-display-badge-badge-story-vue',
  code: 'src-components-display-code-code-story-vue',
  diff: 'src-components-display-diff-diff-story-vue',
  progress: 'src-components-display-progress-progress-story-vue',
  sparkline: 'src-components-display-sparkline-sparkline-story-vue',
  stat: 'src-components-display-stat-stat-story-vue',
  timeline: 'src-components-display-timeline-timeline-story-vue',
};

test.describe('Display / Badge', () => {
  test('colors', async ({ page }) => {
    await testVariant(page, STORY.badge, 1, 'badge-colors');
  });

  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.badge, 2, 'badge-sizes');
  });
});

test.describe('Display / Avatar', () => {
  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.avatar, 1, 'avatar-sizes');
  });

  test('shapes', async ({ page }) => {
    await testVariant(page, STORY.avatar, 2, 'avatar-shapes');
  });
});

test.describe('Display / Progress', () => {
  test('colors', async ({ page }) => {
    await testVariant(page, STORY.progress, 1, 'progress-colors');
  });

  test('with value', async ({ page }) => {
    await testVariant(page, STORY.progress, 2, 'progress-value');
  });
});

test.describe('Display / Stat', () => {
  test('dashboard stats', async ({ page }) => {
    await testVariant(page, STORY.stat, 1, 'stat-dashboard');
  });
});

test.describe('Display / Timeline', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.timeline, 0, 'timeline-default');
  });

  test('compact', async ({ page }) => {
    await testVariant(page, STORY.timeline, 1, 'timeline-compact');
  });
});

test.describe('Display / Code', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.code, 0, 'code-default');
  });

  test('with line numbers', async ({ page }) => {
    await testVariant(page, STORY.code, 1, 'code-line-numbers');
  });

  test('inline', async ({ page }) => {
    await testVariant(page, STORY.code, 2, 'code-inline');
  });
});

test.describe('Display / Diff', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.diff, 0, 'diff-default');
  });

  test('inline mode', async ({ page }) => {
    await testVariant(page, STORY.diff, 1, 'diff-inline');
  });
});

// Carousel is excluded — auto-sliding content produces non-deterministic screenshots

test.describe('Display / Sparkline', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.sparkline, 0, 'sparkline-default');
  });

  test('types', async ({ page }) => {
    await testVariant(page, STORY.sparkline, 1, 'sparkline-types');
  });
});
