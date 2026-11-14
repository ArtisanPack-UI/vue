/**
 * The default toaster behind `toast.create({ … })`.
 *
 * `toast` sends each call to the newest mounted `<Toaster>` that has no
 * `toaster` prop, or, while none is mounted, to a default toaster. A
 * `<Toaster>` without options renders that default toaster; one with
 * options makes its own and, when it mounts, takes over the toasts already
 * waiting in the default one.
 */
import { shallowRef } from 'vue';
import { createToaster, type Toaster } from '@artisanpack-ui/behavior/vue';

/** The toaster `toast` uses while no `<Toaster>` brings its own options. */
export const defaultToaster: Toaster = createToaster();

/** A mounted `<Toaster>` that routes `toast`. */
export interface ToasterRoute {
  readonly instance: Toaster;
}

/** Mounted routes, newest last. Reactive, so regions re-render when the newest changes. */
const routes = shallowRef<ToasterRoute[]>([]);

function target(): Toaster {
  return routes.value.at(-1)?.instance ?? defaultToaster;
}

/**
 * Moves the toasts showing in the default toaster into `instance`: they were
 * created before a region with options mounted. Toasts queued past the
 * default toaster's `max` (5) stay behind.
 */
function adoptPending(instance: Toaster): void {
  if (instance === defaultToaster) return;
  const pending = defaultToaster.store.getVisibleToasts();
  // The store lists the newest first; re-create the oldest first to keep the order.
  for (const entry of [...pending].reverse()) {
    const { id, title, description, type, duration, action, meta, closable } = entry;
    instance.store.create({ id, title, description, type, duration, action, meta, closable });
    defaultToaster.remove(id);
  }
}

/**
 * Makes `instance` the toaster `toast` sends to, until `release()`. Call it
 * once the region has mounted, so server rendering never registers anything.
 *
 * @internal
 */
export function activateToaster(instance: Toaster): {
  route: ToasterRoute;
  release: () => void;
} {
  adoptPending(instance);
  const route: ToasterRoute = { instance };
  routes.value = [...routes.value, route];
  return {
    route,
    release: () => {
      routes.value = routes.value.filter((item) => item !== route);
    },
  };
}

/**
 * Whether a region with `route` (undefined until it mounts, or when it
 * renders its own `toaster` prop) should render `instance`: only when no
 * newer mounted region renders the same store, so each toast shows once.
 *
 * @internal
 */
export function rendersStore(instance: Toaster, route: ToasterRoute | undefined): boolean {
  const newest = [...routes.value].reverse().find((item) => item.instance === instance);
  return newest === undefined || newest === route;
}

/** How many mounted regions route `toast`. @internal */
export function routeCount(): number {
  return routes.value.length;
}

/**
 * Shows toasts in the page's `<Toaster>`.
 *
 * @example
 * ```ts
 * import { toast } from '@artisanpack-ui/vue';
 *
 * toast.create({ title: 'Listing saved', color: 'success' });
 * toast.create({ title: 'Listing archived', action: { label: 'Undo', onClick: restore } });
 * ```
 */
export const toast: Toaster = {
  get store() {
    return target().store;
  },
  create: (options) => target().create(options),
  update: (id, options) => target().update(id, options),
  dismiss: (id) => target().dismiss(id),
  remove: (id) => target().remove(id),
};
