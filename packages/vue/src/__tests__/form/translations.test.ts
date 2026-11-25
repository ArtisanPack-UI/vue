import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { defineComponent, h, nextTick, type Component } from 'vue';
import {
  CheckboxGroup,
  CodeEditor,
  ColorPicker,
  Combobox,
  DatePicker,
  File,
  Password,
  Range,
  Rating,
  RichTextEditor,
  Select,
  Signature,
  Textarea,
  ValidationSummary,
} from '../../components/form';
import { TranslationProvider, type TranslationMessages } from '../../i18n/translator';

const ES: TranslationMessages = {
  'Select all': 'Seleccionar todo',
  'Select…': 'Seleccionar…',
  'Characters left: {count}': 'Caracteres restantes: {count}',
  'Drop files here or browse': 'Suelta archivos aquí o explora',
  'Remove :name': 'Quitar :name',
  Minimum: 'Mínimo',
  Maximum: 'Máximo',
  ':value out of :max': ':value de :max',
  '({count} review)|({count} reviews)': '({count} reseña)|({count} de reseñas)|({count} reseñas)',
  'Choose a color': 'Elige un color',
  'Search…': 'Buscar…',
  'Show options': 'Mostrar opciones',
  'Show password': 'Mostrar contraseña',
  Strength: 'Seguridad',
  Weak: 'Débil',
  'Choose date': 'Elegir fecha',
  'Previous month': 'Mes anterior',
  'Tab inserts indentation. To leave the editor, press Escape, then Tab.':
    'Tab inserta sangría. Para salir del editor, pulsa Escape y luego Tab.',
  Formatting: 'Formato',
  Bold: 'Negrita',
  'Signature method': 'Método de firma',
  Draw: 'Dibujar',
  'Sign above the line': 'Firma sobre la línea',
  'Fix {count} field|Fix {count} fields':
    'Corrige {count} campo|Corrige {count} de campos|Corrige {count} campos',
};

/** Renders `component` with `props` under a Spanish TranslationProvider. */
function inSpanish(component: Component, props: Record<string, unknown> = {}) {
  return render(
    defineComponent({
      setup: () => () =>
        h(TranslationProvider, { locale: 'es', messages: ES }, () => h(component, props)),
    }),
  );
}

const partOf = (root: ParentNode, name: string) =>
  root.querySelector<HTMLElement>(`[data-part="${name}"]`);

