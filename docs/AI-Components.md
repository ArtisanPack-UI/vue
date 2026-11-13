# AI Components

Vue 3 components + composables for consuming the [`artisanpack-ui/ai`](https://github.com/ArtisanPack-UI/ai) JSON API. Shipped as the `@artisanpack-ui/vue/ai` subpath in 1.0.1.

The subpath gives Laravel apps a drop-in replacement for the Livewire admin surfaces (Settings page, Usage dashboard, Feature toggles) so Vue starter kits don't have to depend on Livewire.

## Installation

`@artisanpack-ui/vue/ai` ships inside `@artisanpack-ui/vue` — no extra install needed:

```bash
npm install @artisanpack-ui/vue
```

The subpath is optional. If you never import from `@artisanpack-ui/vue/ai`, none of these components are pulled into your bundle.

## Quick start

```vue
<script setup lang="ts">
import {
  createAiApiClient,
  SettingsPage,
  UsageDashboard,
  FeatureToggles,
} from '@artisanpack-ui/vue/ai';

const client = createAiApiClient({
  baseUrl: '/api/artisanpack-ai',
  headers: {
    'X-CSRF-TOKEN':
      document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
  },
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <SettingsPage :client="client" heading="AI Settings" />
    <UsageDashboard :client="client" :refresh-interval="15000" heading="Usage" />
    <FeatureToggles :client="client" heading="Features" />
  </div>
</template>
```

## `createAiApiClient`

Builds a small `fetch` wrapper implementing the `AiApiClient` contract every component depends on.

```ts
const client = createAiApiClient({
  baseUrl: '/api/artisanpack-ai',
  headers: { Authorization: `Bearer ${token}` },
  fetchImpl: (input, init) => fetch(input, { ...init, credentials: 'include' }),
});
```

| Option      | Type                       | Notes                                                                                        |
|-------------|----------------------------|----------------------------------------------------------------------------------------------|
| `baseUrl`   | `string`                   | Prefix for every request. Match the ai package's route prefix (default `/api/artisanpack-ai`). |
| `headers`   | `Record<string, string>`   | Merged into every request. Use for CSRF, Sanctum bearer, or custom headers.                  |
| `fetchImpl` | `typeof fetch`             | Override the global `fetch`. Use for tests or to set `credentials: 'include'` on cross-origin Sanctum. |

Non-2xx responses reject with `AiApiError`, which exposes `.status` and the parsed `.body` — perfect for surfacing Laravel's 422 `{ message, errors }` envelope inline.

If your app has its own HTTP layer (Axios, Ky, a Sanctum-aware wrapper), implement the `AiApiClient` interface directly rather than using `createAiApiClient`. Every component depends on the interface, not on `fetch`.

## `<SettingsPage>`

Admin form backed by `GET/PUT /settings` and `POST /test-connection`. Renders provider credentials, per-feature model/instruction overrides, and a probe button that surfaces `test-connection` results inline.

```vue
<SettingsPage
  :client="client"
  heading="AI Settings"
  :providers="['openai', 'anthropic', 'ollama']"
/>
```

| Prop        | Type                      | Default                                    | Notes                                              |
|-------------|---------------------------|--------------------------------------------|----------------------------------------------------|
| `client`    | `AiApiClient`             | —                                          | Required.                                          |
| `providers` | `string[]`                | `['openai', 'anthropic', 'ollama']`        | Options rendered in the provider dropdown.         |
| `heading`   | `string`                  | —                                          | Optional heading rendered above the form.          |

Behaviour worth knowing:

- **Never emits the stored key.** The API returns `api_key_present: boolean`, not the plaintext key. The password input renders empty by default so a user can leave it blank to keep whatever's already stored.
- **Provider switch is safe.** Changing provider clears the typed key + last probe result so an OpenAI key never silently ships to an Ollama base URL.
- **422 errors render inline.** Field-level messages from the `{ errors: Record<string, string[]> }` envelope render under the offending input; a network error (or other non-422 failure) renders in the top alert with the `alert-error` styling instead of the green success one.

## `<UsageDashboard>`

Aggregated dashboard backed by `GET /usage`. Renders totals, per-feature breakdown, and daily buckets.

```vue
<UsageDashboard
  :client="client"
  from="2026-07-01"
  to="2026-07-31"
  :refresh-interval="15000"
  heading="Usage"
/>
```

| Prop              | Type          | Default | Notes                                                                                              |
|-------------------|---------------|---------|----------------------------------------------------------------------------------------------------|
| `client`          | `AiApiClient` | —       | Required.                                                                                          |
| `from`            | `string`      | —       | ISO date (`YYYY-MM-DD`). Forwarded to `/usage` as a query param.                                   |
| `to`              | `string`      | —       | ISO date (`YYYY-MM-DD`). Forwarded to `/usage` as a query param.                                   |
| `refreshInterval` | `number`      | `0`     | Poll interval in milliseconds. `0` disables polling. `15000` matches the Livewire dashboard cadence.|
| `heading`         | `string`      | —       | Optional heading rendered above the dashboard.                                                     |

Behaviour worth knowing:

- **Sequence-guarded polling.** Every fetch increments an internal request counter; only the most recent response updates state. Under slow networks (`fetch` latency > `refreshInterval`), a stale response can't overwrite a fresher one.
- **Watches `from`/`to` prop changes.** Wire the dashboard up to a date-range picker and it reloads automatically on every range change.

## `<FeatureToggles>`

Per-feature enable/disable list backed by `GET /features` and `POST /features/{key}/toggle`. Each row optimistically flips its own switch and rolls back on API failure.

```vue
<FeatureToggles
  :client="client"
  heading="Features"
  @toggle="handleToggle"
/>
```

| Prop / Event   | Type                                                                | Notes                                                                          |
|----------------|---------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `client`       | `AiApiClient`                                                       | Required.                                                                      |
| `heading`      | `string`                                                            | Optional heading — kept visible in loading, empty, and error states.           |
| `@toggle`      | `(feature: { key; package; enabled }) => void`                      | Emitted after a successful toggle. Not emitted on rollback.                    |

Behaviour worth knowing:

- **Optimistic + reversible.** The switch flips immediately; only if the POST rejects does the row roll back and surface an error banner. A subsequent successful toggle clears the banner.
- **Empty state keeps context.** When no features are registered, the heading still renders above the "No AI features registered." message.

## `useStreamingText`

Composable for consuming a long-running `fetch` response body as a UTF-8 text stream — useful for the AI usage dashboard's long-running agent-output surface, chain-of-thought output, or any streamed generation.

```vue
<script setup lang="ts">
import { useStreamingText } from '@artisanpack-ui/vue/ai';

const props = defineProps<{ agentUrl: string }>();
const { text, streaming, error, start, stop, reset } = useStreamingText();
</script>

<template>
  <div>
    <button :disabled="streaming" @click="start(props.agentUrl)">Run</button>
    <button :disabled="!streaming" @click="stop">Stop</button>
    <button @click="reset">Clear</button>
    <pre>{{ text }}<span v-if="streaming">…</span></pre>
    <span v-if="error" role="alert">{{ error.message }}</span>
  </div>
</template>
```

The composable uses the browser Streams API + an `AbortController`. It aborts the in-flight stream automatically when the calling scope is disposed, and rapidly re-calling `start()` cleanly cancels the previous stream without a race — a stale finally block will never flip `streaming` back to `false` while a newer stream is still reading.

> **Note:** `useStreamingText` is a client-side consumer, not a wire protocol. The `artisanpack-ui/ai` package's public REST surface does not include a streaming route — you point the composable at whatever URL your own app exposes (e.g. a custom controller that returns a `StreamedResponse`).

## Exported types

Every wire-level type mirrors the ai package's OpenAPI schema:

- `AiApiClient`, `AiApiError`
- `AiCredentials`, `AiSettingsResponse`, `AiSettingsUpdate`, `AiFeatureOverride`
- `AiFeature`
- `AiConnectionTestResult`
- `AiUsageResponse`, `AiUsageTotals`, `AiUsageByFeature`, `AiUsageDaily`
- `AiValidationError`

Import them from `@artisanpack-ui/vue/ai` if you write your own client or components.

## Related

- [artisanpack-ui/ai](https://github.com/ArtisanPack-UI/ai) — the Laravel package that ships the REST endpoints
- [artisanpack-ui/react](https://github.com/ArtisanPack-UI/react) — React port of the same surface
