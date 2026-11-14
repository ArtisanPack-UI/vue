/** A step's state. Emitted as `data-state`. */
export type StepState = 'complete' | 'current' | 'upcoming' | 'error';

/** The orientation of a Steps. Emitted as `data-orientation`. */
export type StepsOrientation = 'horizontal' | 'vertical';

/** The parts of a Steps that accept extra classes, its steps' included. */
export type StepsPart = 'root' | 'step' | 'marker' | 'title' | 'connector' | 'description';

/** One step in `steps`. */
export interface StepItem {
  /** The step's name. */
  title: string;
  /** Supporting text under the title. */
  description?: string;
  /** The step's own state; without it, the current step decides. */
  state?: StepState;
  /** An icon name that replaces the marker's number or check. */
  icon?: string;
}

/**
 * Props for the Steps component (design-system manifest `Steps`, #56).
 *
 * The default slot holds Step children. `v-model` binds the current step;
 * with `clickable`, choosing a completed step emits `update:modelValue`.
 * `class` and every other attribute go to the root.
 */
export interface StepsProps {
  /** The steps as data, rendering the same children as composition. Rendered before the slot. */
  steps?: StepItem[];
  /** The current step, from 1 (`v-model`). Steps before it are complete, after it upcoming. */
  modelValue?: number;
  /** A row, or a column with room for longer descriptions. @defaultValue `'horizontal'` */
  orientation?: StepsOrientation;
  /** Completed steps' titles become buttons that set the value. @defaultValue `false` */
  clickable?: boolean;
  /** The list's accessible name. */
  label?: string;
  /** Hidden text in a complete step's marker; translate it. @defaultValue `'Completed'` */
  completeLabel?: string;
  /** Hidden text in an error step's marker; translate it. @defaultValue `'Error'` */
  errorLabel?: string;
  /** Extra classes per part, its steps' included. */
  classes?: Partial<Record<StepsPart, string>>;
}

/** Props for a Step. `class` and every other attribute go to the step. */
export interface StepProps {
  /** The step's name. The default slot overrides it. */
  title?: string;
  /** Supporting text under the title. */
  description?: string;
  /** The step's own state; without it, the parent's value decides. */
  state?: StepState;
  /** An icon name that replaces the marker's number or check. */
  icon?: string;
  /** The step's number. Steps sets it from the step's position. */
  step?: number;
}
