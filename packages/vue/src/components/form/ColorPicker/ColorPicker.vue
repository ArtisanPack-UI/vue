<script setup lang="ts">
/**
 * @module ColorPicker
 *
 * A color field whose swatch opens a popover with a saturation and
 * brightness area, hue and opacity sliders, a format select (HEX, RGB, HSL,
 * OKLCH), an eyedropper and preset swatches; the text value stays in the
 * field, always available for typing. Renders the design-system ColorPicker
 * markup contract (`.apui-color-picker`, #53) on the shared Zag
 * color-picker machine (`useColorPicker`).
 */
import { computed, getCurrentInstance, mergeProps, ref, useAttrs, useId } from 'vue';
import { COLOR_FORMATS, useColorPicker } from '@artisanpack-ui/behavior/vue';
import { DsIcon, flag, part } from '../../_shared/design-system';
import type { ColorPickerEmits, ColorPickerProps, ColorTextFormat } from './types';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ColorPickerProps>(), {
  modelValue: undefined,
  format: 'hex',
  alpha: true,
  swatches: () => [],
  size: 'md',
  label: undefined,
  hint: undefined,
  error: undefined,
  invalid: false,
  disabled: false,
  required: false,
  open: false,
  portal: true,
  triggerLabel: 'Choose a color',
  areaLabel: 'Saturation and brightness',
  hueLabel: 'Hue',
  alphaLabel: 'Opacity',
  formatLabel: 'Format',
  eyeDropperLabel: 'Pick a color from the screen',
  swatchesLabel: 'Swatches',
  classes: undefined,
});

const emit = defineEmits<ColorPickerEmits>();

const FORMAT_NAMES: Record<ColorTextFormat, string> = {
  hex: 'HEX',
  rgb: 'RGB',
  hsl: 'HSL',
  oklch: 'OKLCH',
};

const attrs = useAttrs();
const instance = getCurrentInstance();
const autoId = useId();

/** Whether the parent passes a prop (`v-model` or `:prop`): then it's controlled. */
function isBound(name: 'modelValue' | 'open'): boolean {
  const raw = instance?.vnode.props;
  return !!raw && (name in raw || (name === 'modelValue' && 'model-value' in raw));
}

const localValue = ref<string | undefined>(props.modelValue);
const localOpen = ref(props.open);

function fieldId(): string {
  const explicit = attrs.id;
  return typeof explicit === 'string' && explicit !== '' ? explicit : autoId;
}

const isInvalid = computed(() => props.invalid || (!!props.error && props.error !== ''));

const machine = useColorPicker(() => {
  const id = fieldId();
  return {
    id,
    ids: {
      root: `${id}-root`,
      label: `${id}-label`,
      control: `${id}-box`,
      trigger: `${id}-trigger`,
      positioner: `${id}-positioner`,
      content: `${id}-content`,
      area: `${id}-area`,
      areaThumb: `${id}-area-thumb`,
      channelSliderTrack: (channel: string) => `${id}-${channel}-track`,
      channelSliderThumb: (channel: string) => `${id}-${channel}-thumb`,
    },
    value: isBound('modelValue') ? props.modelValue : localValue.value,
    open: isBound('open') ? props.open : localOpen.value,
    onValueChange: ({ value }) => {
      if (!isBound('modelValue')) localValue.value = value;
      emit('update:modelValue', value);
    },
    onOpenChange: ({ open }) => {
      if (!isBound('open')) localOpen.value = open;
      emit('update:open', open);
    },
    format: props.format,
    onFormatChange: ({ format }) => emit('format-change', format),
    alpha: props.alpha,
    disabled: props.disabled,
    required: props.required,
    invalid: isInvalid.value,
    labels: {
      trigger: props.triggerLabel,
      area: props.areaLabel,
      hue: props.hueLabel,
      alpha: props.alphaLabel,
      format: props.formatLabel,
      eyeDropper: props.eyeDropperLabel,
      swatches: props.swatchesLabel,
    },
  };
});

/** The machine's API, re-wrapped in this package's `computed` for the template type-check. */
const api = computed(() => machine.value);

const hasHint = () => !!props.hint && props.hint !== '';
const hasError = () => !!props.error && props.error !== '';

function describedBy(): string | undefined {
  const id = fieldId();
  const own = attrs['aria-describedby'];
  const ids = [
    hasHint() ? `${id}-hint` : undefined,
    hasError() ? `${id}-error` : undefined,
    typeof own === 'string' && own !== '' ? own : undefined,
  ].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
}

