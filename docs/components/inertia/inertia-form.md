---
title: InertiaForm
menu_order: 80
meta_description: The Vue InertiaForm component. An Inertia form that submits to a Laravel route and gives its errors to the field wrappers inside it.
---

# InertiaForm

Owns an Inertia form and submits it. It renders a native `<form>`, creates the form from `data` with [`useInertiaForm`](../../laravel-inertia.md#useinertiaform), and submits it to `action` with `method` when the form is submitted. The field wrappers inside it, such as [InertiaInput](inertia-input.md), show the form's validation error for their `name`. Use it for a page form that posts to a Laravel route.

```ts
import { InertiaForm } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaForm, InertiaInput, InertiaPassword } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaForm v-slot="{ form, processing }" :data="{ email: '', password: '' }" action="/login">
    <InertiaInput v-model="form.email" name="email" label="Email" type="email" />
    <InertiaPassword v-model="form.password" name="password" label="Password" />
    <Button type="submit" :loading="processing">Sign in</Button>
  </InertiaForm>
</template>
```

The default slot receives the form and its state. Bind each field to `form` with `v-model`: the wrappers read their error from the form, not their value.

### Methods

`method` defaults to `post`. Laravel routes for updates and deletes take `put`, `patch` or `delete`:

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaForm, InertiaInput } from '@artisanpack-ui/vue-laravel';

const props = defineProps<{ user: { id: number; name: string } }>();
</script>

<template>
  <InertiaForm
    v-slot="{ form, processing }"
    :data="{ name: props.user.name }"
    method="put"
    :action="`/users/${props.user.id}`"
    :options="{ resetOnSuccess: false }"
  >
    <InertiaInput v-model="form.name" name="name" label="Name" />
    <Button type="submit" :loading="processing">Save</Button>
  </InertiaForm>
</template>
```

Without `action`, submitting the form does nothing and no event fires. Call the slot's `submit(method, url, options?)` to submit somewhere else.

### Resetting after success

By default the form resets to its initial `data` after a successful submission. Pass `:options="{ resetOnSuccess: false }"` to keep the values, as on an edit form.

### Initial data

`data` and `options` are read once, when the component mounts. Changing them later doesn't reinitialize the form. To start over with new data, give the component a new `key`:

```vue
<template>
  <InertiaForm
    :key="user.id"
    v-slot="{ form }"
    :data="{ name: user.name }"
    method="put"
    :action="`/users/${user.id}`"
  >
    <!-- fields -->
  </InertiaForm>
</template>
```

### Success and error

`success` fires after a successful submission and `error` after a failed one, such as a validation failure:

```vue
<script setup lang="ts">
import { toast } from '@artisanpack-ui/vue';
import { InertiaForm } from '@artisanpack-ui/vue-laravel';
</script>

<template>
  <InertiaForm
    :data="{ email: '' }"
    action="/newsletter"
    @success="toast.create({ title: 'Subscribed', color: 'success' })"
  >
    <!-- fields -->
  </InertiaForm>
</template>
```

### Template ref

The same values the slot receives are exposed on a template ref, with the state unwrapped:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { InertiaForm } from '@artisanpack-ui/vue-laravel';

const formRef = ref<InstanceType<typeof InertiaForm> | null>(null);

function clearAll(): void {
  formRef.value?.clearErrors();
}
</script>

<template>
  <InertiaForm ref="formRef" :data="{ email: '' }" action="/newsletter">
    <!-- fields -->
  </InertiaForm>
</template>
```

## Props

| Prop      | Type                                              | Default  | Description                                                                                                                |
| --------- | ------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `data`    | `Record<string, unknown>`                         | —        | Required. The form's initial values. Read once on mount.                                                                   |
| `method`  | `'get' \| 'post' \| 'put' \| 'patch' \| 'delete'` | `'post'` | The HTTP method used on submit.                                                                                            |
| `action`  | `string`                                          | —        | The URL to submit to. Without it, submitting does nothing.                                                                 |
| `options` | `InertiaFormOptions`                              | —        | Passed to `useInertiaForm`. `{ resetOnSuccess?: boolean }`, where `resetOnSuccess` defaults to `true`. Read once on mount. |

`class`, `style` and every other attribute, such as `aria-label` or `novalidate`, go to the `<form>`.

## Slots

| Slot      | Slot props                                                                         | Description        |
| --------- | ---------------------------------------------------------------------------------- | ------------------ |
| `default` | `{ form, getError, clearErrors, processing, recentlySuccessful, isDirty, submit }` | The form's fields. |

