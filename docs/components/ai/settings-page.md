---
title: SettingsPage
menu_order: 20
meta_description: The Vue SettingsPage component for artisanpack-ui/ai. The provider credentials and per-feature overrides form, with every prop and label.
---

# SettingsPage

The credentials and per-feature overrides form for the [`artisanpack-ui/ai`](https://github.com/ArtisanPack-UI/ai) package, backed by `GET /settings`, `PUT /settings` and `POST /test-connection`. It renders a [Form](../form/form-component.md) with a provider [Select](../form/select.md), an API key [Password](../form/password.md) field, a base URL and default model, a Test connection button and, when the API returns any, a model and instructions per feature.

```ts
import { SettingsPage } from '@artisanpack-ui/vue/ai';
```

SettingsPage is only exported from the `/ai` subpath.

## Usage

```vue
<script setup lang="ts">
import { SettingsPage, createAiApiClient } from '@artisanpack-ui/vue/ai';

const client = createAiApiClient({
  baseUrl: '/api/artisanpack-ai',
  headers: {
    'X-CSRF-TOKEN':
      document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
  },
});
</script>

<template>
  <SettingsPage :client="client" heading="AI settings" />
</template>
```

See [createAiApiClient](../ai.md#createaiapiclient) for the client options.

### Providers

`providers` sets the options in the provider dropdown. The values are sent to the API as is.

```vue
<template>
  <SettingsPage :client="client" :providers="['openai', 'anthropic', 'ollama', 'mistral']" />
</template>
```

### Behavior

- **Load errors can be retried.** While the settings load, a small [Loading](../feedback/loading.md) shows. If they can't be loaded, the form isn't shown with empty values: an error [Alert](../feedback/alert.md) titled with the `loadError` label explains it, with a Retry button that loads them again. The `heading` only shows with the form.
- **The stored key is never shown.** The API only reports whether a key is stored (`api_key_present`). The API key field starts empty, and saving it empty keeps the stored key, because an empty key is left out of the request.
- **Ollama takes a base URL instead.** With the `ollama` provider, the API key field is hidden and the base URL becomes required.
- **Changing the provider clears the typed key** and the last connection test, so a key is never sent to the wrong provider.
- **Test connection** checks the credentials as typed, without saving. The result shows in a status line beside the button: the API's message, or the `testOk` / `testFailed` label. Editing a credential clears the result, and a result for credentials that have since changed is discarded.
- **Saving** sends the credentials and every override, disables the fieldsets while it runs, refills the form from the response and shows the `saved` label in a success Alert.
- **Validation errors** from a 422 response appear under their fields (`provider`, `api_key`, `base_url`, `default_model`), with the message in an Alert above the form. The form only recognizes them on an `AiApiError` with status 422; see [Errors](../ai.md#errors).
- **Per-feature overrides** (a model and instructions per feature) appear when the API returns any. Clearing a field sends `null`, which means "inherit the default".
- **Changing `client` reloads** the settings and discards any save or test still running.

## Props

| Prop        | Type                          | Default                             | Description                                                                                     |
| ----------- | ----------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| `client`    | `AiApiClient`                 | —                                   | The API client, usually from `createAiApiClient()`. Required. Changing it reloads the settings. |
| `providers` | `string[]`                    | `['openai', 'anthropic', 'ollama']` | The provider options.                                                                           |
| `heading`   | `string`                      | —                                   | A level-2 heading above the form.                                                               |
| `labels`    | `Partial<SettingsPageLabels>` | —                                   | The built-in text, merged over the defaults. See [Labels](#labels).                             |

SettingsPage inherits attributes. `class`, `style` and other attributes go to whichever root is showing: the Loading, the load error Alert, or the Form, which carries `data-testid="ai-settings-page"`.

## Labels

| Key                       | Default                                 | Description                                                                                                                                                                                  |
| ------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading`                 | `'Loading AI settings…'`                | Shown while the settings load.                                                                                                                                                               |
| `loadError`               | `"The AI settings couldn't be loaded."` | The title of the Alert when the settings can't be loaded.                                                                                                                                    |
| `retry`                   | `'Retry'`                               | The button that loads the settings again.                                                                                                                                                    |
| `saved`                   | `'Settings saved.'`                     | The status after a save.                                                                                                                                                                     |
| `credentials`             | `'Credentials'`                         | The credentials fieldset's title.                                                                                                                                                            |
| `provider`                | `'Provider'`                            | The provider field's label.                                                                                                                                                                  |
| `apiKey`                  | `'API key'`                             | The API key field's label.                                                                                                                                                                   |
| `apiKeyKeepHint`          | `'Leave blank to keep the stored key.'` | The API key's hint when a key is stored.                                                                                                                                                     |
| `apiKeyPlaceholder`       | `'sk-…'`                                | The API key's placeholder when no key is stored. A stored key shows `••••••••`.                                                                                                              |
| `apiKeyReveal`            | `'Show password'`                       | The API key field's reveal button's name. Optional in the type, so complete label objects written for 2.0 still type-check; when you leave it out, the button keeps Password's default name. |
| `baseUrl`                 | `'Base URL'`                            | The base URL field's label.                                                                                                                                                                  |
| `baseUrlRequiredHint`     | `'Required for Ollama.'`                | The base URL's hint for Ollama.                                                                                                                                                              |
| `baseUrlOptionalHint`     | `'Optional.'`                           | The base URL's hint for the other providers.                                                                                                                                                 |
| `defaultModel`            | `'Default model'`                       | The default model field's label.                                                                                                                                                             |
| `defaultModelPlaceholder` | `'gpt-4o-mini'`                         | The default model's placeholder.                                                                                                                                                             |
| `testConnection`          | `'Test connection'`                     | The test button.                                                                                                                                                                             |
| `testOk`                  | `'OK'`                                  | The test result when the API sends no message and the test passed.                                                                                                                           |
| `testFailed`              | `'Failed'`                              | The test result when the API sends no message and the test failed.                                                                                                                           |
| `overrides`               | `'Per-feature overrides'`               | The overrides fieldset's title.                                                                                                                                                              |
| `model`                   | `'Model'`                               | An override's model field.                                                                                                                                                                   |
| `modelPlaceholder`        | `'inherit default'`                     | An override's model placeholder.                                                                                                                                                             |
| `instructions`            | `'Instructions'`                        | An override's instructions field.                                                                                                                                                            |
| `save`                    | `'Save settings'`                       | The submit button.                                                                                                                                                                           |
| `genericError`            | `'Something went wrong.'`               | Shown when a request fails without a message.                                                                                                                                                |

The base URL placeholders (`http://localhost:11434` for Ollama, `https://api.example.com/v1` otherwise) aren't labels.

## Slots

SettingsPage has no slots.

## Events

SettingsPage has no events. It saves through `client.updateSettings()`; wrap the client if you need to react to a save.

## Parts

SettingsPage has no `classes` prop or parts of its own. It's composed from Form, Fieldset, Select, Password, Input, Textarea, Button, Card, Stack, Text, Heading, Alert and Loading, so target those components' parts in CSS, scoped under `[data-testid="ai-settings-page"]` or a class you pass.

## Types

```ts
import type {
  AiApiClient,
  AiConnectionTestResult,
  AiSettingsResponse,
  AiSettingsUpdate,
  SettingsPageLabels,
} from '@artisanpack-ui/vue/ai';
```

| Type                     | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `SettingsPageLabels`     | The label keys above. Every key is required except `apiKeyReveal`.   |
| `AiSettingsResponse`     | What `GET` and `PUT /settings` return.                               |
| `AiSettingsUpdate`       | What the form sends to `PUT /settings`.                              |
| `AiConnectionTestResult` | What `POST /test-connection` returns.                                |
| `AiApiClient`            | The client interface. See [Client methods](../ai.md#client-methods). |

See [Types](../ai.md#types) for their shapes. The props interface isn't exported.

## Accessibility

| Keys    | Action                                |
| ------- | ------------------------------------- |
| `Tab`   | Moves through the fields and buttons. |
| `Enter` | In a text field, submits the form.    |

- Every field has a visible label from `labels`, and validation errors are linked to their fields.
- The API key field uses `autocomplete="new-password"`, so browsers don't fill in a saved password. Its reveal button is named by `apiKeyReveal`.
- The connection test result is a `role="status"` line, so screen readers announce it.
- Save and load errors appear in an Alert with `role="alert"`; the saved message in an Alert with `role="status"`.
- The fieldsets are disabled while saving, and the buttons show a loading state.

## Related

- [AI Components](../ai.md) for the client, errors and labels.
- [FeatureToggles](feature-toggles.md) for turning features on and off.
- [UsageDashboard](usage-dashboard.md) for usage and cost.
- [Password](../form/password.md), the API key field.
