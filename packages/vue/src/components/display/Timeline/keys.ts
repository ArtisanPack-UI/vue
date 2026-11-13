import type { InjectionKey } from 'vue';
import type { TimelinePart } from './types';

/**
 * The context a Timeline provides to its TimelineItem children.
 *
 * @internal
 */
export interface TimelineContext {
  classOf: (name: TimelinePart) => string | undefined;
}

/** @internal */
export const TIMELINE_KEY: InjectionKey<TimelineContext> = Symbol('apui-timeline');
