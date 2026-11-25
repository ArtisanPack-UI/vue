import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h, nextTick, type Component } from 'vue';
import { TranslationProvider, type TranslationMessages } from '../../i18n/translator';
import {
  Breadcrumbs,
  Link,
  Navbar,
  Pagination,
  Sidebar,
  Spotlight,
  SpotlightSearch,
  Step,
  Steps,
  type BreadcrumbItem,
} from '../../components/navigation';

// jsdom has no CSS.escape; the combobox machine finds the active option with it.
if (typeof globalThis.CSS?.escape !== 'function') {
  (globalThis as { CSS?: object }).CSS = {
    ...(globalThis.CSS ?? {}),
    escape: (value: string) => value.replace(/[^\w-]/g, (c) => `\\${c}`),
  };
}

const es: TranslationMessages = {
  Breadcrumb: 'Ruta de navegación',
  'Show {count} more level|Show {count} more levels':
    'Mostrar {count} nivel más|Mostrar {count} niveles más|Mostrar {count} niveles más',
  '(opens in a new tab)': '(se abre en una pestaña nueva)',
  Main: 'Principal',
  'Sidebar navigation': 'Navegación lateral',
  Pagination: 'Paginación',
  'Previous page': 'Página anterior',
  'Next page': 'Página siguiente',
  'Page {page}': 'Página {page}',
  'Page {page} of {pageCount}': 'Página {page} de {pageCount}',
  'Showing {from}–{to} of {total}': 'Mostrando {from}–{to} de {total}',
  Search: 'Buscar',
  'Search…': 'Buscar…',
  Close: 'Cerrar',
  Navigate: 'Navegar',
  Open: 'Abrir',
  Completed: 'Completado',
  Error: 'Error de paso',
};

/** Renders `component` under a Spanish provider. */
function renderEs(
  component: Component,
  props: Record<string, unknown> = {},
  slots?: () => unknown,
) {
  return render(() =>
    h(TranslationProvider, { locale: 'es', messages: es }, () => h(component, props, slots)),
  );
}

const trail: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Lakeview Lofts', href: '/properties/1' },
  { label: 'Analytics', href: '/properties/1/analytics' },
  { label: 'Visitor', href: '/ignored' },
];

/** Lets the machines' effects run. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('navigation translations', () => {
  it('translates Breadcrumbs, picking the plural form by count', () => {
    renderEs(Breadcrumbs, { items: trail });
    expect(screen.getByRole('navigation', { name: 'Ruta de navegación' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mostrar 2 niveles más' })).toBeTruthy();
  });

  it('keeps explicit Breadcrumbs labels over the catalogue', () => {
    renderEs(Breadcrumbs, { items: trail, label: 'Trail', overflowLabel: 'Reveal {count}' });
    expect(screen.getByRole('navigation', { name: 'Trail' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reveal 2' })).toBeTruthy();
  });

  it('translates and overrides the Link external announcement', () => {
    const { container } = renderEs(
      Link,
      { href: 'https://example.com', external: true },
      () => 'Docs',
    );
    expect(container.querySelector('.apui-sr-only')!.textContent?.trim()).toBe(
      '(se abre en una pestaña nueva)',
    );
  });

  it('keeps an explicit Link external label', () => {
    const { container } = renderEs(
      Link,
      { href: 'https://example.com', external: true, externalLabel: '(new tab)' },
      () => 'Docs',
    );
    expect(container.querySelector('.apui-sr-only')!.textContent?.trim()).toBe('(new tab)');
  });

  it('translates and overrides the Navbar links landmark', () => {
    renderEs(Navbar, { links: [{ label: 'Home', href: '/' }] });
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeTruthy();
    render(() =>
      h(TranslationProvider, { locale: 'es', messages: es }, () =>
        h(Navbar, { label: 'Primary', links: [{ label: 'Home', href: '/' }] }),
      ),
    );
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy();
  });

  it('translates and overrides the Sidebar landmark', () => {
    const sidebar = (root: Element) =>
      root.querySelector('[data-scope="app-shell"][data-part="sidebar"]')!;
    expect(sidebar(renderEs(Sidebar).container).getAttribute('aria-label')).toBe(
      'Navegación lateral',
    );
    document.body.innerHTML = '';
    expect(
      sidebar(renderEs(Sidebar, { ariaLabel: 'Site' }).container).getAttribute('aria-label'),
    ).toBe('Site');
  });

  it('translates Pagination names and its summary', () => {
    const { container } = renderEs(Pagination, { page: 2, total: 50, perPage: 10, summary: true });
    expect(screen.getByRole('navigation', { name: 'Paginación' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Página 3' })).toBeTruthy();
    expect(container.textContent).toContain('Mostrando 11–20 de 50');
  });

  it('translates the Pagination summary without a total', () => {
    const { container } = renderEs(Pagination, { page: 2, pageCount: 4, summary: true });
    expect(container.textContent).toContain('Página 2 de 4');
  });

  it('keeps explicit Pagination labels', () => {
    renderEs(Pagination, {
      page: 1,
      pageCount: 3,
      label: 'Pages',
      previousLabel: 'Back',
      nextLabel: 'Forward',
      pageLabel: 'Go to {page}',
    });
    expect(screen.getByRole('navigation', { name: 'Pages' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Back' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Forward' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Go to 2' })).toBeTruthy();
  });

  it('translates the Spotlight palette', async () => {
    renderEs(Spotlight, { open: true, portal: false, groups: [] });
    await settle();
    expect(screen.getByRole('dialog', { name: 'Buscar' })).toBeTruthy();
    expect(screen.getByRole('combobox').getAttribute('placeholder')).toBe('Buscar…');
    expect(screen.getByRole('button', { name: 'Esc, Cerrar' })).toBeTruthy();
    expect(screen.getByText('Navegar')).toBeTruthy();
    expect(screen.getByText('Abrir')).toBeTruthy();
  });

  it('keeps explicit Spotlight labels', async () => {
    renderEs(Spotlight, {
      open: true,
      portal: false,
      groups: [],
      label: 'Find',
      closeLabel: 'Shut',
    });
    await settle();
    expect(screen.getByRole('dialog', { name: 'Find' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Esc, Shut' })).toBeTruthy();
  });

  it('translates the deprecated SpotlightSearch through Spotlight', async () => {
    renderEs(SpotlightSearch, { open: true, items: [] });
    await settle();
    expect(screen.getByRole('dialog', { name: 'Buscar' })).toBeTruthy();
  });

  it("translates and overrides Steps' hidden marker text", () => {
    const steps = () => [h(Step, { title: 'A' }), h(Step, { title: 'B', state: 'error' })];
    const { container } = renderEs(Steps, { modelValue: 3 }, steps);
    const markers = container.querySelectorAll('[data-part="marker"]');
    expect(markers[0]!.textContent).toBe('Completado');
    expect(markers[1]!.textContent).toBe('Error de paso');

    const explicit = renderEs(
      Steps,
      { modelValue: 3, completeLabel: 'Done', errorLabel: 'Failed' },
      steps,
    );
    const own = explicit.container.querySelectorAll('[data-part="marker"]');
    expect(own[0]!.textContent).toBe('Done');
    expect(own[1]!.textContent).toBe('Failed');
  });
});
