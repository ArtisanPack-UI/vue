/** The target size of a Swap. */
export type SwapSize = 'sm' | 'md' | 'lg';

/** How a Swap swaps its content. */
export type SwapTransition = 'fade' | 'rotate' | 'none';

/** The parts a Swap accepts extra classes for. */
export type SwapPart = 'root' | 'control' | 'on' | 'off';

/**
 * Props for the Swap component (#65): a native checkbox that swaps its on
 * and off content. `class` goes to the root; every other attribute to the
 * checkbox.
 */
export interface SwapProps {
  /** Whether it's on. Bind it with `v-model:checked`. @defaultValue `false` */
  checked?: boolean;
  /** The checkbox's accessible name, such as "Dark mode". Not shown. */
  label: string;
  /** The icon shown when on. The `on` slot overrides it. @defaultValue `'sun'` */
  onIcon?: string;
  /** The icon shown when off. The `off` slot overrides it. @defaultValue `'moon'` */
  offIcon?: string;
  /** `fade`, `rotate` or `none`. Reduced motion always swaps at once. @defaultValue `'fade'` */
  transition?: SwapTransition;
  /** The target and icon size. @defaultValue `'md'` */
  size?: SwapSize;
  /** Disables the checkbox. @defaultValue `false` */
  disabled?: boolean;
  /** Extra classes per part. */
  classes?: Partial<Record<SwapPart, string>>;
}

/** Events a Swap emits. */
export interface SwapEmits {
  /** It turned on or off. */
  'update:checked': [checked: boolean];
}
