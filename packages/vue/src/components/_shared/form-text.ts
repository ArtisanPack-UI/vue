/**
 * @module form-text
 *
 * Pure helpers the form text components (#53) share with the other stacks:
 * the Textarea counter announcement, the Password strength level and
 * requirement checks, Pin filtering and Range value math. Every stack
 * implements the same rules, so the same input renders the same markup.
 *
 * @internal
 */

import { onBeforeUnmount, onMounted, type Ref } from 'vue';

/**
 * The Textarea counter's live announcement: empty until the characters left
 * reach max(10, 10% of the limit), then `label` with `{count}` replaced.
 */
export function remainingAnnouncement(length: number, maxLength: number, label: string): string {
  const remaining = Math.max(0, maxLength - length);
  const threshold = Math.max(10, Math.ceil(maxLength * 0.1));
  return remaining <= threshold ? label.split('{count}').join(String(remaining)) : '';
}

/** A Password strength level: 0 (empty) to 4 (strong). */
export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

/**
 * The strength level of a password: one point each for 8+ and 12+
 * characters, mixed case, a digit and a symbol; level = points − 1, clamped
 * to 1–4. Empty is 0.
 */
export function passwordStrength(value: string): StrengthLevel {
  if (value === '') return 0;
  const points =
    Number(value.length >= 8) +
    Number(value.length >= 12) +
    Number(/[a-z]/.test(value) && /[A-Z]/.test(value)) +
    Number(/\d/.test(value)) +
    Number(/[^A-Za-z0-9]/.test(value));
  return Math.min(4, Math.max(1, points - 1)) as StrengthLevel;
}

/** Whether a value matches a requirement's pattern. An invalid pattern is unmet. */
export function requirementMet(pattern: string, value: string): boolean {
  try {
    return new RegExp(pattern, 'u').test(value);
  } catch {
    return false;
  }
}

/** Keeps the characters a Pin allows, up to its length. */
export function filterPin(value: string, type: 'numeric' | 'alphanumeric', length: number): string {
  const allowed = type === 'numeric' ? /\d/ : /[A-Za-z0-9]/;
  return [...value]
    .filter((char) => allowed.test(char))
    .join('')
    .slice(0, length);
}

/** A value's position on the track, as a percentage clamped to 0–100. */
export function percentOf(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/** A Range value as the bubble, marks and `aria-valuetext` read it. */
export function formatRangeValue(value: number, format: string | undefined): string {
  return format ? format.split('{value}').join(String(value)) : String(value);
}

/** One ValidationSummary entry. */
export interface SummaryError {
  field: string;
  message: string;
}

/**
 * ValidationSummary errors as a list: a list is kept (entries without a
 * message dropped); a map gives the first message of each field.
 */
export function normalizeErrors(
  errors: SummaryError[] | Record<string, string | string[] | undefined> | undefined | null,
): SummaryError[] {
  if (!errors) return [];
  if (Array.isArray(errors)) {
    return errors.filter((item) => item && typeof item.message === 'string' && item.message !== '');
  }
  return Object.entries(errors).flatMap(([field, value]) => {
    const message = Array.isArray(value) ? value[0] : value;
    return typeof message === 'string' && message !== '' ? [{ field, message }] : [];
  });
}

/**
 * Moves focus to a field: the element with that id, else the control with
 * that name, else one bound with that `wire:model`. Returns whether it found
 * one.
 */
export function focusField(field: string): boolean {
  if (typeof document === 'undefined' || field === '') return false;
  let target: HTMLElement | null = document.getElementById(field);
  if (!target) {
    const escaped = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(field) : field;
    target = document.querySelector<HTMLElement>(`[name="${escaped}"]`);
  }
  if (!target) {
    target =
      [...document.querySelectorAll<HTMLElement>('*')].find((element) =>
        [...element.attributes].some(
          (attribute) => attribute.name.startsWith('wire:model') && attribute.value === field,
        ),
      ) ?? null;
  }
  if (!target) return false;
  target.focus();
  target.scrollIntoView?.({ block: 'center' });
  return true;
}

/**
 * Lets an uncontrolled field follow its form's reset, as Checkbox and Toggle
 * do: a reset changes the native control without an input event, so state
 * mirrored from it (Pin's cells, Textarea's counter) would go stale. While
 * `uncontrolled()` is true, a reset of the control's form calls `onReset`
 * with the control's value, in a later task: a native reset button resets
 * the controls only after the event's microtasks have run.
 */
export function useFormReset(
  control: Ref<HTMLInputElement | HTMLTextAreaElement | null>,
  uncontrolled: () => boolean,
  onReset: (value: string) => void,
): void {
  let form: HTMLFormElement | null = null;
  const handleReset = () => {
    setTimeout(() => {
      if (control.value && uncontrolled()) onReset(control.value.value);
    }, 0);
  };
  onMounted(() => {
    form = control.value?.form ?? null;
    form?.addEventListener('reset', handleReset);
  });
  onBeforeUnmount(() => form?.removeEventListener('reset', handleReset));
}

/**
 * The attributes a dual Range thumb takes from the caller: both inputs post
 * into `name[]`; `aria-label` and `aria-labelledby` are left out (they join
 * each thumb's name instead) and other `aria-*` go on the start thumb only.
 * Livewire and React do the same.
 */
export function dualThumbAttrs(
  rest: Record<string, unknown>,
  thumb: 'start' | 'end',
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (key === 'aria-label' || key === 'aria-labelledby') continue;
    if (key.startsWith('aria-') && thumb === 'end') continue;
    if (key === 'name' && typeof value === 'string' && value !== '') {
      result.name = value.endsWith('[]') ? value : `${value}[]`;
      continue;
    }
    result[key] = value;
  }
  return result;
}
