/**
 * @module design-system
 *
 * Internal helpers shared by the design-system components (Button, Input,
 * Select, Checkbox, Card). They render the markup contract every stack emits:
 * `data-scope` / `data-part` parts, present-empty boolean data attributes,
 * per-part `classes`, and icons resolved through the shared icon registry in
 * `@artisanpack-ui/behavior/icons`.
 *
 * @internal
 */
import {
  Comment,
  Fragment,
  type FunctionalComponent,
  h,
  Text,
  type VNode,
  type VNodeArrayChildren,
} from 'vue';
import { ICON_SVG_ATTRIBUTES, resolveIcon } from '@artisanpack-ui/behavior/icons';

/** Icon names whose part span gets `data-mirror`, so CSS flips them under RTL. */
export const MIRRORED_ICONS: ReadonlySet<string> = new Set([
  'arrow-right',
  'arrow-left',
  'chevron-right',
  'chevron-left',
]);

/** A present-empty boolean data attribute: `''` when on, omitted when off. */
export function flag(on: unknown): '' | undefined {
  return on ? '' : undefined;
}

/**
 * The attributes of a part: `data-scope`, `data-part`, the part's extra
 * classes (only when set, so no empty `class=""` renders) and any extras.
 * Extras with an `undefined` value aren't rendered.
 */
export function part(
  scope: string,
  name: string,
  className?: string,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  const attributes: Record<string, unknown> = {
    'data-scope': scope,
    'data-part': name,
    ...extra,
  };
  if (className) attributes.class = className;
  return attributes;
}

/**
 * A behavior part's props without its `undefined` values. Vue's `mergeProps`
 * lets a later `undefined` overwrite an earlier value, so merging Zag's
 * `"aria-label": undefined` over the author's attributes would drop the
 * author's. Merged this way, the part's value wins unless it's undefined, as
 * Zag's own `mergeProps` (and the React stack) behaves.
 */
export function definedProps(zagProps: unknown): Record<string, unknown> {
  const own = zagProps as Record<string, unknown>;
  const kept: Record<string, unknown> = {};
  for (const key of Object.keys(own)) {
    if (own[key] !== undefined) kept[key] = own[key];
  }
  return kept;
}

/** Whether rendered slot output has visible content (not only comments or whitespace). */
export function hasContent(output: unknown): boolean {
  if (output === null || output === undefined || output === false) return false;
  if (Array.isArray(output)) return output.some((item) => hasContent(item));
  if (typeof output === 'string') return output.trim() !== '';
  if (typeof output === 'number') return true;
  const node = output as VNode;
  if (node.type === Comment) return false;
  if (node.type === Text) return String(node.children ?? '').trim() !== '';
  if (node.type === Fragment) return hasContent(node.children as VNodeArrayChildren);
  return true;
}

const warned = new Set<string>();

/** Logs a development warning once per key. Silent in production builds. */
export function warnOnce(key: string, message: string): void {
  if (!import.meta.env?.DEV || warned.has(key)) return;
  warned.add(key);
  console.warn(`[@artisanpack-ui/vue] ${message}`);
}

function warnUnknownIcon(name: string): void {
  warnOnce(
    `icon:${name}`,
    `Unknown icon "${name}". Register it with registerIcons() from @artisanpack-ui/vue.`,
  );
}

/** Control characters and whitespace, which browsers ignore inside a URL's scheme. */
// eslint-disable-next-line no-control-regex
const IGNORED_URL_CHARACTERS = /[\u0000-\u0020\u007f-\u009f]/g;

/**
 * The URL's scheme, lowercased, with control characters and whitespace
 * removed; `''` for a relative or scheme-less URL (`/`, `./`, `?`, `#`, `//host`).
 */
function urlScheme(url: string): string {
  const match = /^([a-z][a-z0-9+.-]*):/.exec(url.replace(IGNORED_URL_CHARACTERS, '').toLowerCase());
  return match ? match[1]! : '';
}

/** Schemes an `href` may use. Relative and scheme-less URLs are always allowed. */
const HREF_SCHEMES: ReadonlySet<string> = new Set(['http', 'https', 'mailto', 'tel', 'sms']);

/** Schemes a media URL may use, besides `data:image/…`. */
const MEDIA_SCHEMES: ReadonlySet<string> = new Set(['http', 'https', 'blob']);

/**
 * The href, or `undefined` when it's empty or its scheme isn't allowlisted
 * (relative, http, https, mailto, tel, sms), so it's treated as absent.
 */
export function safeHref(href: string | undefined | null): string | undefined {
  if (href === undefined || href === null || href === '') return undefined;
  const scheme = urlScheme(href);
  return scheme === '' || HREF_SCHEMES.has(scheme) ? href : undefined;
}

/**
 * A media URL, or `undefined` unless it's relative, http, https, blob or a
 * `data:image/…` URL.
 */
export function safeMediaUrl(src: string | undefined | null): string | undefined {
  if (src === undefined || src === null || src === '') return undefined;
  const scheme = urlScheme(src);
  if (scheme === '' || MEDIA_SCHEMES.has(scheme)) return src;
  const isDataImage =
    scheme === 'data' &&
    src.replace(IGNORED_URL_CHARACTERS, '').toLowerCase().startsWith('data:image/');
  return isDataImage ? src : undefined;
}

/**
 * Renders a registered icon as the contract's `<svg>`, or nothing when the
 * name is empty or unknown (the caller keeps the part span).
 */
export const DsIcon: FunctionalComponent<{ name?: string }> = (props) => {
  if (!props.name) return null;
  const body = resolveIcon(props.name);
  if (body === undefined) {
    warnUnknownIcon(props.name);
    return null;
  }
  return h('svg', { ...ICON_SVG_ATTRIBUTES, innerHTML: body });
};

DsIcon.props = ['name'];
DsIcon.displayName = 'DsIcon';
