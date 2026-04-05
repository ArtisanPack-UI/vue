import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  alert: 'src-components-feedback-alert-alert-story-vue',
  emptyState: 'src-components-feedback-emptystate-emptystate-story-vue',
  error: 'src-components-feedback-error-error-story-vue',
  loading: 'src-components-feedback-loading-loading-story-vue',
  skeleton: 'src-components-feedback-skeleton-skeleton-story-vue',
  toast: 'src-components-feedback-toast-toast-story-vue',
};

test.describe('Feedback / Alert', () => {
  test('colors', async ({ page }) => {
    await testVariant(page, STORY.alert, 1, 'alert-colors');
  });

  test('dismissible', async ({ page }) => {
    await testVariant(page, STORY.alert, 2, 'alert-dismissible');
  });

  test('with icon slot', async ({ page }) => {
    await testVariant(page, STORY.alert, 3, 'alert-icon');
  });
});

test.describe('Feedback / Loading', () => {
  test('variants', async ({ page }) => {
    await testVariant(page, STORY.loading, 1, 'loading-variants');
  });

  test('colors', async ({ page }) => {
    await testVariant(page, STORY.loading, 2, 'loading-colors');
  });
});

test.describe('Feedback / Skeleton', () => {
  test('text skeleton', async ({ page }) => {
    await testVariant(page, STORY.skeleton, 1, 'skeleton-text');
  });

  test('card skeleton', async ({ page }) => {
    await testVariant(page, STORY.skeleton, 2, 'skeleton-card');
  });
});

test.describe('Feedback / EmptyState', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.emptyState, 0, 'emptystate-default');
  });

  test('with icon', async ({ page }) => {
    await testVariant(page, STORY.emptyState, 1, 'emptystate-icon');
  });
});

test.describe('Feedback / Error', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.error, 0, 'error-default');
  });

  test('retryable', async ({ page }) => {
    await testVariant(page, STORY.error, 1, 'error-retryable');
  });

  test('simple', async ({ page }) => {
    await testVariant(page, STORY.error, 2, 'error-simple');
  });
});

test.describe('Feedback / Toast', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.toast, 0, 'toast-default');
  });
});
