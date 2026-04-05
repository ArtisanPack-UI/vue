import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  clipboard: 'src-components-utility-clipboard-clipboard-story-vue',
  icon: 'src-components-utility-icon-icon-story-vue',
  markdown: 'src-components-utility-markdown-markdown-story-vue',
  themeToggle: 'src-components-utility-themetoggle-themetoggle-story-vue',
  tooltip: 'src-components-utility-tooltip-tooltip-story-vue',
};

test.describe('Utility / Tooltip', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.tooltip, 0, 'tooltip-default');
  });

  test('positions', async ({ page }) => {
    await testVariant(page, STORY.tooltip, 1, 'tooltip-positions');
  });
});

test.describe('Utility / Clipboard', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.clipboard, 0, 'clipboard-default');
  });

  test('with label', async ({ page }) => {
    await testVariant(page, STORY.clipboard, 1, 'clipboard-label');
  });

  test('code copy', async ({ page }) => {
    await testVariant(page, STORY.clipboard, 2, 'clipboard-code');
  });
});

test.describe('Utility / Icon', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.icon, 0, 'icon-default');
  });

  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.icon, 1, 'icon-sizes');
  });
});

test.describe('Utility / ThemeToggle', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.themeToggle, 0, 'theme-toggle-default');
  });

  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.themeToggle, 1, 'theme-toggle-sizes');
  });
});

test.describe('Utility / Markdown', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.markdown, 0, 'markdown-default');
  });
});
