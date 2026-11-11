import type { ComputedRef, InjectionKey } from 'vue';
import type { StepsPart } from './types';

/**
 * The context a Steps provides to its Step children.
 *
 * @internal
 */
export interface StepsContext {
  value: ComputedRef<number | undefined>;
  clickable: ComputedRef<boolean>;
  completeLabel: ComputedRef<string>;
  errorLabel: ComputedRef<string>;
  classOf: (name: StepsPart) => string | undefined;
  select: (step: number) => void;
}

/** @internal */
export const STEPS_KEY: InjectionKey<StepsContext> = Symbol('apui-steps');
