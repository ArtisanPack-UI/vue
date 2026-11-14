import type { InjectionKey } from 'vue';
import type { NavbarPart } from './types';

/** @internal */
export interface NavbarContext {
  classOf: (name: NavbarPart) => string | undefined;
}

/** @internal */
export const NAVBAR_KEY: InjectionKey<NavbarContext> = Symbol('apui-navbar');
