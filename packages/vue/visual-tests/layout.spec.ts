import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  accordion: 'src-components-layout-accordion-accordion-story-vue',
  appShell: 'src-components-layout-appshell-appshell-story-vue',
  card: 'src-components-layout-card-card-story-vue',
  collapse: 'src-components-layout-collapse-collapse-story-vue',
  dialog: 'src-components-layout-dialog-dialog-story-vue',
  divider: 'src-components-layout-divider-divider-story-vue',
  drawer: 'src-components-layout-drawer-drawer-story-vue',
  dropdown: 'src-components-layout-dropdown-dropdown-story-vue',
  dropdownMenu: 'src-components-layout-dropdownmenu-dropdownmenu-story-vue',
  grid: 'src-components-layout-grid-grid-story-vue',
  heading: 'src-components-layout-heading-heading-story-vue',
  listItem: 'src-components-layout-listitem-listitem-story-vue',
  modal: 'src-components-layout-modal-modal-story-vue',
  pageHeader: 'src-components-layout-pageheader-pageheader-story-vue',
  popover: 'src-components-layout-popover-popover-story-vue',
  stack: 'src-components-layout-stack-stack-story-vue',
  tabs: 'src-components-layout-tabs-tabs-story-vue',
  text: 'src-components-layout-text-text-story-vue',
  userMenu: 'src-components-layout-usermenu-usermenu-story-vue',
};

test.describe('Layout / Card', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.card, 0, 'card-default');
  });

  test('surfaces', async ({ page }) => {
    await testVariant(page, STORY.card, 1, 'card-surfaces');
  });

  test('media', async ({ page }) => {
    await testVariant(page, STORY.card, 2, 'card-media');
  });

  test('glass', async ({ page }) => {
    await testVariant(page, STORY.card, 3, 'card-glass');
  });
});

test.describe('Layout / Modal', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.modal, 0, 'modal-default');
  });

  // Variant 1 (Glass) is skipped — the blur/glass effect renders
  // inconsistently across platforms, producing false-positive diffs.

  test('bottom sheet', async ({ page }) => {
    await testVariant(page, STORY.modal, 2, 'modal-bottom-sheet');
  });
});

test.describe('Layout / Dialog', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.dialog, 0, 'dialog-default');
  });

  test('confirm', async ({ page }) => {
    await testVariant(page, STORY.dialog, 1, 'dialog-confirm');
  });
});

test.describe('Layout / DropdownMenu', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.dropdownMenu, 0, 'dropdown-menu-default');
  });

  test('checkbox and radio items', async ({ page }) => {
    await testVariant(page, STORY.dropdownMenu, 1, 'dropdown-menu-options');
  });
});

test.describe('Layout / Dropdown', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.dropdown, 0, 'dropdown-default');
  });
});

test.describe('Layout / Tabs', () => {
  test('Segmented', async ({ page }) => {
    await testVariant(page, STORY.tabs, 0, 'tabs-segmented');
  });

  test('Underline, manual activation', async ({ page }) => {
    await testVariant(page, STORY.tabs, 1, 'tabs-underline-manual-activation');
  });

  test('Small, from data', async ({ page }) => {
    await testVariant(page, STORY.tabs, 2, 'tabs-small-from-data');
  });

  test('Vertical', async ({ page }) => {
    await testVariant(page, STORY.tabs, 3, 'tabs-vertical');
  });
});

test.describe('Layout / Accordion', () => {
  test('default (composed)', async ({ page }) => {
    await testVariant(page, STORY.accordion, 0, 'accordion-default-composed');
  });

  test('separated, multiple (data)', async ({ page }) => {
    await testVariant(page, STORY.accordion, 1, 'accordion-separated-multiple-data');
  });

  test('flush', async ({ page }) => {
    await testVariant(page, STORY.accordion, 2, 'accordion-flush');
  });
});

test.describe('Layout / Collapse', () => {
  test('section', async ({ page }) => {
    await testVariant(page, STORY.collapse, 0, 'collapse-section');
  });

  test('read more', async ({ page }) => {
    await testVariant(page, STORY.collapse, 1, 'collapse-read-more');
  });
});

test.describe('Layout / Divider', () => {
  test('horizontal', async ({ page }) => {
    await testVariant(page, STORY.divider, 0, 'divider-horizontal');
  });

  test('labelled', async ({ page }) => {
    await testVariant(page, STORY.divider, 1, 'divider-labelled');
  });

  test('vertical', async ({ page }) => {
    await testVariant(page, STORY.divider, 2, 'divider-vertical');
  });
});

test.describe('Layout / Drawer', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.drawer, 0, 'drawer-default');
  });

  test('with trigger', async ({ page }) => {
    await testVariant(page, STORY.drawer, 1, 'drawer-with-trigger');
  });

  test('bottom sheet', async ({ page }) => {
    await testVariant(page, STORY.drawer, 2, 'drawer-bottom-sheet');
  });
});

test.describe('Layout / Grid', () => {
  test('three columns', async ({ page }) => {
    await testVariant(page, STORY.grid, 0, 'grid-three-columns');
  });

  test('reflowing (min item width)', async ({ page }) => {
    await testVariant(page, STORY.grid, 1, 'grid-reflowing-min-item-width');
  });
});

test.describe('Layout / Stack', () => {
  test('vertical', async ({ page }) => {
    await testVariant(page, STORY.stack, 0, 'stack-vertical');
  });

  test('horizontal, between, wrapping', async ({ page }) => {
    await testVariant(page, STORY.stack, 1, 'stack-horizontal-between-wrapping');
  });
});

test.describe('Layout / Popover', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.popover, 0, 'popover-default');
  });

  test('own trigger', async ({ page }) => {
    await testVariant(page, STORY.popover, 1, 'popover-own-trigger');
  });
});

test.describe('Layout / AppShell', () => {
  test('collapsible', async ({ page }) => {
    await testVariant(page, STORY.appShell, 0, 'app-shell-collapsible');
  });
});

test.describe('Layout / PageHeader', () => {
  test('title, description and actions', async ({ page }) => {
    await testVariant(page, STORY.pageHeader, 0, 'page-header-title-description-and-actions');
  });
});

test.describe('Layout / Heading', () => {
  test('levels', async ({ page }) => {
    await testVariant(page, STORY.heading, 0, 'heading-levels');
  });

  test('eyebrow', async ({ page }) => {
    await testVariant(page, STORY.heading, 1, 'heading-eyebrow');
  });
});

test.describe('Layout / Text', () => {
  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.text, 0, 'text-sizes');
  });

  test('tone and weight', async ({ page }) => {
    await testVariant(page, STORY.text, 1, 'text-tone-and-weight');
  });

  test('truncate', async ({ page }) => {
    await testVariant(page, STORY.text, 2, 'text-truncate');
  });
});

test.describe('Layout / ListItem', () => {
  test('people', async ({ page }) => {
    await testVariant(page, STORY.listItem, 0, 'list-item-people');
  });

  test('notifications', async ({ page }) => {
    await testVariant(page, STORY.listItem, 1, 'list-item-notifications');
  });
});

test.describe('Layout / UserMenu', () => {
  test('sidebar', async ({ page }) => {
    await testVariant(page, STORY.userMenu, 0, 'user-menu-sidebar');
  });

  test('compact', async ({ page }) => {
    await testVariant(page, STORY.userMenu, 1, 'user-menu-compact');
  });

  test('open', async ({ page }) => {
    await testVariant(page, STORY.userMenu, 2, 'user-menu-open');
  });
});
