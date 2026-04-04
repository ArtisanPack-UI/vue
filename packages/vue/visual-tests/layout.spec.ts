import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  accordion: 'src-components-layout-accordion-accordion-story-vue',
  card: 'src-components-layout-card-card-story-vue',
  collapse: 'src-components-layout-collapse-collapse-story-vue',
  divider: 'src-components-layout-divider-divider-story-vue',
  drawer: 'src-components-layout-drawer-drawer-story-vue',
  dropdown: 'src-components-layout-dropdown-dropdown-story-vue',
  grid: 'src-components-layout-grid-grid-story-vue',
  modal: 'src-components-layout-modal-modal-story-vue',
  popover: 'src-components-layout-popover-popover-story-vue',
  stack: 'src-components-layout-stack-stack-story-vue',
  tabs: 'src-components-layout-tabs-tabs-story-vue',
};

test.describe('Layout / Card', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.card, 0, 'card-default');
  });

  test('bordered', async ({ page }) => {
    await testVariant(page, STORY.card, 1, 'card-bordered');
  });

  test('compact', async ({ page }) => {
    await testVariant(page, STORY.card, 2, 'card-compact');
  });

  test('glass', async ({ page }) => {
    await testVariant(page, STORY.card, 3, 'card-glass');
  });
});

test.describe('Layout / Tabs', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.tabs, 0, 'tabs-default');
  });

  test('bordered', async ({ page }) => {
    await testVariant(page, STORY.tabs, 1, 'tabs-bordered');
  });

  test('lifted', async ({ page }) => {
    await testVariant(page, STORY.tabs, 2, 'tabs-lifted');
  });
});

test.describe('Layout / Accordion', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.accordion, 0, 'accordion-default');
  });

  test('joined', async ({ page }) => {
    await testVariant(page, STORY.accordion, 1, 'accordion-joined');
  });
});

test.describe('Layout / Collapse', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.collapse, 0, 'collapse-default');
  });

  test('icon variants', async ({ page }) => {
    await testVariant(page, STORY.collapse, 1, 'collapse-icon-variants');
  });
});

test.describe('Layout / Divider', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.divider, 0, 'divider-default');
  });

  test('with label', async ({ page }) => {
    await testVariant(page, STORY.divider, 1, 'divider-label');
  });

  test('colors', async ({ page }) => {
    await testVariant(page, STORY.divider, 2, 'divider-colors');
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

test.describe('Layout / Drawer', () => {
  test('default left', async ({ page }) => {
    await testVariant(page, STORY.drawer, 0, 'drawer-left');
  });

  test('end right', async ({ page }) => {
    await testVariant(page, STORY.drawer, 1, 'drawer-right');
  });
});

test.describe('Layout / Dropdown', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.dropdown, 0, 'dropdown-default');
  });
});

test.describe('Layout / Grid', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.grid, 0, 'grid-default');
  });

  test('responsive', async ({ page }) => {
    await testVariant(page, STORY.grid, 1, 'grid-responsive');
  });
});

test.describe('Layout / Stack', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.stack, 0, 'stack-default');
  });
});

test.describe('Layout / Popover', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.popover, 0, 'popover-default');
  });
});
