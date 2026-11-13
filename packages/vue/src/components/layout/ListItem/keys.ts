import type { InjectionKey } from 'vue';

/** Provided by a List, so its ListItems render as li. @internal */
export const IN_LIST_KEY: InjectionKey<boolean> = Symbol('apui-list');