/** Lets the machines' effects run. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('form translations', () => {
  it('translates CheckboxGroup select all, and a prop wins', () => {
    const options = [{ value: 'a', label: 'A' }];
    inSpanish(CheckboxGroup, { options, selectAll: true });
    expect(screen.getByLabelText('Seleccionar todo')).toBeTruthy();
    document.body.innerHTML = '';
    inSpanish(CheckboxGroup, { options, selectAll: true, selectAllLabel: 'Todos' });
    expect(screen.getByLabelText('Todos')).toBeTruthy();
  });

  it('translates the Select placeholder, and a prop wins', () => {
    const { container } = inSpanish(Select, { options: [{ value: 'a', label: 'A' }] });
    expect(container.querySelector('option')!.textContent!.trim()).toBe('Seleccionar…');
    const own = inSpanish(Select, { options: [], placeholder: 'Elige' });
    expect(own.container.querySelector('option')!.textContent!.trim()).toBe('Elige');
  });

  it('translates the Textarea remaining count', async () => {
    const { container } = inSpanish(Textarea, { label: 'Notes', maxLength: 50 });
    await fireEvent.update(partOf(container, 'control')!, 'a'.repeat(45));
    expect(container.querySelector('[aria-live="polite"]')!.textContent).toBe(
      'Caracteres restantes: 5',
    );
  });

  it('translates the File title and remove buttons, and a prop wins', () => {
    const { container } = inSpanish(File, { modelValue: [{ name: 'a.pdf', size: 10 }] });
    expect(partOf(container, 'title')!.textContent).toBe('Suelta archivos aquí o explora');
    expect(screen.getByRole('button', { name: 'Quitar a.pdf' })).toBeTruthy();
    const own = inSpanish(File, { title: 'Sube aquí' });
    expect(partOf(own.container, 'title')!.textContent).toBe('Sube aquí');
  });

  it('translates the dual Range thumb names, and thumbLabels win', () => {
    const { container } = inSpanish(Range, {
      label: 'Price',
      dual: true,
      modelValue: [20, 60],
      thumbLabels: { end: 'Hasta' },
      id: 'p',
    });
    expect(container.querySelector('#p-start-label')!.textContent).toBe('Mínimo');
    expect(container.querySelector('#p-end-label')!.textContent).toBe('Hasta');
  });

  it('translates the Rating value text and pluralizes the count', () => {
    const { container } = inSpanish(Rating, { readonly: true, modelValue: 4, count: 17 });
    expect(partOf(container, 'count')!.textContent).toBe('(17 reseñas)');
    expect(container.innerHTML).toContain('4 de 5');
    const one = inSpanish(Rating, { readonly: true, modelValue: 4, count: 1 });
    expect(partOf(one.container, 'count')!.textContent).toBe('(1 reseña)');
  });

  it('translates the ColorPicker trigger, and a prop wins', () => {
    const { container } = inSpanish(ColorPicker, { label: 'Color', portal: false });
    expect(partOf(container, 'trigger')!.getAttribute('aria-label')).toBe('Elige un color');
    const own = inSpanish(ColorPicker, { label: 'Color', portal: false, triggerLabel: 'Tono' });
    expect(partOf(own.container, 'trigger')!.getAttribute('aria-label')).toBe('Tono');
  });

  it('translates the Combobox placeholder and chevron, and a prop wins', async () => {
    const { container } = inSpanish(Combobox, {
      label: 'City',
      options: [{ value: 'a', label: 'A' }],
      portal: false,
    });
    await settle();
    expect(partOf(container, 'control')!.getAttribute('placeholder')).toBe('Buscar…');
    expect(partOf(container, 'trigger')!.getAttribute('aria-label')).toBe('Mostrar opciones');
    const own = inSpanish(Combobox, { label: 'City', options: [], placeholder: 'Ciudad…' });
    await settle();
    expect(partOf(own.container, 'control')!.getAttribute('placeholder')).toBe('Ciudad…');
  });

  it('translates the Password reveal button and strength meter, and props win', async () => {
    const { container } = inSpanish(Password, { label: 'Password', strengthMeter: true });
    expect(partOf(container, 'reveal')!.getAttribute('aria-label')).toBe('Mostrar contraseña');
    await fireEvent.update(partOf(container, 'control')!, 'abc');
    expect(container.textContent).toContain('Seguridad');
    expect(container.textContent).toContain('Débil');
    const own = inSpanish(Password, {
      label: 'Password',
      revealLabel: 'Ver',
      strengthMeter: true,
      labels: { strength: 'Fuerza' },
    });
    expect(partOf(own.container, 'reveal')!.getAttribute('aria-label')).toBe('Ver');
    expect(own.container.textContent).toContain('Fuerza');
  });

  it("translates the DatePicker buttons and uses the translations' locale", async () => {
    inSpanish(DatePicker, { label: 'Date', open: true, portal: false, modelValue: '2026-11-12' });
    await settle();
    expect(screen.getByRole('button', { name: 'Elegir fecha' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeTruthy();
    expect(document.querySelector('[data-part="range-text"]')!.textContent).toBe(
      'noviembre de 2026',
    );
  });

  it('keeps a DatePicker locale prop over the translations', async () => {
    inSpanish(DatePicker, {
      label: 'Date',
      open: true,
      portal: false,
      locale: 'fr-FR',
      modelValue: '2026-11-12',
    });
    await settle();
    expect(document.querySelector('[data-part="range-text"]')!.textContent).toBe('novembre 2026');
  });

  it('translates the CodeEditor instructions, and a prop wins', () => {
    const { container } = inSpanish(CodeEditor, { label: 'Code' });
    expect(partOf(container, 'instructions')!.textContent!.trim()).toBe(
      'Tab inserta sangría. Para salir del editor, pulsa Escape y luego Tab.',
    );
    const own = inSpanish(CodeEditor, { label: 'Code', instructionsLabel: 'Pulsa Escape.' });
    expect(partOf(own.container, 'instructions')!.textContent!.trim()).toBe('Pulsa Escape.');
  });

  it('translates the RichTextEditor toolbar, and a prop wins', () => {
    inSpanish(RichTextEditor, { label: 'Body' });
    expect(screen.getByRole('toolbar').getAttribute('aria-label')).toBe('Formato');
    expect(screen.getByRole('button', { name: 'Negrita' })).toBeTruthy();
    document.body.innerHTML = '';
    inSpanish(RichTextEditor, { label: 'Body', boldLabel: 'Fuerte' });
    expect(screen.getByRole('button', { name: 'Fuerte' })).toBeTruthy();
  });

  it('translates the Signature modes and placeholder, and a prop wins', () => {
    const { container } = inSpanish(Signature);
    expect(screen.getByRole('group', { name: 'Método de firma' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Dibujar' })).toBeTruthy();
    expect(partOf(container, 'placeholder')!.textContent).toBe('Firma sobre la línea');
    document.body.innerHTML = '';
    inSpanish(Signature, { drawLabel: 'Trazar' });
    expect(screen.getByRole('button', { name: 'Trazar' })).toBeTruthy();
  });

  it('pluralizes the ValidationSummary heading, and a title wins', () => {
    const { container } = inSpanish(ValidationSummary, {
      errors: { email: 'Required.', name: 'Required.' },
    });
    expect(partOf(container, 'title')!.textContent!.trim()).toBe('Corrige 2 campos');
    const one = inSpanish(ValidationSummary, { errors: { email: 'Required.' } });
    expect(partOf(one.container, 'title')!.textContent!.trim()).toBe('Corrige 1 campo');
    const own = inSpanish(ValidationSummary, { errors: { email: 'x' }, title: 'Revisa' });
    expect(partOf(own.container, 'title')!.textContent!.trim()).toBe('Revisa');
  });
});
