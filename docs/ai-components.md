---
title: AI Components
menu_order: 10
---

# AI Components

`@artisanpack-ui/vue/ai` is the admin interface for the [`artisanpack-ui/ai`](https://github.com/ArtisanPack-UI/ai) Laravel package in Vue: a settings form, a usage dashboard and a list of feature switches, built from the design-system components (Form, Input, Password, Select, Card, Table, Stat, Toggle, Alert and others), plus the API client they share and a composable for streamed text.

It ships inside `@artisanpack-ui/vue`; there's nothing else to install. The components are only exported from this subpath, so none of them reach your bundle unless you import it. They're styled by `@artisanpack-ui/css` like every other component and follow the theme, preset and density.

## Quick start

```vue
<script setup lang="ts">
import {
  FeatureToggles,
  SettingsPage,
  UsageDashboard,
  createAiApiClient,
} from '@artisanpack-ui/vue/ai';
import { Stack } from '@artisanpack-ui/vue';

const client = createAiApiClient({
  baseUrl: '/api/artisanpack-ai',
  headers: {
    'X-CSRF-TOKEN':
      document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
  },
});
</script>

<template>
  <Stack gap="8">
    <SettingsPage :client="client" heading="AI settings" />
    <UsageDashboard :client="client" :refresh-interval="15000" heading="Usage" />
    <FeatureToggles :client="client" heading="Features" />
  </Stack>
</template>
```

## createAiApiClient

Builds the `AiApiClient` every component takes, as a small wrapper around `fetch`:

```ts
const client = createAiApiClient({
  baseUrl: '/api/artisanpack-ai',
  headers: { Authorization: `Bearer ${token}` },
  fetchImpl: (input, init) => fetch(input, { ...init, credentials: 'include' }),
});
```

| Option      | Type                     | Description                                                        |
| ----------- | ------------------------ | ------------------------------------------------------------------ |
| `baseUrl`   | `string`                 | The prefix of the AI package's routes. Required                    |
| `headers`   | `Record<string, string>` | Merged into every request: a CSRF token, a bearer token            |
| `fetchImpl` | `typeof fetch`           | Replaces the global `fetch`, for tests or cross-origin credentials |

Every request sends `Accept: application/json`, and a JSON `Content-Type` only when it has a body. A response that isn't 2xx rejects with `AiApiError`, which carries the `status` and the parsed `body`, so a 422 response's `{ message, errors }` is available.

The components depend on the `AiApiClient` interface, not on `fetch`. If your app has its own HTTP layer, implement the interface (`getSettings`, `updateSettings`, `testConnection`, `getFeatures`, `toggleFeature`, `getUsage`) instead.

## Shared behavior

- **Changing `client` reloads.** Each component loads its data when it mounts and again whenever the `client` prop changes.
- **The latest request wins.** A response to a request that has been replaced (by a new client, a new date range, or a newer load or save) is ignored, so a slow response never overwrites newer data. This covers saves too: a save answered after `client` changed doesn't overwrite the new client's settings.
- **Failures are shown, not thrown.** Load and save errors appear in an Alert with the error's message. A rejection that isn't an `Error` (a string, `null`) still shows a readable message.
- **`heading`** adds a heading above the component.
- **Every built-in string is a label.** Each component takes a `labels` prop with any of its keys, merged over the English defaults, so you can translate them. See [Translating the text](#translating-the-text).

## SettingsPage

The credentials and per-feature overrides form, backed by `GET` and `PUT /settings` and `POST /test-connection`.

```vue
<SettingsPage
  :client="client"
  heading="AI settings"
  :providers="['openai', 'anthropic', 'ollama']"
/>
```

| Prop        | Type                          | Default                             | Description              |
| ----------- | ----------------------------- | ----------------------------------- | ------------------------ |
| `client`    | `AiApiClient`                 |                                     | Required                 |
| `providers` | `string[]`                    | `['openai', 'anthropic', 'ollama']` | The provider options     |
| `heading`   | `string`                      |                                     | A heading above the form |
| `labels`    | `Partial<SettingsPageLabels>` |                                     | The built-in text        |

- **Load errors can be retried.** If the settings can't be loaded, the form isn't shown with empty values: an error Alert explains it, with a Retry button that loads them again.
- **The stored key is never shown.** The API only reports whether a key is stored. The API key field starts empty, and saving it empty keeps the stored key. The field is hidden for Ollama, which takes a base URL instead.
- **Changing the provider clears the typed key** and the last connection test, so a key is never sent to the wrong provider.
- **Test connection** checks the credentials as typed, without saving. Editing a credential clears the result, and a result for credentials that have since changed is discarded.
- **Validation errors** from a 422 response appear under their fields, with the message in an Alert above the form. The form only recognizes them on an `AiApiError` with status 422, so a custom client must reject a validation response with `new AiApiError(422, body, message)` from `@artisanpack-ui/vue/ai`, where `body` is the `{ message, errors }` object; any other error shows only the Alert.
- **Per-feature overrides** (a model and instructions per feature) appear when the API returns any.

## UsageDashboard

Totals, a per-feature table and a daily table, backed by `GET /usage`.

```vue
<UsageDashboard
  :client="client"
  from="2026-07-01"
  to="2026-07-31"
  :refresh-interval="15000"
  heading="Usage"
/>
```

| Prop              | Type                            | Default | Description                                      |
| ----------------- | ------------------------------- | ------- | ------------------------------------------------ |
| `client`          | `AiApiClient`                   |         | Required                                         |
| `from`            | `string`                        |         | Start date, `YYYY-MM-DD`                         |
| `to`              | `string`                        |         | End date, `YYYY-MM-DD`                           |
| `refreshInterval` | `number`                        | `0`     | Milliseconds between refreshes. `0` doesn't poll |
| `heading`         | `string`                        |         | A heading above the dashboard                    |
| `labels`          | `Partial<UsageDashboardLabels>` |         | The built-in text                                |

- **Polling waits for each response.** The next refresh is scheduled only once the previous one has settled, so a slow response is never overtaken by the one after it.
- **A failed refresh keeps the figures.** If a refresh fails after data has loaded, the last figures stay, with a warning Alert saying they couldn't be refreshed. The next successful refresh clears it.
- **A new range starts over.** Changing `client`, `from` or `to` drops the current figures and loads again, so the previous range's totals never show under the new one.
- Costs are formatted as US dollars, and numbers in the visitor's locale.

## FeatureToggles

A switch per registered AI feature, backed by `GET /features` and `POST /features/{key}/toggle`.

```vue
<FeatureToggles :client="client" heading="Features" @toggle="onToggle" />
```

| Prop      | Type                            | Description              |
| --------- | ------------------------------- | ------------------------ |
| `client`  | `AiApiClient`                   | Required                 |
| `heading` | `string`                        | A heading above the list |
| `labels`  | `Partial<FeatureTogglesLabels>` | The built-in text        |

| Event    | Payload                                            | When                    |
| -------- | -------------------------------------------------- | ----------------------- |
| `toggle` | `{ key, package, enabled }` as saved by the server | After a switch is saved |

- **Switches flip at once** and are disabled while their request runs. If the request fails, the switch flips back and an error Alert explains why; the next successful toggle clears it.
- **`toggle` follows the save.** It isn't emitted when a toggle fails. An error thrown by your listener is logged, and doesn't roll the switch back, because the change was already saved.
- When no features are registered, an empty state says so.

## Translating the text

Pass `labels` with the keys you want to change. Anything you leave out keeps its English default. Here the strings come from vue-i18n's `$t`:

```vue
<SettingsPage
  :client="client"
  :labels="{ save: $t('ai.save'), retry: $t('ai.retry'), loading: $t('ai.loading') }"
/>
<UsageDashboard :client="client" :labels="{ live: $t('ai.live') }" />
```

The keys are typed by `SettingsPageLabels`, `UsageDashboardLabels` and `FeatureTogglesLabels`, exported from `@artisanpack-ui/vue/ai`. They cover every visible string: headings, field labels, hints and placeholders, table headers, stat labels, the Retry button, loading and empty states, and the fallback error message. `UsageDashboard`'s `live` status takes a `:seconds` placeholder for the refresh interval.

## useStreamingText

Reads a streamed `fetch` response as UTF-8 text, for output such as a generation in progress:

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { useStreamingText } from '@artisanpack-ui/vue/ai';

const { text, streaming, error, start, stop, reset } = useStreamingText();
</script>

<template>
  <Button :loading="streaming" @click="start('/agents/summary')">Run</Button>
  <Button variant="ghost" :disabled="!streaming" @click="stop">Stop</Button>
  <Button variant="ghost" @click="reset">Clear</Button>
  <pre>{{ text }}</pre>
  <p v-if="error" role="alert">{{ error.message }}</p>
</template>
```

| Returns             | Description                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `text`              | The text received so far                                                                                           |
| `streaming`         | `true` while a stream is being read                                                                                |
| `error`             | The error that ended the stream, or `null`                                                                         |
| `start(url, init?)` | Starts a stream, aborting any stream already running. `init` is passed to `fetch`, and its `signal` is honored too |
| `stop()`            | Aborts the running stream                                                                                          |
| `reset()`           | Clears `text` and `error`                                                                                          |

Only the latest stream writes `text`, `error` and `streaming`: chunks from a stream that was replaced or aborted are dropped. The stream is aborted when the calling component unmounts.

The AI package's REST API has no streaming route. Point `start()` at an endpoint of your own app that streams a response.

## Types

`@artisanpack-ui/vue/ai` exports the client and response types: `AiApiClient`, `CreateAiApiClientOptions`, `AiCredentials`, `AiSettingsResponse`, `AiSettingsUpdate`, `AiFeatureOverride`, `AiFeature`, `AiConnectionTestResult`, `AiUsageResponse`, `AiUsageTotals`, `AiUsageByFeature`, `AiUsageDaily`, `AiValidationError` and `UseStreamingTextResult`, the label types `SettingsPageLabels`, `UsageDashboardLabels` and `FeatureTogglesLabels`, and the `AiApiError` class.
