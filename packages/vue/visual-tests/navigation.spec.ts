import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  breadcrumbs: 'src-components-navigation-breadcrumbs-breadcrumbs-story-vue',
  link: 'src-components-navigation-link-link-story-vue',
  menu: 'src-components-navigation-menu-menu-story-vue',
  navbar: 'src-components-navigation-navbar-navbar-story-vue',
  pagination: 'src-components-navigation-pagination-pagination-story-vue',
  sidebar: 'src-components-navigation-sidebar-sidebar-story-vue',
  spotlight: 'src-components-navigation-spotlight-spotlight-story-vue',
  spotlightSearch: 'src-components-navigation-spotlightsearch-spotlightsearch-story-vue',
  steps: 'src-components-navigation-steps-steps-story-vue',
};

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

test.describe('Navigation / Menu', () => {
  test('Composition', async ({ page }) => {
    await testVariant(page, STORY.menu, 0, 'menu-composition');
  });

  test('From data, not collapsible', async ({ page }) => {
    await testVariant(page, STORY.menu, 1, 'menu-from-data-not-collapsible');
  });
});

test.describe('Navigation / Breadcrumbs', () => {
  test('Default', async ({ page }) => {
    await testVariant(page, STORY.breadcrumbs, 0, 'breadcrumbs-default');
  });

  test('Home icon and overflow', async ({ page }) => {
    await testVariant(page, STORY.breadcrumbs, 1, 'breadcrumbs-home-icon-and-overflow');
  });

  test('Composed', async ({ page }) => {
    await testVariant(page, STORY.breadcrumbs, 2, 'breadcrumbs-composed');
  });
});

test.describe('Navigation / Pagination', () => {
  test('Default', async ({ page }) => {
    await testVariant(page, STORY.pagination, 0, 'pagination-default');
  });

  test('With summary', async ({ page }) => {
    await testVariant(page, STORY.pagination, 1, 'pagination-with-summary');
  });
});

test.describe('Navigation / Steps', () => {
  test('Horizontal', async ({ page }) => {
    await testVariant(page, STORY.steps, 0, 'steps-horizontal');
  });

  test('Vertical with error', async ({ page }) => {
    await testVariant(page, STORY.steps, 1, 'steps-vertical-with-error');
  });

  test('Clickable, from data', async ({ page }) => {
    await testVariant(page, STORY.steps, 2, 'steps-clickable-from-data');
  });
});

test.describe('Navigation / Navbar', () => {
  test('Bar', async ({ page }) => {
    await testVariant(page, STORY.navbar, 0, 'navbar-bar');
  });

  test('Island on glass', async ({ page }) => {
    await testVariant(page, STORY.navbar, 1, 'navbar-island-on-glass');
  });
});

test.describe('Navigation / Link', () => {
  test('Inline', async ({ page }) => {
    await testVariant(page, STORY.link, 0, 'link-inline');
  });

  test('Standalone', async ({ page }) => {
    await testVariant(page, STORY.link, 1, 'link-standalone');
  });

  test('As a button', async ({ page }) => {
    await testVariant(page, STORY.link, 2, 'link-as-a-button');
  });
});

test.describe('Navigation / Spotlight', () => {
  test('Default', async ({ page }) => {
    await testVariant(page, STORY.spotlight, 0, 'spotlight-default');
  });

  test('In place', async ({ page }) => {
    await testVariant(page, STORY.spotlight, 1, 'spotlight-in-place');
  });

  test('Server search', async ({ page }) => {
    await testVariant(page, STORY.spotlight, 2, 'spotlight-server-search');
  });
});
