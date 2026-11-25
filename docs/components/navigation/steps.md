---
title: Steps
menu_order: 70
meta_description: The Vue Steps component. Progress through a sequence from Step children or data, with v-model, error steps and clickable completed steps.
---

# Steps

Shows progress through a sequence, such as a checkout or an onboarding flow. It renders an ordered list of steps, each with a marker, a title, a connector and an optional description. Steps before the current one are complete and steps after it are upcoming.

```ts
import { Step, Steps } from '@artisanpack-ui/vue/navigation';
// or
import { Step, Steps } from '@artisanpack-ui/vue';
```

## Usage

```vue
<script setup lang="ts">
import { Step, Steps } from '@artisanpack-ui/vue/navigation';
</script>

<template>
  <Steps :model-value="3" label="Listing progress">
    <Step title="Basics" description="Title and type" />
    <Step title="Location" description="Address and map" />
    <Step title="Pricing" description="Price and rent" />
    <Step title="Photos" description="At least 6" />
    <Step title="Review" description="Publish" />
  </Steps>
</template>
```

`modelValue` is the current step, counted from 1. Each `Step` is numbered by its position. Without `modelValue`, every step is upcoming.

### Steps from data

`steps` renders the same `Step` children from data, before any in the default slot:

```vue
<template>
  <Steps
    :model-value="2"
    :steps="[{ title: 'Cart' }, { title: 'Shipping' }, { title: 'Payment' }, { title: 'Confirm' }]"
  />
</template>
```

### Error and custom states

A step's `state` overrides the state worked out from `modelValue`. An `error` step shows an `x` marker and hidden "Error" text. `icon` replaces the marker's number or check with any registry icon.

```vue
<template>
  <Steps :model-value="3" orientation="vertical">
    <Step title="Account created" description="Nov 2 · Olivia Rhye" />
    <Step title="Identity verified" description="Nov 3" />
    <Step
      state="error"
      title="Payout account"
      description="IBAN rejected by the bank. Update it to continue."
    />
    <Step title="Go live" description="Listings become public" />
  </Steps>
</template>
```

### Vertical

`orientation="vertical"` lays the steps out in a column, with room for longer descriptions.

### Going back to a completed step

With `clickable`, the titles of completed steps become buttons. Choosing one emits `update:modelValue` with its number, so bind `v-model`:

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Steps } from '@artisanpack-ui/vue/navigation';

const step = ref(3);
</script>

<template>
  <Steps
    v-model="step"
    clickable
    label="Checkout progress"
    :steps="[{ title: 'Cart' }, { title: 'Shipping' }, { title: 'Payment' }, { title: 'Confirm' }]"
  />