function rootAttrs(): Record<string, unknown> {
  return mergeProps(api.value.getRootProps() as Record<string, unknown>, {
    class: ['apui-color-picker', attrs.class, props.classes?.root],
    'data-size': props.size,
    'data-format': api.value.textFormat,
    'data-invalid': flag(isInvalid.value),
    'data-disabled': flag(props.disabled),
  });
}

/** The text value: the machine's props plus every attribute but `class` and `id`. */
function controlAttrs(): Record<string, unknown> {
  const { class: _className, id: _id, 'aria-describedby': _describedBy, ...rest } = attrs;
  return mergeProps(
    rest,
    api.value.getValueInputProps({ id: fieldId() }) as Record<string, unknown>,
    {
      class: props.classes?.control,
      'aria-describedby': describedBy(),
    },
  );
}

/** Zag's props for a part, plus its extra class. */
function withClass(zagProps: unknown, className: string | undefined): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  return className ? mergeProps(own, { class: className }) : own;
}
</script>

<template>
  <div v-bind="rootAttrs()">
    <label
      v-if="label"
      v-bind="part('color-picker', 'label', classes?.label)"
      :id="`${fieldId()}-label`"
      :for="fieldId()"
      >{{ label
      }}<span
        v-if="required"
        v-bind="part('color-picker', 'required', classes?.required, { 'aria-hidden': 'true' })"
        >*</span
      ></label
    >
    <div v-bind="withClass(api.getControlProps(), classes?.box)">
      <button v-bind="withClass(api.getTriggerProps(), classes?.trigger)">
        <span v-bind="withClass(api.getSwatchProps({ value: api.value }), classes?.swatch)" />
      </button>
      <input v-bind="controlAttrs()" />
    </div>
    <p
      v-if="hasHint()"
      v-bind="part('color-picker', 'hint', classes?.hint)"
      :id="`${fieldId()}-hint`"
    >
      {{ hint }}
    </p>
    <p
      v-if="hasError()"
      v-bind="part('color-picker', 'error', classes?.error)"
      :id="`${fieldId()}-error`"
    >
      <DsIcon name="circle-alert" />{{ error }}
    </p>
    <Teleport to="body" :disabled="!portal">
      <div v-bind="withClass(api.getPositionerProps(), classes?.positioner)">
        <div v-bind="withClass(api.getContentProps(), classes?.content)">
          <div v-bind="withClass(api.getAreaProps(), classes?.area)">
            <div v-bind="withClass(api.getAreaBackgroundProps(), classes?.areaBackground)" />
            <div v-bind="withClass(api.getAreaThumbProps(), classes?.areaThumb)" />
          </div>
          <div
            v-bind="
              withClass(api.getChannelSliderProps({ channel: 'hue' }), classes?.channelSlider)
            "
          >
            <div
              v-bind="
                withClass(
                  api.getChannelSliderTrackProps({ channel: 'hue' }),
                  classes?.channelSliderTrack,
                )
              "
            >
              <div
                v-bind="
                  withClass(
                    api.getChannelSliderThumbProps({ channel: 'hue' }),
                    classes?.channelSliderThumb,
                  )
                "
              />
            </div>
          </div>
          <div
            v-if="alpha"
            v-bind="
              withClass(api.getChannelSliderProps({ channel: 'alpha' }), classes?.channelSlider)
            "
          >
            <div v-bind="withClass(api.getTransparencyGridProps(), classes?.transparencyGrid)" />
            <div
              v-bind="
                withClass(
                  api.getChannelSliderTrackProps({ channel: 'alpha' }),
                  classes?.channelSliderTrack,
                )
              "
            >
              <div
                v-bind="
                  withClass(
                    api.getChannelSliderThumbProps({ channel: 'alpha' }),
                    classes?.channelSliderThumb,
                  )
                "
              />
            </div>
          </div>
          <div v-bind="withClass(api.getRowProps(), classes?.row)">
            <select
              v-bind="
                withClass(
                  api.getFormatSelectProps({ id: `${fieldId()}-format` }),
                  classes?.formatSelect,
                )
              "
            >
              <option v-for="option in COLOR_FORMATS" :key="option" :value="option">
                {{ FORMAT_NAMES[option] }}
              </option>
            </select>
            <button v-bind="withClass(api.getEyeDropperTriggerProps(), classes?.eyeDropperTrigger)">
              <DsIcon name="pipette" />
            </button>
          </div>
          <div
            v-if="swatches.length"
            v-bind="withClass(api.getSwatchGroupProps(), classes?.swatchGroup)"
          >
            <button
              v-for="swatch in swatches"
              :key="swatch"
              v-bind="
                withClass(api.getSwatchTriggerProps({ value: swatch }), classes?.swatchTrigger)
              "
            >
              <span v-bind="withClass(api.getSwatchProps({ value: swatch }), classes?.swatch)" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
