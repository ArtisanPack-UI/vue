import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  calendar: 'src-components-data-calendar-calendar-story-vue',
  chart: 'src-components-data-chart-chart-story-vue',
  table: 'src-components-data-table-table-story-vue',
};

test.describe('Data / Calendar', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.calendar, 0, 'calendar-default');
  });

  test('with events', async ({ page }) => {
    await testVariant(page, STORY.calendar, 1, 'calendar-events');
  });
});

test.describe('Data / Chart', () => {
  test('bar chart', async ({ page }) => {
    await testVariant(page, STORY.chart, 1, 'chart-bar');
  });

  test('line chart', async ({ page }) => {
    await testVariant(page, STORY.chart, 2, 'chart-line');
  });

  test('donut chart', async ({ page }) => {
    await testVariant(page, STORY.chart, 4, 'chart-donut');
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
