/**
 * Injection keys for Inertia form context.
 *
 * @module components/form/keys
 */
import type { InjectionKey, ComputedRef } from 'vue';

export interface InertiaFormContext {
  form: Record<string, unknown>;
  getError: (field: string) => string | undefined;
  clearErrors: (...fields: string[]) => void;
  processing: ComputedRef<boolean>;
}

export const INERTIA_FORM_KEY: InjectionKey<InertiaFormContext> = Symbol('InertiaFormContext');
