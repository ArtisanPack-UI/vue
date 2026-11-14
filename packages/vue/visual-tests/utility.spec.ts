import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  clipboard: 'src-components-utility-clipboard-clipboard-story-vue',
  icon: 'src-components-utility-icon-icon-story-vue',
  kbd: 'src-components-utility-kbd-kbd-story-vue',
  markdown: 'src-components-utility-markdown-markdown-story-vue',
  swap: 'src-components-utility-swap-swap-story-vue',
  themeToggle: 'src-components-utility-themetoggle-themetoggle-story-vue',
  tooltip: 'src-components-utility-tooltip-tooltip-story-vue',
};

test.describe('Utility / Clipboard', () => {
  test('button', async ({ page }) => {
    await testVariant(page, STORY.clipboard, 0, 'clipboard-button');
  });

  test('icon button', async ({ page }) => {
    await testVariant(page, STORY.clipboard, 1, 'clipboard-icon');
  });

  test('copy field', async ({ page }) => {
    await testVariant(page, STORY.clipboard, 2, 'clipboard-field');
  });
});

test.describe('Utility / Kbd', () => {
  test('keys and shortcuts', async ({ page }) => {
    await testVariant(page, STORY.kbd, 0, 'kbd-keys');
  });

  test('in running text', async ({ page }) => {
    await testVariant(page, STORY.kbd, 1, 'kbd-in-text');
  });
});

test.describe('Utility / Icon', () => {
  test('sizes and labels', async ({ page }) => {
    await testVariant(page, STORY.icon, 0, 'icon-sizes-and-labels');
  });

  test('tiles', async ({ page }) => {
    await testVariant(page, STORY.icon, 1, 'icon-tiles');
  });

  test('custom svg', async ({ page }) => {
    await testVariant(page, STORY.icon, 2, 'icon-custom-svg');
  });
});

test.describe('Utility / Swap', () => {
  test('sun and moon', async ({ page }) => {
    await testVariant(page, STORY.swap, 0, 'swap-sun-and-moon');
  });

  test('rotate and custom content', async ({ page }) => {
    await testVariant(page, STORY.swap, 1, 'swap-rotate-and-custom-content');
  });
});

test.describe('Utility / ThemeToggle', () => {
  test('segmented', async ({ page }) => {
    await testVariant(page, STORY.themeToggle, 0, 'theme-toggle-segmented');
  });

  test('icons only', async ({ page }) => {
    await testVariant(page, STORY.themeToggle, 1, 'theme-toggle-icons-only');
  });

  test('icon button', async ({ page }) => {
    await testVariant(page, STORY.themeToggle, 2, 'theme-toggle-icon-button');
  });

  test('menu', async ({ page }) => {
    await testVariant(page, STORY.themeToggle, 3, 'theme-toggle-menu');
  });

  test('translated', async ({ page }) => {
    await testVariant(page, STORY.themeToggle, 4, 'theme-toggle-translated');
  });
});

test.describe('Utility / Markdown', () => {
  test('preview', async ({ page }) => {
    await testVariant(page, STORY.markdown, 0, 'markdown-preview');
  });

  test('split', async ({ page }) => {
    await testVariant(page, STORY.markdown, 1, 'markdown-split');
  });

  test('write', async ({ page }) => {
    await testVariant(page, STORY.markdown, 2, 'markdown-write');
  });

  test('raw html', async ({ page }) => {
    await testVariant(page, STORY.markdown, 3, 'markdown-raw-html');
  });
});

test.describe('Utility / Tooltip', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.tooltip, 0, 'tooltip-default');
  });

  test('long text', async ({ page }) => {
    await testVariant(page, STORY.tooltip, 1, 'tooltip-long-text');
  });

  test('forced open', async ({ page }) => {
    await testVariant(page, STORY.tooltip, 2, 'tooltip-forced-open');
  });
});
