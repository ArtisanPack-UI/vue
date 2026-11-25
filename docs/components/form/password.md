---
title: Password
menu_order: 120
meta_description: The Vue Password component. A password field with a reveal button, strength meter and live requirements, with every prop, slot and part.
---

# Password

A password field in the same anatomy as [Input](input.md): a label, a box with an optional leading icon, a reveal button, hint and error text. It can also show a strength meter and a list of requirements that are checked as people type. Use it for sign-in, sign-up and password reset forms.

```ts
import { Password } from '@artisanpack-ui/vue/form';
// or
import { Password } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Password } from '@artisanpack-ui/vue/form';

const password = ref('');
</script>

<template>
  <Password v-model="password" label="Password" leading-icon="lock" />
</template>
```

### Sign-up and reset forms

Set `autocomplete="new-password"` on forms where people choose a new password, so password managers offer to generate one. Add `strengthMeter` and `requirements` to guide them.

Each requirement has a `label` and a `pattern`, a regular expression source the value must match. Patterns run with the `u` flag. An invalid pattern always counts as not met.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Password } from '@artisanpack-ui/vue/form';
import type { PasswordRequirement } from '@artisanpack-ui/vue/form';

const newPassword = ref('');
const requirements: PasswordRequirement[] = [
  { label: 'At least 12 characters', pattern: '.{12,}' },
  { label: 'One number', pattern: '\\d' },
  { label: 'One symbol', pattern: '[^A-Za-z0-9]' },
];
</script>

<template>
  <Password
    v-model="newPassword"
    label="New password"
    autocomplete="new-password"
    strength-meter
    :requirements="requirements"
  />
</template>
```

The requirements only guide people. Validate the password again on the server.

### Strength meter

The meter has four segments and a level name: Weak, Fair, Good or Strong. The score gives one point each for 8 or more characters, 12 or more characters, mixed case, a digit and a symbol. The level is the points minus one, clamped to 1 through 4. An empty value is level 0 and shows no level name. Every stack scores the same way.

### Reveal button

The reveal button switches the control between `type="password"` and `type="text"`. Its accessible name stays the same and `aria-pressed` carries the state, so screen readers announce "Show password, pressed" rather than a label that changes. Set the name with `revealLabel`. It defaults to the translated "Show password".

```vue
<template>
  <Password v-model="apiKey" label="API key" reveal-label="Show API key" />
</template>
```

The AI [SettingsPage](../ai/settings-page.md) passes its `apiKeyReveal` label through to this prop.

### Translating the built-in text

`labels` overrides the strength meter and requirement text. Keys you leave out keep their translated defaults.

```vue
<template>
  <Password
    v-model="password"
    label="Contraseña"
    reveal-label="Mostrar contraseña"
    strength-meter
    :labels="{
      strength: 'Seguridad',
      weak: 'Débil',
      fair: 'Regular',
      good: 'Buena',
      strong: 'Fuerte',
    }"
  />
</template>
```

### Hint, error and states

```vue
<template>
  <Password v-model="password" label="Password" hint="Use the password you signed up with." />
  <Password v-model="password" label="Password" error="The password is incorrect." />
  <Password v-model="password" label="Password" disabled />
  <Password v-model="password" label="Password" size="sm" />
