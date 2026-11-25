---
title: Form
menu_order: 100
meta_description: The Vue Form component. A native form that stacks its fields with the field gap and ends with an actions row, with every prop, slot and part.
---

# Form

A native `<form>` that stacks its fields with the field gap and ends with an actions row aligned to the end. Because it's a real form, Enter in a field submits it and the browser's validation runs unless you set `novalidate`. Use it around any set of fields with a submit button.

```ts
import { Form } from '@artisanpack-ui/vue/form';
// or
import { Form } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Form, Input, Textarea } from '@artisanpack-ui/vue/form';

const email = ref('');
const message = ref('');

function invite(): void {
  // …
}
</script>

<template>
  <Form aria-label="Invite member" @submit.prevent="invite">
    <Input v-model="email" label="Email" type="email" required />
    <Textarea v-model="message" label="Message" :rows="3" />
    <template #actions>
      <Button variant="ghost" color="neutral">Cancel</Button>
      <Button type="submit">Send invite</Button>
    </template>
  </Form>
</template>
```

Listen for the native `submit` event; `@submit.prevent` stops the page from navigating. Put the primary action last in the actions row and make it a `type="submit"` [Button](button.md).

### Posting to the server

Without a `submit` listener, the form submits natively. Attributes such as `action` and `method` go to the `<form>`, and every field with a `name` is posted.

```vue
<template>
  <Form action="/listings" method="post">
    <Input label="Title" name="title" required />
    <template #actions>
      <Button type="submit">Create listing</Button>
    </template>
  </Form>
</template>
```

### Divided actions and validation

`divided` puts an edge above the actions row. After a failed submit, put a [ValidationSummary](validation-summary.md) at the top and keep each field's own error.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Form, Input, ValidationSummary } from '@artisanpack-ui/vue/form';

const postalCode = ref('');
const errors = ref<Record<string, string>>({});

function publish(): void {
  errors.value = /^\d{5}$/.test(postalCode.value)
    ? {}
    : { 'postal-code': 'Spanish postal codes have 5 digits.' };
}
</script>

<template>
  <Form aria-label="Listing" divided novalidate @submit.prevent="publish">
    <ValidationSummary :errors="errors" />
    <Input
      id="postal-code"
      v-model="postalCode"
      label="Postal code"
      :error="errors['postal-code']"
    />
    <template #actions>
      <Button type="submit">Publish listing</Button>
    </template>
  </Form>
</template>
```

`actions` also takes plain text, for a note at the end of the form. The `actions` slot overrides it.

## Props

| Prop      | Type                                | Default | Description                                                                                           |
| --------- | ----------------------------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| `actions` | `string`                            | —       | Text for the actions row. Use the `actions` slot for buttons.                                         |
| `divided` | `boolean`                           | `false` | Separates the actions row with an edge above it. Emitted as `data-divided`.                           |
| `classes` | `Partial<Record<FormPart, string>>` | —       | Extra classes per [part](#parts), such as `{ actions: 'justify-between' }`. Use `class` for the root. |

`class`, `style` and every other attribute, including `action`, `method`, `novalidate`, `aria-label` and listeners such as `@submit` and `@reset`, go to the `<form>`.

## Slots

| Slot      | Description                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------ |
| `default` | The fields.                                                                                      |
| `actions` | The actions row, such as Cancel and Submit buttons. Replaces `actions`. Not rendered when empty. |

## Events

Form has no events of its own. Native events such as `@submit` and `@reset` fall through to the `<form>`.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part      | Element | Description                                                             |
| --------- | ------- | ----------------------------------------------------------------------- |
| `root`    | `form`  | The form, `.apui-form`.                                                 |
| `actions` | `div`   | The actions row, aligned to the end. Only rendered when it has content. |

## Types

```ts
import type { FormPart, FormProps } from '@artisanpack-ui/vue/form';
```

| Type        | Description            |
| ----------- | ---------------------- |
| `FormProps` | The component's props. |
| `FormPart`  | `'root' \| 'actions'`  |

## Accessibility

| Keys    | Action                             |
| ------- | ---------------------------------- |
| `Enter` | In a text field, submits the form. |

- A native `<form>`, so Enter submits it and the browser's validation runs unless `novalidate` is set.
- Name the form with `aria-label` or `aria-labelledby` when a page has more than one; a named form is a landmark.
- The primary action comes last in the actions row and is a submit button.
- Put a [ValidationSummary](validation-summary.md) at the top after a failed submit, and keep each field's own error.

## Related

- [Form in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/form): anatomy, tokens and live examples.
- [Form components](../form.md) for the behavior every form field shares.
- [Fieldset](fieldset.md) to group fields into sections.
- [ValidationSummary](validation-summary.md) to list errors after a failed submit.
- [Button](button.md) for the actions.
