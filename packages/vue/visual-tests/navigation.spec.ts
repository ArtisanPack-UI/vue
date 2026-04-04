import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  breadcrumbs: 'src-components-navigation-breadcrumbs-breadcrumbs-story-vue',
  menu: 'src-components-navigation-menu-menu-story-vue',
  navbar: 'src-components-navigation-navbar-navbar-story-vue',
  pagination: 'src-components-navigation-pagination-pagination-story-vue',
  sidebar: 'src-components-navigation-sidebar-sidebar-story-vue',
  spotlightSearch: 'src-components-navigation-spotlightsearch-spotlightsearch-story-vue',
  steps: 'src-components-navigation-steps-steps-story-vue',
};

test.describe('Navigation / Menu', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.menu, 0, 'menu-default');
  });

  test('horizontal', async ({ page }) => {
    await testVariant(page, STORY.menu, 1, 'menu-horizontal');
  });

  test('with nested items', async ({ page }) => {
    await testVariant(page, STORY.menu, 2, 'menu-nested');
  });
});

test.describe('Navigation / Breadcrumbs', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.breadcrumbs, 0, 'breadcrumbs-default');
  });
});

test.describe('Navigation / Pagination', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.pagination, 0, 'pagination-default');
  });

  test('many pages', async ({ page }) => {
    await testVariant(page, STORY.pagination, 1, 'pagination-many-pages');
  });

  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.pagination, 2, 'pagination-sizes');
  });
});

test.describe('Navigation / Steps', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.steps, 0, 'steps-default');
  });

  test('colored', async ({ page }) => {
    await testVariant(page, STORY.steps, 1, 'steps-colored');
  });

  test('vertical', async ({ page }) => {
    await testVariant(page, STORY.steps, 2, 'steps-vertical');
  });
});

test.describe('Navigation / Navbar', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.navbar, 0, 'navbar-default');
  });

  test('with color', async ({ page }) => {
    await testVariant(page, STORY.navbar, 1, 'navbar-color');
  });
});

test.describe('Navigation / Sidebar', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.sidebar, 0, 'sidebar-default');
  });
});

test.describe('Navigation / SpotlightSearch', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.spotlightSearch, 0, 'spotlight-search-default');
  });
});
