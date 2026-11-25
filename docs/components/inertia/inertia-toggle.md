---
title: InertiaToggle
menu_order: 170
meta_description: The Vue InertiaToggle component. The Toggle switch with its Laravel validation error bound from Inertia, bound with a plain v-model.
---

# InertiaToggle

[Toggle](../form/toggle.md) with its Laravel validation error filled in. It renders a switch, binds its on state with a plain `v-model`, and passes it the error for `name` from the surrounding [InertiaForm](inertia-form.md), or from the Inertia page's `errors`. Use it for an on-or-off setting.

```ts
import { InertiaToggle } from '@artisanpack-ui/vue-laravel';
```

## Usage

```vue
<script setup lang="ts">
import { Button } from '@artisanpack-ui/vue';
import { InertiaForm, InertiaToggle } from '@artisanpack-ui/vue-laravel';

const props = defineProps<{ settings: { public_profile: boolean } }>();
</script>

<template>
  <InertiaForm
    v-slot="{ form, processing }"
    :data="{ public_profile: props.settings.public_profile }"
    method="put"
    action="/settings/privacy"
    :options="{ resetOnSuccess: false }"
  >
    <InertiaToggle
      v-model="form.public_profile"
      name="public_profile"
      label="Public profile"
      description="Anyone can see your name and photo."
    />
    <Button type="submit" :loading="processing">Save</Button>
  </InertiaForm>
</template>
```

Bind the wrapper with `v-model`, not `v-model:checked`: the wrapper maps its `modelValue` to Toggle's `checked`.

### Saving on change

A switch usually applies at once. Submit on change with Inertia's router instead of a form:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { InertiaToggle } from '@artisanpack-ui/vue-laravel';

const props = defineProps<{ settings: { notifications: boolean } }>();
const notifications = ref(props.settings.notifications);

function save(value: boolean): void {
  router.put('/settings/notifications', { notifications: value }, { preserveScroll: true });
}
</script>

<template>
  <InertiaToggle
    v-model="notifications"
    name="notifications"
    label="Email notifications"
    @update:model-value="save"
  />
</template>
```

Outside an InertiaForm, the wrapper shows `errors.notifications` from the page props after a failed visit.

The error resolves in the same order as every wrapper: the `error` prop, then the InertiaForm's error for `name`, then the page's `errors[name]`. See [How the field wrappers work](../inertia.md#how-the-field-wrappers-work).

## Props

| Prop         | Type      | Default | Description                                                                                                    |
| ------------ | --------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `name`       | `string`  | —       | Required. The field's key in the form data and in Laravel's validation errors. Also the native input's `name`. |
| `error`      | `string`  | —       | An explicit error. Wins over the form's and the page's errors. An empty string hides the error.                |
| `modelValue` | `boolean` | —       | Whether it's on. Bind it with `v-model`. Passed to Toggle as `checked`.                                        |

### Forwarded props

Every other prop goes to [Toggle](../form/toggle.md#props): `size`, `color`, `label`, `description`, `invalid`, `disabled`, `required` and `classes`. The wrapper sets Toggle's `name`, `error` and `checked` itself.

`class`, `style` and every other attribute and listener also go to the Toggle, which puts `class` on its root and the rest on the native `<input role="switch">`.

## v-model

| Binding   | Type      | Description                                       |
| --------- | --------- | ------------------------------------------------- |
| `v-model` | `boolean` | The on state. Maps to Toggle's `v-model:checked`. |

Without `v-model`, the wrapper keeps the state itself.

## Slots

InertiaToggle has no slots.

## Events

| Event                | Payload   | Description                           |
| -------------------- | --------- | ------------------------------------- |
| `@update:modelValue` | `boolean` | The state changed. Used by `v-model`. |

Toggle's own `update:checked` is handled by the wrapper. Native listeners such as `@focus` fall through to the input.

## Parts

InertiaToggle renders Toggle's parts unchanged. Pass extra classes with `classes`; see [Toggle parts](../form/toggle.md#parts).

## Types

InertiaToggle exports no types of its own. Toggle's types come from `@artisanpack-ui/vue/form`.

## Accessibility

| Keys    | Action              |
| ------- | ------------------- |
| `Space` | Turns it on or off. |

- A native checkbox with `role="switch"` stays in the DOM, so the platform handles the keyboard and screen readers.
- Give it a `label`.
- The error from Laravel is linked to the input with `aria-describedby`.
- Use [InertiaCheckbox](inertia-checkbox.md), not a toggle, in forms that need a submit.

## Related

- [Toggle in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/toggle): anatomy, tokens and live examples.
- [Toggle](../form/toggle.md), the component this wraps.
- [InertiaCheckbox](inertia-checkbox.md).
