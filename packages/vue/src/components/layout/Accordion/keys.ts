import type { InjectionKey } from 'vue';
import type { AccordionApi } from '@artisanpack-ui/behavior/vue';
import type { AccordionPart } from './types';

/**
 * The context Accordion provides to its AccordionItem children.
 *
 * @internal
 */
export interface AccordionContext {
  /** The accordion machine's current API. */
  api: () => AccordionApi;
  /** The accordion's `classes`, for the parts the items render. */
  classOf: (name: AccordionPart) => string | undefined;
  /** The items' heading level, 2 to 6. */
  level: () => number;
}

/** @internal */
export const ACCORDION_KEY: InjectionKey<AccordionContext> = Symbol('apui-accordion');
