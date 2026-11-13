import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  calendar: 'src-components-data-calendar-calendar-story-vue',
  chart: 'src-components-data-chart-chart-story-vue',
  table: 'src-components-data-table-table-story-vue',
};

test.describe('Data / Calendar', () => {
  test('month', async ({ page }) => {
    await testVariant(page, STORY.calendar, 0, 'calendar-month');
  });

  test('week', async ({ page }) => {
    await testVariant(page, STORY.calendar, 1, 'calendar-week');
  });

  test('day', async ({ page }) => {
    await testVariant(page, STORY.calendar, 2, 'calendar-day');
  });

  test('agenda', async ({ page }) => {
    await testVariant(page, STORY.calendar, 3, 'calendar-agenda');
  });

  test('right to left', async ({ page }) => {
    await testVariant(page, STORY.calendar, 5, 'calendar-rtl');
  });
});

test.describe('Data / Chart', () => {
  test('bar', async ({ page }) => {
    await testVariant(page, STORY.chart, 0, 'chart-bar');
  });

  test('area', async ({ page }) => {
    await testVariant(page, STORY.chart, 1, 'chart-area');
  });

  test('line', async ({ page }) => {
    await testVariant(page, STORY.chart, 2, 'chart-line');
  });

  test('donut with a data table', async ({ page }) => {
    await testVariant(page, STORY.chart, 3, 'chart-donut-with-a-data-table');
  });
});

test.describe('Data / Table', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.table, 0, 'table-default');
  });

  test('selection, sorting, expansion and pagination', async ({ page }) => {
    await testVariant(page, STORY.table, 1, 'table-selection-sorting-expansion-and-pagination');
  });

  test('compact', async ({ page }) => {
    await testVariant(page, STORY.table, 2, 'table-compact');
  });

  test('loading', async ({ page }) => {
    await testVariant(page, STORY.table, 3, 'table-loading');
  });

  test('empty', async ({ page }) => {
    await testVariant(page, STORY.table, 4, 'table-empty');
  });
});
