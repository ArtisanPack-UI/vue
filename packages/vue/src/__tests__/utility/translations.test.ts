import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { defineComponent, h, type Component } from 'vue';
import { Clipboard, Kbd, Markdown, ThemeToggle } from '../../components/utility';
import { TranslationProvider } from '../../i18n/translator';

const ES = {
  Copy: 'Copiar',
  Command: 'Comando',
  Enter: 'Intro',
  'Markdown mode': 'Modo Markdown',
  Write: 'Escribir',
  Preview: 'Vista previa',
  Split: 'Dividido',
  'Markdown source': 'Fuente Markdown',
  Theme: 'Tema',
  Light: 'Claro',
  Dark: 'Oscuro',
  System: 'Sistema',
  'Switch to dark theme': 'Cambiar al tema oscuro',
  'Switch to light theme': 'Cambiar al tema claro',
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

describe('utility translations', () => {
  it("translates Clipboard's button, and label wins", () => {
    const first = inSpanish(Clipboard, { value: 'x' });
    expect(screen.getByRole('button', { name: 'Copiar' })).toBeTruthy();
    first.unmount();

    inSpanish(Clipboard, { value: 'x', label: 'Duplicar' });
    expect(screen.getByRole('button', { name: 'Duplicar' })).toBeTruthy();
  });

  it("translates Kbd's hidden key names, and labels win", () => {
    const first = inSpanish(Kbd, { keys: ['mod', 'enter'], platform: 'mac' });
    const names = () =>
      [...document.body.querySelectorAll('.apui-sr-only')].map((el) => el.textContent);
    expect(names()).toEqual(['Comando', 'Intro']);
    first.unmount();

    inSpanish(Kbd, { keys: ['mod', 'enter'], platform: 'mac', labels: { enter: 'Entrar' } });
    expect(names()).toEqual(['Comando', 'Entrar']);
  });

  it("translates Markdown's tabs and editor, and props win", () => {
    const first = inSpanish(Markdown, { source: '# Hi', mode: 'write' });
    expect(screen.getByRole('tablist', { name: 'Modo Markdown' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Escribir' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Vista previa' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Dividido' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Fuente Markdown' })).toBeTruthy();
    first.unmount();

    inSpanish(Markdown, { source: '# Hi', mode: 'write', writeLabel: 'Editar' });
    expect(screen.getByRole('tab', { name: 'Editar' })).toBeTruthy();
  });

  it("translates ThemeToggle's choices, and props win", () => {
    const first = inSpanish(ThemeToggle, { persist: false });
    expect(screen.getByRole('radiogroup', { name: 'Tema' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Claro' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Sistema' })).toBeTruthy();
    first.unmount();

    const second = inSpanish(ThemeToggle, { persist: false, variant: 'icon' });
    expect(screen.getByRole('button', { name: /Cambiar al tema (oscuro|claro)/ })).toBeTruthy();
    second.unmount();

    inSpanish(ThemeToggle, { persist: false, lightLabel: 'Día' });
    expect(screen.getByRole('radio', { name: 'Día' })).toBeTruthy();
  });
});
