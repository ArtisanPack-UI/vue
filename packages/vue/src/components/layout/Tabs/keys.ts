import type { InjectionKey } from 'vue';
import type { TabsApi } from '@artisanpack-ui/behavior/vue';
import type { TabsPart } from './types';

/**
 * The context Tabs provides to its Tab children, which render their panels.
 *
 * @internal
 */
export interface TabsContext {
  /** The tabs machine's current API. */
  api: () => TabsApi;
  /** The tabs' `classes`, for the parts the children render. */
  classOf: (name: TabsPart) => string | undefined;
}

/** @internal */
export const TABS_KEY: InjectionKey<TabsContext> = Symbol('apui-tabs');
