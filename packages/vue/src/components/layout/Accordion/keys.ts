import type { ComputedRef, InjectionKey } from 'vue';

export interface AccordionContext {
  currentIndices: ComputedRef<number[]>;
  toggleIndex: (index: number) => void;
}

export const ACCORDION_KEY: InjectionKey<AccordionContext> = Symbol('accordion');