| Slot prop            | Type                                                                                                                | Description                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `form`               | The Inertia form                                                                                                    | The form from Inertia's `useForm()`, holding the values. Bind fields to it with `v-model`.      |
| `getError`           | `(field: string) => string \| undefined`                                                                            | The field's first validation error.                                                             |
| `clearErrors`        | `(...fields: string[]) => void`                                                                                     | Clears the given fields' errors, or every error when called with none.                          |
| `processing`         | `boolean`                                                                                                           | `true` while the form is submitting.                                                            |
| `recentlySuccessful` | `boolean`                                                                                                           | `true` for a short time after a successful submission.                                          |
| `isDirty`            | `boolean`                                                                                                           | `true` when the values differ from the initial data.                                            |
| `submit`             | `(method: 'get' \| 'post' \| 'put' \| 'patch' \| 'delete', url: string, options?: Record<string, unknown>) => void` | Submits the form. `options` are Inertia visit options, such as `onSuccess` or `preserveScroll`. |

`processing`, `recentlySuccessful` and `isDirty` arrive as plain booleans that stay reactive, so `:loading="processing"` follows the submission.

## Events

| Event      | Payload | Description                                        |
| ---------- | ------- | -------------------------------------------------- |
| `@success` | —       | A submission from the form's own submit succeeded. |
| `@error`   | —       | A submission from the form's own submit failed.    |

The events only fire for submissions started by the `<form>` itself. When you call the slot's `submit`, pass `onSuccess` and `onError` in its options instead.

## Exposed

A template ref exposes `form`, `getError`, `clearErrors`, `processing`, `recentlySuccessful`, `isDirty` and `submit`, the same as the slot props.

## Parts

InertiaForm has no parts. It renders a plain `<form>` with no class of its own.

## Form context

InertiaForm provides its context to every descendant under `INERTIA_FORM_KEY`. The field wrappers inject it to read their error. Inject it yourself to build your own Inertia-aware field:

```vue
<script setup lang="ts">
import { computed, inject } from 'vue';
import { Rating } from '@artisanpack-ui/vue';
import { INERTIA_FORM_KEY } from '@artisanpack-ui/vue-laravel';

const props = defineProps<{ name: string }>();
const model = defineModel<number>();

const formContext = inject(INERTIA_FORM_KEY, null);
const error = computed(() => formContext?.getError(props.name));
</script>

<template>
  <div>
    <Rating v-model="model" :name="name" label="Rating" />
    <p v-if="error">{{ error }}</p>
  </div>
</template>
```

### INERTIA_FORM_KEY

```ts
const INERTIA_FORM_KEY: InjectionKey<InertiaFormContext>;
```

The injection key. `inject(INERTIA_FORM_KEY, null)` returns the nearest InertiaForm's context, or `null` outside one.

### InertiaFormContext

| Member        | Type                                     | Description                                           |
| ------------- | ---------------------------------------- | ----------------------------------------------------- |
| `form`        | `Record<string, unknown>`                | The Inertia form.                                     |
| `getError`    | `(field: string) => string \| undefined` | The field's first validation error.                   |
| `clearErrors` | `(...fields: string[]) => void`          | Clears the given fields' errors, or all of them.      |
| `processing`  | `ComputedRef<boolean>`                   | Whether the form is submitting. A ref: read `.value`. |

## Types

```ts
import type { InertiaFormContext, InertiaFormOptions } from '@artisanpack-ui/vue-laravel';
```

| Type                 | Description                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `InertiaFormContext` | What InertiaForm provides under `INERTIA_FORM_KEY`.                                        |
| `InertiaFormOptions` | `{ resetOnSuccess?: boolean }`, the `options` prop and `useInertiaForm`'s second argument. |

The component's props interface isn't exported.

## Accessibility

| Keys    | Action                                               |
| ------- | ---------------------------------------------------- |
| `Enter` | In a text field, submits the form (native behavior). |

- Renders a native `<form>`, so Enter submits it and the browser's validation runs unless you set `novalidate`.
- Name the form with `aria-label` or `aria-labelledby` when a page has more than one. A named form is a landmark.
- Put the submit button last and give it `type="submit"`. [Button](../form/button.md) defaults to `type="button"`.
- After a failed submit, each wrapper shows its error linked to the field. For a long form, add a [ValidationSummary](../form/validation-summary.md) at the top.

## Related

- [Form in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/form): the form pattern this follows. InertiaForm renders a plain `<form>`, not the Form component.
- [Form](../form/form-component.md) for a form without Inertia.
- [useInertiaForm](../../laravel-inertia.md#useinertiaform) for the same form without the component.
- [InertiaInput](inertia-input.md), [InertiaSelect](inertia-select.md) and the other field wrappers.
