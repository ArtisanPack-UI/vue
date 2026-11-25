import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, type Component } from 'vue';
import {
  AppShell,
  Collapse,
  Dialog,
  Drawer,
  Dropdown,
  Modal,
  UserMenu,
} from '../../components/layout';
import { TranslationProvider } from '../../i18n/translator';

const ES = {
  Close: 'Cerrar',
  Options: 'Opciones',
  Dialog: 'Diálogo',
  Sidebar: 'Barra lateral',
  'Skip to main content': 'Saltar al contenido principal',
  'Collapse sidebar': 'Contraer la barra lateral',
  'Read more': 'Leer más',
  'Show less': 'Mostrar menos',
  Workspace: 'Espacio de trabajo',
  Theme: 'Tema',
  Light: 'Claro',
  Dark: 'Oscuro',
  System: 'Sistema',
  'Log out': 'Cerrar sesión',
};

/** Renders a component under a Spanish TranslationProvider. */
function inSpanish(component: Component, props: Record<string, unknown> = {}) {
  return render(
    defineComponent({
      setup: () => () =>
        h(TranslationProvider, { locale: 'es', messages: ES }, () => h(component, props)),
    }),
  );
}

const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('layout translations', () => {
  it.each([
    ['Dialog', Dialog],
    ['Drawer', Drawer],
  ] as const)('translates the %s close button, and closeLabel wins', async (_, component) => {
    inSpanish(component, { open: true, title: 'Invite member' });
    await settle();
    expect(document.body.querySelector('[aria-label="Cerrar"]')).not.toBeNull();
    document.body.innerHTML = '';

    inSpanish(component, { open: true, title: 'Invite member', closeLabel: 'Salir' });
    await settle();
    expect(document.body.querySelector('[aria-label="Salir"]')).not.toBeNull();
    expect(document.body.querySelector('[aria-label="Cerrar"]')).toBeNull();
  });

  it("translates Dropdown's default trigger text, and label wins", () => {
    const first = inSpanish(Dropdown);
    expect(first.container.textContent).toContain('Opciones');
    first.unmount();

    const second = inSpanish(Dropdown, { label: 'Acciones' });
    expect(second.container.textContent).toContain('Acciones');
    expect(second.container.textContent).not.toContain('Opciones');
  });

  it("translates Modal's fallback name, and ariaLabel wins", async () => {
    inSpanish(Modal, { open: true });
    await settle();
    expect(document.body.querySelector('.apui-dialog')!.getAttribute('aria-label')).toBe('Diálogo');
    document.body.innerHTML = '';

    inSpanish(Modal, { open: true, ariaLabel: 'Ajustes' });
    await settle();
    expect(document.body.querySelector('.apui-dialog')!.getAttribute('aria-label')).toBe('Ajustes');
  });

  it("translates AppShell's skip link, sidebar and collapse button, and props win", () => {
    const first = inSpanish(AppShell, { collapsible: true });
    expect(screen.getByRole('link', { name: 'Saltar al contenido principal' })).toBeTruthy();
    expect(screen.getByRole('complementary', { name: 'Barra lateral' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Contraer la barra lateral' })).toBeTruthy();
    first.unmount();

    inSpanish(AppShell, {
      collapsible: true,
      label: 'Navegación',
      skipLabel: 'Ir al contenido',
      collapseLabel: 'Plegar',
    });
    expect(screen.getByRole('link', { name: 'Ir al contenido' })).toBeTruthy();
    expect(screen.getByRole('complementary', { name: 'Navegación' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Plegar' })).toBeTruthy();
  });

  it("translates Collapse's read-more trigger, and label wins", async () => {
    const first = inSpanish(Collapse, { variant: 'read-more' });
    await settle();
    expect(
      first.container.querySelector('[data-scope="collapse"][data-part="trigger"]')!.textContent,
    ).toContain('Leer más');
    first.unmount();

    const second = inSpanish(Collapse, { variant: 'read-more', label: 'Ver todo' });
    await settle();
    expect(
      second.container.querySelector('[data-scope="collapse"][data-part="trigger"]')!.textContent,
    ).toContain('Ver todo');
  });

  it("translates UserMenu's groups, themes and log out, and props win", async () => {
    const props = {
      user: { name: 'Olivia Rhye', email: 'olivia@company.com' },
      workspaces: [
        { id: 'apexify', name: 'Apexify' },
        { id: 'horizon', name: 'Horizon Homes' },
      ],
      workspace: 'apexify',
      theme: 'dark',
      open: true,
      portal: false,
    };
    const first = inSpanish(UserMenu, props);
    await settle();
    expect(screen.getByRole('group', { name: 'Espacio de trabajo' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Tema' })).toBeTruthy();
    expect(screen.getByRole('menuitemradio', { name: 'Claro' })).toBeTruthy();
    expect(screen.getByRole('menuitemradio', { name: 'Oscuro' })).toBeTruthy();
    expect(screen.getByRole('menuitemradio', { name: 'Sistema' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Cerrar sesión' })).toBeTruthy();
    first.unmount();

    inSpanish(UserMenu, {
      ...props,
      workspaceLabel: 'Equipo',
      themeLabel: 'Apariencia',
      themeLabels: { light: 'Día' },
      logoutLabel: 'Salir',
    });
    await settle();
    expect(screen.getByRole('group', { name: 'Equipo' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Apariencia' })).toBeTruthy();
    expect(screen.getByRole('menuitemradio', { name: 'Día' })).toBeTruthy();
    expect(screen.getByRole('menuitemradio', { name: 'Oscuro' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Salir' })).toBeTruthy();
  });
});
