import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  alert: 'src-components-feedback-alert-alert-story-vue',
  emptyState: 'src-components-feedback-emptystate-emptystate-story-vue',
  error: 'src-components-feedback-error-error-story-vue',
  errorState: 'src-components-feedback-errorstate-errorstate-story-vue',
  loading: 'src-components-feedback-loading-loading-story-vue',
  skeleton: 'src-components-feedback-skeleton-skeleton-story-vue',
  toast: 'src-components-feedback-toast-toast-story-vue',
  toastProvider: 'src-components-feedback-toastprovider-toastprovider-story-vue',
};

test.describe('Feedback / Alert', () => {
  test('colors', async ({ page }) => {
    await testVariant(page, STORY.alert, 0, 'alert-colors');
  });

  test('variants and dismiss', async ({ page }) => {
    await testVariant(page, STORY.alert, 1, 'alert-variants');
  });
});

test.describe('Feedback / Loading', () => {
  test('spinner sizes', async ({ page }) => {
    await testVariant(page, STORY.loading, 0, 'loading-sizes');
  });

  test('dots and label', async ({ page }) => {
    await testVariant(page, STORY.loading, 1, 'loading-dots');
  });

  test('overlay', async ({ page }) => {
    await testVariant(page, STORY.loading, 2, 'loading-overlay');
  });
});

test.describe('Feedback / Skeleton', () => {
  test('list', async ({ page }) => {
    await testVariant(page, STORY.skeleton, 0, 'skeleton-list');
  });

  test('block', async ({ page }) => {
    await testVariant(page, STORY.skeleton, 1, 'skeleton-block');
  });
});

test.describe('Feedback / EmptyState', () => {
  test('first use', async ({ page }) => {
    await testVariant(page, STORY.emptyState, 0, 'emptystate-first-use');
  });

  test('no results', async ({ page }) => {
    await testVariant(page, STORY.emptyState, 1, 'emptystate-no-results');
  });

  test('cleared', async ({ page }) => {
    await testVariant(page, STORY.emptyState, 2, 'emptystate-cleared');
  });
});

test.describe('Feedback / ErrorState', () => {
  test('failed request', async ({ page }) => {
    await testVariant(page, STORY.errorState, 0, 'errorstate-request');
  });

  test('offline', async ({ page }) => {
    await testVariant(page, STORY.errorState, 1, 'errorstate-offline');
  });

  test('not found', async ({ page }) => {
    await testVariant(page, STORY.errorState, 2, 'errorstate-not-found');
  });
});

test.describe('Feedback / ErrorDisplay (deprecated)', () => {
  test('retryable', async ({ page }) => {
    await testVariant(page, STORY.error, 0, 'error-retryable');
  });
});

test.describe('Feedback / Toast', () => {
  test('colors and variants', async ({ page }) => {
    await testVariant(page, STORY.toast, 0, 'toast-colors-variants');
  });
});

test.describe('Feedback / ToastProvider (legacy)', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.toastProvider, 0, 'toast-provider-default');
  });
});
