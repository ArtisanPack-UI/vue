---
title: UsageDashboard
menu_order: 30
meta_description: The Vue UsageDashboard component for artisanpack-ui/ai. Request, token and cost totals with per-feature and daily tables, a date range and polling.
---

# UsageDashboard

Usage totals, a per-feature table and a daily table for the [`artisanpack-ui/ai`](https://github.com/ArtisanPack-UI/ai) package, backed by `GET /usage`. It renders four [Stat](../display/stat.md)s (requests, input tokens, output tokens and cost) and two compact [Table](../data/table.md)s, and can poll for live figures.

```ts
import { UsageDashboard } from '@artisanpack-ui/vue/ai';
```

UsageDashboard is only exported from the `/ai` subpath.

## Usage

```vue
<script setup lang="ts">
import { UsageDashboard, createAiApiClient } from '@artisanpack-ui/vue/ai';

const client = createAiApiClient({ baseUrl: '/api/artisanpack-ai' });
</script>

<template>
  <UsageDashboard :client="client" heading="Usage" />
</template>
```

See [createAiApiClient](../ai.md#createaiapiclient) for the client options.

### Date range

`from` and `to` take `YYYY-MM-DD` dates and are sent as query parameters. Without them, the API picks its default range.

```vue
<template>
  <UsageDashboard :client="client" from="2026-07-01" to="2026-07-31" />
</template>
```

Bind them to a date picker to let people choose the range. Changing either one drops the current figures and loads again, so the previous range's totals never show under the new one.

### Polling

`refreshInterval` polls `GET /usage` every so many milliseconds. A muted status line under the tables shows the `live` label with the interval in seconds.

```vue
<template>
  <UsageDashboard :client="client" :refresh-interval="15000" heading="Usage" />
</template>
```

- **Polling waits for each response.** The next refresh is scheduled only once the previous one has settled, so a slow response is never overtaken by the one after it.
- **A failed refresh keeps the figures.** If a refresh fails after data has loaded, the last figures stay, with a warning [Alert](../feedback/alert.md) titled with the `refreshError` label. The next successful refresh clears it.
- Changing `refreshInterval` restarts polling. `0` stops it.

### Behavior

- While the first figures load, a small [Loading](../feedback/loading.md) shows the `loading` label. If the first load fails, an error Alert shows instead. The `heading` only shows with the figures.
- Numbers are formatted with `Intl.NumberFormat` in the visitor's locale. Costs are formatted as US dollars with 2 to 4 decimal places.
- Empty tables show the `noFeatureUsage` and `noDailyUsage` labels.
- Changing `client` reloads, and responses to the previous client are ignored.

## Props

| Prop              | Type                            | Default | Description                                                                                    |
| ----------------- | ------------------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `client`          | `AiApiClient`                   | —       | The API client, usually from `createAiApiClient()`. Required. Changing it reloads the figures. |
| `from`            | `string`                        | —       | Start date, `YYYY-MM-DD`.                                                                      |
| `to`              | `string`                        | —       | End date, `YYYY-MM-DD`.                                                                        |
| `refreshInterval` | `number`                        | `0`     | Milliseconds between refreshes. `0` doesn't poll.                                              |
| `heading`         | `string`                        | —       | A level-2 heading above the dashboard.                                                         |
| `labels`          | `Partial<UsageDashboardLabels>` | —       | The built-in text, merged over the defaults. See [Labels](#labels).                            |

UsageDashboard inherits attributes. `class`, `style` and other attributes go to whichever root is showing: the Loading, the error Alert, or the dashboard's [Stack](../layout/stack.md), which carries `data-testid="ai-usage-dashboard"`.

## Labels

| Key              | Default                                                      | Description                                                                       |
| ---------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `loading`        | `'Loading usage…'`                                           | Shown while the first figures load.                                               |
| `refreshError`   | `"Couldn't refresh usage. Showing the last figures loaded."` | The warning title when a refresh fails and the last figures stay.                 |
| `requests`       | `'Requests'`                                                 | The requests stat and column.                                                     |
| `inputTokens`    | `'Input tokens'`                                             | The input tokens stat.                                                            |
| `outputTokens`   | `'Output tokens'`                                            | The output tokens stat.                                                           |
| `cost`           | `'Cost'`                                                     | The cost stat and column.                                                         |
| `byFeature`      | `'By feature'`                                               | The per-feature table's title.                                                    |
| `daily`          | `'Daily'`                                                    | The daily table's title.                                                          |
| `feature`        | `'Feature'`                                                  | The per-feature table's feature column.                                           |
| `input`          | `'Input'`                                                    | The per-feature table's input tokens column.                                      |
| `output`         | `'Output'`                                                   | The per-feature table's output tokens column.                                     |
| `day`            | `'Day'`                                                      | The daily table's day column.                                                     |
| `tokens`         | `'Tokens'`                                                   | The daily table's total tokens column.                                            |
| `noFeatureUsage` | `'No feature usage in this range.'`                          | The per-feature table's empty text.                                               |
| `noDailyUsage`   | `'No daily usage in this range.'`                            | The daily table's empty text.                                                     |
| `live`           | `'Live · refreshing every :seconds s'`                       | The status line while polling. `:seconds` is replaced by the interval in seconds. |
| `genericError`   | `'Something went wrong.'`                                    | Shown when a request fails without a message.                                     |

## Slots

UsageDashboard has no slots.

## Events

UsageDashboard has no events.

## Parts

UsageDashboard has no `classes` prop or parts of its own. It's composed from Stack, Stat, Table, Text, Heading, Alert and Loading, so target those components' parts in CSS, scoped under `[data-testid="ai-usage-dashboard"]` or a class you pass.

## Types

```ts
import type {
  AiApiClient,
  AiUsageByFeature,
  AiUsageDaily,
  AiUsageResponse,
  AiUsageTotals,
  UsageDashboardLabels,
} from '@artisanpack-ui/vue/ai';
```

| Type                   | Description                                                                    |
| ---------------------- | ------------------------------------------------------------------------------ |
| `UsageDashboardLabels` | The label keys above.                                                          |
| `AiUsageResponse`      | What `GET /usage` returns: the range, totals, per-feature rows and daily rows. |
| `AiUsageTotals`        | The totals block.                                                              |
| `AiUsageByFeature`     | A per-feature row.                                                             |
| `AiUsageDaily`         | A daily row.                                                                   |
| `AiApiClient`          | The client interface. See [Client methods](../ai.md#client-methods).           |

See [Types](../ai.md#types) for their shapes. The props interface isn't exported.

## Accessibility

UsageDashboard has no keyboard behavior of its own beyond the tables'.

- The tables have visible titles and column headers from `labels`. Numeric columns are aligned as numbers.
- The live status line is `role="status"` with `aria-live="polite"`.
- A failed first load shows an Alert with `role="alert"`; a failed refresh shows a warning Alert with `role="status"`, so polling failures aren't announced as urgent.

## Related

- [AI Components](../ai.md) for the client, errors and labels.
- [FeatureToggles](feature-toggles.md) for turning features on and off.
- [SettingsPage](settings-page.md) for credentials and per-feature models.
- [Stat](../display/stat.md) and [Table](../data/table.md), which the dashboard is built from.
