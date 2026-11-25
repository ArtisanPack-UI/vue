---
title: FeatureToggles
menu_order: 10
meta_description: The Vue FeatureToggles component for artisanpack-ui/ai. A switch per registered AI feature, saved optimistically, with every prop, label and event.
---

# FeatureToggles

A switch per registered AI feature, backed by `GET /features` and `POST /features/{key}/toggle` of the [`artisanpack-ui/ai`](https://github.com/ArtisanPack-UI/ai) API. Each feature renders as a [Card](../layout/card.md) with a [Toggle](../form/toggle.md), its description, and its package and key in the footer. Use it on an admin settings page to turn AI features on and off.

```ts
import { FeatureToggles } from '@artisanpack-ui/vue/ai';
```

FeatureToggles is only exported from the `/ai` subpath.

## Usage

```vue
<script setup lang="ts">
import { FeatureToggles, createAiApiClient } from '@artisanpack-ui/vue/ai';

const client = createAiApiClient({ baseUrl: '/api/artisanpack-ai' });
</script>

<template>
  <FeatureToggles :client="client" heading="Features" />
</template>
```

See [createAiApiClient](../ai.md#createaiapiclient) for the client options.

### Reacting to a toggle

`toggle` is emitted after the server has saved a change, with the feature as the server returned it.

```vue
<script setup lang="ts">
import { FeatureToggles, createAiApiClient, type AiFeature } from '@artisanpack-ui/vue/ai';
import { toast } from '@artisanpack-ui/vue/feedback';

const client = createAiApiClient({ baseUrl: '/api/artisanpack-ai' });

function onToggle(feature: Pick<AiFeature, 'key' | 'package' | 'enabled'>): void {
  toast.create({
    title: `${feature.key} ${feature.enabled ? 'enabled' : 'disabled'}`,
    color: 'success',
  });
}
</script>

<template>
  <FeatureToggles :client="client" @toggle="onToggle" />
</template>
```

### Behavior

- **Loading.** While the features load, a small [Loading](../feedback/loading.md) shows the `loading` label. If the load fails, an error [Alert](../feedback/alert.md) shows instead.
- **Empty.** When no features are registered, an [EmptyState](../feedback/empty-state.md) shows the `empty` label.
- **Switches flip at once** and are disabled while their request runs. If the request fails, the switch flips back and an error Alert explains why; the next successful toggle clears it.
- **`toggle` follows the save.** It isn't emitted when a toggle fails. An error thrown by your listener doesn't roll the switch back, because the change was already saved.
- **Changing `client` reloads** the list, and responses to the previous client are ignored.

## Props

| Prop      | Type                            | Default | Description                                                                                     |
| --------- | ------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| `client`  | `AiApiClient`                   | —       | The API client, usually from `createAiApiClient()`. Required. Changing it reloads the features. |
| `heading` | `string`                        | —       | A level-2 heading above the list.                                                               |
| `labels`  | `Partial<FeatureTogglesLabels>` | —       | The built-in text, merged over the defaults. See [Labels](#labels).                             |

FeatureToggles inherits attributes: `class`, `style` and other attributes go to its root [Stack](../layout/stack.md), which carries `data-testid="ai-feature-toggles"`.

## Labels

| Key            | Default                        | Description                                   |
| -------------- | ------------------------------ | --------------------------------------------- |
| `loading`      | `'Loading features…'`          | Shown while the features load.                |
| `empty`        | `'No AI features registered.'` | The empty state's title.                      |
| `genericError` | `'Something went wrong.'`      | Shown when a request fails without a message. |

## Slots

FeatureToggles has no slots.

## Events

| Event     | Payload                                                     | Description                                                               |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `@toggle` | `feature: Pick<AiFeature, 'key' \| 'package' \| 'enabled'>` | A switch was saved. The payload is the feature as the server returned it. |

## Parts

FeatureToggles has no `classes` prop or parts of its own. It's composed from Stack, Card, Toggle, Alert, Loading, EmptyState, Heading and Text, so target those components' parts in CSS, scoped under `[data-testid="ai-feature-toggles"]` or a class you pass.

## Types

```ts
import type { AiApiClient, AiFeature, FeatureTogglesLabels } from '@artisanpack-ui/vue/ai';
```

| Type                   | Description                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| `FeatureTogglesLabels` | `{ loading: string; empty: string; genericError: string }`                                       |
| `AiFeature`            | `{ key: string; package: string; label: string; description: string \| null; enabled: boolean }` |
| `AiApiClient`          | The client interface. See [Client methods](../ai.md#client-methods).                             |

The props interface isn't exported.

## Accessibility

| Keys    | Action                      |
| ------- | --------------------------- |
| `Tab`   | Moves between the switches. |
| `Space` | Toggles the focused switch. |

- The features are a list (`role="list"`), and each card is a list item.
- Each switch is labelled by the feature's label and described by its description.
- A switch is disabled while its request runs, so it can't be toggled twice.
- Load and toggle errors appear in an Alert with `role="alert"`.

## Related

- [AI Components](../ai.md) for the client, errors and labels.
- [SettingsPage](settings-page.md) for credentials and per-feature model overrides.
- [UsageDashboard](usage-dashboard.md) for usage per feature.
- [Toggle](../form/toggle.md), the switch each feature uses.