</template>
```

Steps is controlled: it shows the `modelValue` you pass. Upcoming steps can't be chosen.

## Props

| Prop            | Type                                 | Default                   | Description                                                                            |
| --------------- | ------------------------------------ | ------------------------- | -------------------------------------------------------------------------------------- |
| `steps`         | `StepItem[]`                         | —                         | The steps as data, rendering the same children as composition, before the slot.        |
| `modelValue`    | `number`                             | —                         | The current step, from 1 (`v-model`). Steps before it are complete, after it upcoming. |
| `orientation`   | `'horizontal' \| 'vertical'`         | `'horizontal'`            | A row, or a column with room for longer descriptions. Emitted as `data-orientation`.   |
| `clickable`     | `boolean`                            | `false`                   | Completed steps' titles become buttons that set the value.                             |
| `label`         | `string`                             | —                         | The list's accessible name.                                                            |
| `completeLabel` | `string`                             | `'Completed'`, translated | Hidden text in a complete step's marker.                                               |
| `errorLabel`    | `string`                             | `'Error'`, translated     | Hidden text in an error step's marker.                                                 |
| `classes`       | `Partial<Record<StepsPart, string>>` | —                         | Extra classes per [part](#parts), its steps' parts included.                           |

Each `StepItem` takes `title` (required), `description`, `state` and `icon`, like the [Step props](#step-props).

`class`, `style` and every other attribute go to the root `<ol>`.

## v-model

| Binding   | Type     | Description                                                                            |
| --------- | -------- | -------------------------------------------------------------------------------------- |
| `v-model` | `number` | The current step. Updated only when `clickable` is set and a completed step is chosen. |

## Slots

| Slot      | Description                              |
| --------- | ---------------------------------------- |
| `default` | `Step` children, rendered after `steps`. |

## Events

| Event                | Payload         | Description                                    |
| -------------------- | --------------- | ---------------------------------------------- |
| `@update:modelValue` | `value: number` | A completed step was chosen, with `clickable`. |

## Parts

Pass extra classes to a part with the Steps' `classes`; they apply to that part in every step. Every part except `root` carries a `data-part` attribute you can also target in CSS.

| Part          | Element            | Description                                                             |
| ------------- | ------------------ | ----------------------------------------------------------------------- |
| `root`        | `ol`               | The list, `.apui-steps`.                                                |
| `step`        | `li`               | One step, with `data-state`. The current one has `aria-current="step"`. |
| `marker`      | `span`             | The number, check, `x` or icon, with the hidden state text.             |
| `title`       | `span` or `button` | The step's name. A button on completed steps when `clickable`.          |
| `connector`   | `span`             | The line to the next step. `aria-hidden`.                               |
| `description` | `span`             | The supporting text. Only rendered when set.                            |

## Step

One step of a `Steps`. It reads the current value, `clickable` and labels from its parent.

### Step props

| Prop          | Type                                               | Default | Description                                                                            |
| ------------- | -------------------------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `title`       | `string`                                           | —       | The step's name. The default slot overrides it.                                        |
| `description` | `string`                                           | —       | Supporting text under the title.                                                       |
| `state`       | `'complete' \| 'current' \| 'upcoming' \| 'error'` | —       | The step's own state. Without it, the parent's value decides. Emitted as `data-state`. |
| `icon`        | `string`                                           | —       | An icon name that replaces the marker's number, check or `x`.                          |
| `step`        | `number`                                           | `1`     | The step's number. Steps sets it from the step's position; a value you set wins.       |

`class`, `style` and every other attribute go to the step's `<li>`.

### Step slots

| Slot      | Description                          |
| --------- | ------------------------------------ |
| `default` | The title content. Replaces `title`. |

Step has no events of its own.

## Types

```ts
import type {
  StepItem,
  StepProps,
  StepsOrientation,
  StepsPart,
  StepsProps,
  StepState,
} from '@artisanpack-ui/vue/navigation';
```

| Type               | Description                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `StepsProps`       | The Steps' props.                                                                                  |
| `StepProps`        | Step's props.                                                                                      |
| `StepItem`         | One entry of `steps`: `{ title: string; description?: string; state?: StepState; icon?: string }`. |
| `StepState`        | `'complete' \| 'current' \| 'upcoming' \| 'error'`                                                 |
| `StepsOrientation` | `'horizontal' \| 'vertical'`                                                                       |
| `StepsPart`        | `'root' \| 'step' \| 'marker' \| 'title' \| 'connector' \| 'description'`                          |

## Accessibility

| Keys              | Action                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `Tab`             | Moves through the completed steps' buttons, when `clickable`. Otherwise Steps has no stops. |
| `Enter` / `Space` | Goes back to the focused completed step.                                                    |

- An ordered list, so the count and position are announced. Name it with `label`.
- The current step has `aria-current="step"`.
- Complete and error steps carry visually hidden text (`completeLabel`, `errorLabel`), not only an icon.
- Markers and connectors meet 3:1 against the surface; titles and descriptions 4.5:1.
- Only completed steps are buttons when `clickable`. Upcoming steps can't be reached.
- Buttons show a visible focus ring on `:focus-visible`.

## Related

- [Steps in the design system](https://docs.artisanpackui.dev/documentation/design-system/components/steps): anatomy, tokens and live examples.
- [Progress](../display/progress.md) for progress without named steps.
- [Timeline](../display/timeline.md) for a history of events.
