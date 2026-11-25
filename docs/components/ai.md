---
title: AI Components
menu_order: 80
meta_description: Vue admin components for the artisanpack-ui/ai package. The API client, label props, error handling and the useStreamingText composable.
redirect_from: ai-components
---

# AI Components

`@artisanpack-ui/vue/ai` is the admin interface for the [`artisanpack-ui/ai`](https://github.com/ArtisanPack-UI/ai) Laravel package in Vue: a settings form, a usage dashboard and a list of feature switches, built from the design-system components (Form, Input, Password, Select, Card, Table, Stat, Toggle, Alert and others), plus the API client they share and a composable for streamed text.

- [FeatureToggles](ai/feature-toggles.md): a switch per registered AI feature.
- [SettingsPage](ai/settings-page.md): the credentials and per-feature overrides form.
- [UsageDashboard](ai/usage-dashboard.md): request, token and cost totals, with per-feature and daily tables.

## Installing

The AI components ship inside `@artisanpack-ui/vue`; there's nothing else to install. They're only exported from the `/ai` subpath, not from the package root, so none of them reach your bundle unless you import it. They're styled by `@artisanpack-ui/css` like every other component and follow the theme, preset and density.

```ts
import {
  AiApiError,
  FeatureToggles,
  SettingsPage,
  UsageDashboard,
  createAiApiClient,
  useStreamingText,
} from '@artisanpack-ui/vue/ai';
```

On the Laravel side, install and configure `artisanpack-ui/ai` and make sure its JSON API routes are reachable from the browser.

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

```ts
function createAiApiClient(options: CreateAiApiClientOptions): AiApiClient;
```

Builds the `AiApiClient` every component takes, as a small wrapper around `fetch`:

```ts
const client = createAiApiClient({
  baseUrl: '/api/artisanpack-ai',
  headers: { Authorization: `Bearer ${token}` },
  fetchImpl: (input, init) => fetch(input, { ...init, credentials: 'include' }),
});
```

| Option      | Type                     | Description                                                                                                    |
| ----------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `baseUrl`   | `string`                 | The prefix of the AI package's routes, such as `'/api/artisanpack-ai'`. A trailing slash is removed. Required. |
| `headers`   | `Record<string, string>` | Merged into every request: a CSRF token, a bearer token.                                                       |
| `fetchImpl` | `typeof fetch`           | Replaces the global `fetch`, for tests or cross-origin credentials.                                            |

Every request sends `Accept: application/json`, and a JSON `Content-Type` only when it has a body. The response body is parsed as JSON when it can be, and kept as text otherwise.

### Client methods

The returned `AiApiClient` has one method per route:

| Method                                                              | Request                                                           | Resolves with                                                   |
| ------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| `getSettings()`                                                     | `GET /settings`                                                   | `AiSettingsResponse`                                            |
| `updateSettings(body: AiSettingsUpdate)`                            | `PUT /settings`                                                   | `AiSettingsResponse`                                            |
| `testConnection(body: Omit<AiSettingsUpdate, 'feature_overrides'>)` | `POST /test-connection`                                           | `AiConnectionTestResult`                                        |
| `getFeatures()`                                                     | `GET /features`                                                   | `{ features: AiFeature[] }`                                     |
| `toggleFeature(key: string, enabled?: boolean)`                     | `POST /features/{key}/toggle` with `{ enabled }`, or `{}` to flip | `{ feature: Pick<AiFeature, 'key' \| 'package' \| 'enabled'> }` |
| `getUsage(params?: { from?: string; to?: string })`                 | `GET /usage?from=…&to=…` (empty values are left out)              | `AiUsageResponse`                                               |

The components depend on the `AiApiClient` interface, not on `fetch`. If your app has its own HTTP layer, implement the interface instead.

## Errors

### AiApiError

```ts
class AiApiError extends Error {
  readonly status: number;
  readonly body: unknown;
  constructor(status: number, body: unknown, message: string);
}
```

A response that isn't 2xx rejects with `AiApiError`. `status` is the HTTP status and `body` the parsed response body, so a 422 response's `{ message, errors }` (an `AiValidationError`) is available. The message is the body's `message` when it has one, and `AI API request to {path} failed with status {status}` otherwise. `name` is `'AiApiError'`.

```ts
import { AiApiError, type AiValidationError } from '@artisanpack-ui/vue/ai';

try {
  await client.updateSettings({ provider: 'ollama', base_url: null });
} catch (error) {
  if (error instanceof AiApiError && error.status === 422) {
    const { errors } = error.body as AiValidationError;
    console.log(errors.base_url);
  }
}
```

### How the components show errors

- **Failures are shown, not thrown.** Load and save errors appear in an [Alert](feedback/alert.md) with the error's message.
- **Every rejection gets a readable message.** An `Error` with a message shows that message, a non-empty string shows the string, and anything else (`null`, a plain object, an empty message) shows the component's `genericError` label, "Something went wrong." by default.
- **Validation errors need an `AiApiError`.** SettingsPage only maps a 422 response onto its fields when the rejection is an `AiApiError` with status 422 and a `{ message, errors }` body. A custom client must reject validation responses with `new AiApiError(422, body, message)`; any other error shows only the Alert.

## Shared behavior

- **Changing `client` reloads.** Each component loads its data when it mounts and again whenever the `client` prop changes.
- **The latest request wins.** A response to a request that has been replaced (by a new client, a new date range, or a newer load or save) is ignored, so a slow response never overwrites newer data. Unmounting retires every request in flight.
- **`heading`** adds a level-2 [Heading](layout/heading.md) above the component.
- **Every built-in string is a label.** Each component takes a `labels` prop, described below.

## Labels

Each component takes a `labels` prop with any of its keys, merged over the English defaults. Anything you leave out keeps its default. Here the strings come from vue-i18n's `$t`:

```vue
<SettingsPage
  :client="client"
  :labels="{ save: $t('ai.save'), retry: $t('ai.retry'), loading: $t('ai.loading') }"
/>
<UsageDashboard :client="client" :labels="{ live: $t('ai.live') }" />
```

The keys are typed by `SettingsPageLabels`, `UsageDashboardLabels` and `FeatureTogglesLabels`. They cover every visible string: headings, field labels, hints and placeholders, table headers, stat labels, the Retry button, loading and empty states, and the fallback error message. Each component page lists its keys and defaults:

- [FeatureToggles labels](ai/feature-toggles.md#labels)
- [SettingsPage labels](ai/settings-page.md#labels)
- [UsageDashboard labels](ai/usage-dashboard.md#labels)

## Testing with a mock client

Because the components only depend on the `AiApiClient` interface, you can pass an in-memory client in tests, stories and demos. The package doesn't export one, but it takes a few lines:

```ts
import type { AiApiClient, AiFeature } from '@artisanpack-ui/vue/ai';

export function createMockAiClient(): AiApiClient {
  let features: AiFeature[] = [
    { key: 'summarize', package: 'core', label: 'Summarize', description: null, enabled: true },
  ];

  return {
    getSettings: async () => ({
      credentials: {
        provider: 'openai',
        api_key_present: true,
        base_url: null,
        default_model: null,
      },
      feature_overrides: [],
    }),
    updateSettings: async (body) => ({
      credentials: {
        provider: body.provider,
        api_key_present: true,
        base_url: body.base_url ?? null,
        default_model: body.default_model ?? null,
      },
      feature_overrides: [],
    }),
    testConnection: async (body) => ({ result: 'ok', provider: body.provider }),
    getFeatures: async () => ({ features }),
    toggleFeature: async (key, enabled) => {
      features = features.map((f) =>
        f.key === key ? { ...f, enabled: enabled ?? !f.enabled } : f,
      );
      const { package: pkg, enabled: on } = features.find((f) => f.key === key)!;
      return { feature: { key, package: pkg, enabled: on } };
    },
    getUsage: async () => ({
      range: { from: '2026-07-01', to: '2026-07-31' },
      totals: { requests: 0, input_tokens: 0, output_tokens: 0, total_tokens: 0, cost: 0 },
      by_feature: [],
      daily: [],
    }),
  };
}
```

To test an error path, reject from a method, for example with `new AiApiError(422, { message: 'Invalid.', errors: { base_url: ['Required for Ollama.'] } }, 'Invalid.')`.

## useStreamingText

```ts
function useStreamingText(): UseStreamingTextResult;
```

Reads a streamed `fetch` response as UTF-8 text, for output such as a generation in progress. Call it inside `setup` (or another effect scope): the stream is aborted when that scope is disposed.

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

| Returns     | Type                                                 | Description                                                                                                                                                          |
| ----------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`      | `Ref<string>`                                        | The text received so far. Cleared when a stream starts.                                                                                                              |
| `streaming` | `Ref<boolean>`                                       | `true` while a stream is being read.                                                                                                                                 |
| `error`     | `Ref<Error \| null>`                                 | The error that ended the stream, or `null`. A non-2xx response or a missing body sets `Stream request failed with status {status}`. Aborts don't set it.             |
| `start`     | `(url: string, init?: RequestInit) => Promise<void>` | Starts a stream, aborting any stream already running. `init` is passed to `fetch`, and its `signal` is honored too. Resolves when the stream ends; it never rejects. |
| `stop`      | `() => void`                                         | Aborts the running stream.                                                                                                                                           |
| `reset`     | `() => void`                                         | Clears `text` and `error`.                                                                                                                                           |

Only the latest stream writes `text`, `error` and `streaming`: chunks from a stream that was replaced or aborted are dropped.

The AI package's REST API has no streaming route. Point `start()` at an endpoint of your own app that streams a response.

## Types

```ts
import type {
  AiApiClient,
  AiConnectionTestResult,
  AiCredentials,
  AiFeature,
  AiFeatureOverride,
  AiSettingsResponse,
  AiSettingsUpdate,
  AiUsageByFeature,
  AiUsageDaily,
  AiUsageResponse,
  AiUsageTotals,
  AiValidationError,
  CreateAiApiClientOptions,
  FeatureTogglesLabels,
  SettingsPageLabels,
  UsageDashboardLabels,
  UseStreamingTextResult,
} from '@artisanpack-ui/vue/ai';
```

| Type                       | Shape                                                                                                                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AiApiClient`              | The client interface: see [Client methods](#client-methods).                                                                                                                                                                                   |
| `CreateAiApiClientOptions` | `{ baseUrl: string; fetchImpl?: typeof fetch; headers?: Record<string, string> }`                                                                                                                                                              |
| `AiCredentials`            | `{ provider: string; api_key_present: boolean; base_url: string \| null; default_model: string \| null }`. Never contains the key itself.                                                                                                      |
| `AiFeatureOverride`        | `{ feature_key: string; package: string; model: string \| null; instructions: string \| null }`                                                                                                                                                |
| `AiSettingsResponse`       | `{ credentials: AiCredentials; feature_overrides: AiFeatureOverride[] }`, from `GET /settings`.                                                                                                                                                |
| `AiSettingsUpdate`         | `{ provider: string; api_key?: string \| null; base_url?: string \| null; default_model?: string \| null; feature_overrides?: Pick<AiFeatureOverride, 'feature_key' \| 'model' \| 'instructions'>[] }`. Omit `api_key` to keep the stored key. |
| `AiFeature`                | `{ key: string; package: string; label: string; description: string \| null; enabled: boolean }`                                                                                                                                               |
| `AiConnectionTestResult`   | `{ result: 'ok' \| 'error'; message?: string; provider?: string; model?: string \| null }`                                                                                                                                                     |
| `AiUsageTotals`            | `{ requests: number; input_tokens: number; output_tokens: number; total_tokens: number; cost: number }`                                                                                                                                        |
| `AiUsageByFeature`         | `AiUsageTotals` fields plus `feature_key: string`.                                                                                                                                                                                             |
| `AiUsageDaily`             | `AiUsageTotals` fields plus `period: string`.                                                                                                                                                                                                  |
| `AiUsageResponse`          | `{ range: { from: string; to: string }; totals: AiUsageTotals; by_feature: AiUsageByFeature[]; daily: AiUsageDaily[] }`                                                                                                                        |
| `AiValidationError`        | `{ message: string; errors: Record<string, string[]> }`, the body of a 422 response.                                                                                                                                                           |
| `UseStreamingTextResult`   | The return value of [`useStreamingText`](#usestreamingtext).                                                                                                                                                                                   |
| `FeatureTogglesLabels`     | [FeatureToggles labels](ai/feature-toggles.md#labels).                                                                                                                                                                                         |
| `SettingsPageLabels`       | [SettingsPage labels](ai/settings-page.md#labels).                                                                                                                                                                                             |
| `UsageDashboardLabels`     | [UsageDashboard labels](ai/usage-dashboard.md#labels).                                                                                                                                                                                         |

`AiApiError` is a class, so it's a value export; see [AiApiError](#aiapierror).
