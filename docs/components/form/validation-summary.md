---
title: ValidationSummary
menu_order: 220
meta_description: The Vue ValidationSummary component. Lists every form error after a failed submit, each linked to its field, as a focused alert.
---

# ValidationSummary

Lists every error in a form after a failed submit, each linked to its field. An error summary is an alert that takes focus when it appears, so keyboard and screen reader users learn what to fix. A warning summary lists recommendations as a status. It renders nothing while there are no errors. Put it at the top of the form.

```ts
import { ValidationSummary } from '@artisanpack-ui/vue/form';
// or
import { ValidationSummary } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Input, ValidationSummary } from '@artisanpack-ui/vue/form';

const email = ref('');
const name = ref('');
const errors = ref<Record<string, string[]>>({});

async function submit(): Promise<void> {
  const response = await fetch('/api/profile', {
    method: 'POST',
    body: JSON.stringify({ email: email.value, name: name.value }),
  });
  errors.value = response.ok ? {} : (await response.json()).errors;
}
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <ValidationSummary :errors="errors" />
    <Input id="name" v-model="name" label="Name" :error="errors.name?.[0]" />
    <Input id="email" v-model="email" label="Email" type="email" :error="errors.email?.[0]" />
    <Button type="submit">Save</Button>
  </form>
</template>
```

With two errors, this shows "Fix 2 fields" and a link per message. The summary takes focus when the errors first appear.

### Errors

`errors` takes a list of `{ field, message }` objects, or a map of field to message. A map value can be an array of messages, as Laravel's validation errors are, and the summary shows the first one. Entries without a message are dropped.

```vue
<template>
  <ValidationSummary
    :errors="[
      { field: 'email', message: 'Enter an email address.' },
      { field: 'password', message: 'The password must be at least 12 characters.' },
    ]"
  />
  <ValidationSummary :errors="{ email: ['Enter an email address.'], password: 'Too short.' }" />
</template>
```

`field` is the field's `id` or `name`. Each message links to `#field`. Clicking it moves focus to the element with that id, else the control with that `name`, else one bound with that `wire:model`, and scrolls it into view. If nothing matches, the link follows its `href`.

Keep each field's own inline error, with the same wording, as in the usage example.

### Warnings

`color="warning"` lists recommendations that don't block the submit. It uses `role="status"`, doesn't take focus, and its title reads "N recommendations".

```vue
<template>
  <ValidationSummary
    color="warning"
    :errors="[
      { field: 'description', message: 'Add a description so buyers can find the listing.' },
    ]"
  />
</template>
```

### Title

The title defaults to the translated "Fix N fields" for errors, or "N recommendations" for warnings, singular for one. Pass `title`, or use the `title` slot for markup.

```vue
<template>
  <ValidationSummary :errors="errors" title="Check the highlighted fields" />
  <ValidationSummary :errors="errors">
    <template #title>Your listing wasn't saved. <strong>Fix these fields:</strong></template>
  </ValidationSummary>
</template>
```

## Props

| Prop      | Type                                             | Default                                           | Description                                                                                                                   |
| --------- | ------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `errors`  | `ValidationSummaryErrors`                        | —                                                 | The errors, as `[{ field, message }]` or `{ field: message \| message[] }`. Renders nothing when empty.                       |
| `color`   | `'error' \| 'warning'`                           | `'error'`                                         | Error blocks the submit and is an alert that takes focus. Warning lists recommendations as a status. Emitted as `data-color`. |
| `title`   | `string`                                         | "Fix N fields" or "N recommendations", translated | The heading. The `title` slot overrides it.                                                                                   |
| `classes` | `Partial<Record<ValidationSummaryPart, string>>` | —                                                 | Extra classes per [part](#parts), such as `{ list: 'gap-1' }`.                                                                |

`class`, `style` and every other attribute go to the root while it renders.

## Slots

| Slot    | Description                             |
| ------- | --------------------------------------- |
| `title` | Replaces the heading text from `title`. |

## Events

ValidationSummary has no events of its own. Clicking a link moves focus to its field.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part    | Element | Description                                                                                                                          |
| ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `root`  | `div`   | The summary, `.apui-validation-summary`. `role="alert"` with `tabindex="-1"`, or `role="status"` for warnings. Carries `data-color`. |
| `icon`  | `span`  | The alert or warning icon. `aria-hidden`.                                                                                            |
| `title` | `p`     | The heading.                                                                                                                         |
| `list`  | `ul`    | The list of errors.                                                                                                                  |
| `item`  | `li`    | One error.                                                                                                                           |
| `link`  | `a`     | The message, linked to its field.                                                                                                    |

## Types

```ts
import type {
  ValidationSummaryColor,
  ValidationSummaryError,
  ValidationSummaryErrors,
  ValidationSummaryPart,
  ValidationSummaryProps,
} from '@artisanpack-ui/vue/form';
```

| Type                      | Description                                                                   |
| ------------------------- | ----------------------------------------------------------------------------- |
| `ValidationSummaryProps`  | The component's props.                                                        |
| `ValidationSummaryColor`  | `'error' \| 'warning'`                                                        |
| `ValidationSummaryError`  | `{ field: string; message: string }`                                          |
| `ValidationSummaryErrors` | `ValidationSummaryError[] \| Record<string, string \| string[] \| undefined>` |
| `ValidationSummaryPart`   | `'root' \| 'icon' \| 'title' \| 'list' \| 'item' \| 'link'`                   |

## Accessibility

ValidationSummary has no keyboard behavior of its own. Its links are native anchors.

- Render it at the top of the form after a failed submit. An error summary is `role="alert"` and takes focus (`tabindex="-1"`) when errors first appear. A warning summary is `role="status"` and doesn't take focus.
- Don't show it before the first submit.
- Each link moves focus to its field: the element with that id, else the control with that name or `wire:model`. Give your fields matching ids or names.
- Fields keep their own inline errors, with the same wording.
- Color is never the only signal: the title says how many fields to fix.

## Related

- [ValidationSummary in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/validation-summary): anatomy, tokens and live examples.
- [Form](form-component.md) for submit handling and validation.
- [Alert](../feedback/alert.md) for other messages.
- [ErrorState](../feedback/error-state.md) for a page or region that failed to load.
