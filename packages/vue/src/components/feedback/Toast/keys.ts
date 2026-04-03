import type { InjectionKey } from 'vue';
import type { ToastAPI } from './types';

/** Injection key for the toast context. */
export const TOAST_KEY: InjectionKey<ToastAPI> = Symbol('toast');