</template>
```

## Props

| Prop            | Type                                    | Default                       | Description                                                                                                       |
| --------------- | --------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `modelValue`    | `string`                                | —                             | The value, bound with `v-model`.                                                                                  |
| `size`          | `'sm' \| 'md' \| 'lg'`                  | `'md'`                        | Control height. Emitted as `data-size`.                                                                           |
| `autocomplete`  | `'current-password' \| 'new-password'`  | `'current-password'`          | The autocomplete hint. Use `new-password` on sign-up and reset forms.                                             |
| `label`         | `string`                                | —                             | The visible label, linked to the control. Without it, pass an `aria-label`.                                       |
| `hint`          | `string`                                | —                             | Help text under the box, linked with `aria-describedby`.                                                          |
| `error`         | `string`                                | —                             | Validation message. Marks the field invalid and is linked with `aria-describedby`.                                |
| `invalid`       | `boolean`                               | `false`                       | Marks the field invalid without a message.                                                                        |
| `disabled`      | `boolean`                               | `false`                       | Disables the control and the reveal button.                                                                       |
| `readonly`      | `boolean`                               | `false`                       | Makes the control read-only. It stays focusable.                                                                  |
| `required`      | `boolean`                               | `false`                       | Marks the field required and shows the required mark.                                                             |
| `placeholder`   | `string`                                | —                             | Placeholder text. Never a replacement for the label.                                                              |
| `leadingIcon`   | `string`                                | —                             | Icon name before the value, such as `lock`. The `icon` slot overrides it.                                         |
| `strengthMeter` | `boolean`                               | `false`                       | Shows the strength meter and its level name.                                                                      |
| `requirements`  | `PasswordRequirement[]`                 | —                             | Rules shown under the box and checked as people type.                                                             |
| `revealLabel`   | `string`                                | `'Show password'`, translated | The reveal button's accessible name. It doesn't change when the value is shown; `aria-pressed` carries the state. |
| `labels`        | `Partial<PasswordLabels>`               | —                             | Built-in text for the meter and requirement states. Keys you leave out keep their translated defaults.            |
| `classes`       | `Partial<Record<PasswordPart, string>>` | —                             | Extra classes per [part](#parts), such as `{ box: 'shadow-sm' }`.                                                 |

Password sets `inheritAttrs: false`. `class` goes to the root. Every other attribute, including `id`, `name`, `aria-*` and listeners such as `@blur`, goes to the native `<input>`. An `id` you pass replaces the generated one, and an `aria-describedby` you pass is added after the hint, requirements and error ids.

## v-model

| Binding   | Type     | Carries                            |
| --------- | -------- | ---------------------------------- |
| `v-model` | `string` | The current value, on every input. |

Without `v-model`, Password keeps its own value, so the meter and requirements still update as people type.

## Slots

| Slot   | Description                                                                        |
| ------ | ---------------------------------------------------------------------------------- |
| `icon` | Replaces the icon from `leadingIcon`. Rendered inside the `aria-hidden` icon part. |

## Events

| Event                | Payload  | Description        |
| -------------------- | -------- | ------------------ |
| `@update:modelValue` | `string` | The value changed. |

Other listeners, such as `@blur` and `@keydown`, fall through to the native `<input>`.

## Parts

Pass extra classes to a part with `classes`. The root carries the component's `.apui-*` class and the other parts carry a `data-part` attribute, so you can also target them in CSS.

| Part            | Element  | Description                                                                                            |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------ |
| `root`          | `div`    | The field, `.apui-password`. Carries `data-size`, `data-invalid`, `data-disabled` and `data-readonly`. |
| `label`         | `label`  | The visible label.                                                                                     |
| `required`      | `span`   | The required mark. `aria-hidden`.                                                                      |
| `box`           | `div`    | The bordered box around the icon, control and reveal button.                                           |
| `icon`          | `span`   | The leading icon. `aria-hidden`.                                                                       |
| `control`       | `input`  | The native input.                                                                                      |
| `reveal`        | `button` | The reveal toggle, with `aria-pressed` and `aria-controls`.                                            |
| `strength`      | `div`    | The meter. `aria-hidden`, with `data-level` from `0` to `4`.                                           |
| `segment`       | `span`   | One of the meter's four segments.                                                                      |
| `strengthLabel` | `div`    | The "Strength" text and the level name in a polite live region.                                        |
| `requirements`  | `ul`     | The requirement list, linked to the control with `aria-describedby`.                                   |
| `requirement`   | `li`     | One requirement. Carries `data-met` when the value matches.                                            |
| `hint`          | `p`      | The hint text.                                                                                         |
| `error`         | `p`      | The error text with its icon.                                                                          |

## Types

```ts
import type {
  PasswordEmits,
  PasswordLabels,
  PasswordPart,
  PasswordProps,
  PasswordRequirement,
  PasswordSize,
} from '@artisanpack-ui/vue/form';
```

| Type                  | Description                                                                         |
| --------------------- | ----------------------------------------------------------------------------------- |
| `PasswordProps`       | The component's props.                                                              |
| `PasswordEmits`       | The component's events.                                                             |
| `PasswordSize`        | `'sm' \| 'md' \| 'lg'`                                                              |
| `PasswordRequirement` | `{ label: string; pattern: string }`                                                |
| `PasswordLabels`      | The built-in text: `strength`, `weak`, `fair`, `good`, `strong`, `met` and `unmet`. |
| `PasswordPart`        | The part names in the [Parts](#parts) table.                                        |

## Accessibility

| Keys              | Action                                                 |
| ----------------- | ------------------------------------------------------ |
| `Tab`             | Moves focus to the control, then to the reveal button. |
| `Enter` / `Space` | On the reveal button: shows or hides the value.        |

- Give every Password a visible `label`, or an `aria-label` when the context names it. A placeholder never replaces the label.
- The reveal button keeps one name and toggles `aria-pressed`. Translate the name with `revealLabel`.
- The meter is `aria-hidden`. The level name is text in a polite live region, so strength is never shown by color alone.
- Each requirement says whether it is met in visually hidden text ("Met" or "Not met"), not only with the check or cross icon.
- The hint, requirements and error are linked to the control with `aria-describedby`. An error or `invalid` sets `aria-invalid="true"`.
- Password never blocks paste, so password managers work.
- Shows a visible focus ring on the box while the control has `:focus-visible`, and on the reveal button.

## Related

- [Password in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/password): anatomy, tokens and live examples.
- [Input](input.md) for other single-line text.
- [Pin](pin.md) for one-time codes.
- [Form](form-component.md) for submit handling and validation.
