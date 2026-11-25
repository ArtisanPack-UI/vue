import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h, type Component } from 'vue';
import { Calendar, Table } from '../../components/data';
import { TranslationProvider, type TranslationMessages } from '../../i18n/translator';

/** Renders `component` under a French TranslationProvider with `messages`. */
function renderInFrench(
  component: Component,
  props: Record<string, unknown>,
  messages: TranslationMessages,
) {
  return render(() =>
    h(TranslationProvider, { locale: 'fr', messages }, () => h(component, props)),
  );
}

const headers = [{ key: 'name', label: 'Name' }];
const rows = [{ id: 1, name: 'Olivia' }];

describe('data translations', () => {
  it("translates the Calendar text and formats in the provider's locale", () => {
    const messages = { Week: 'Semaine', Today: 'Aujourd’hui' };
    const { container } = renderInFrench(Calendar, { today: '2026-11-07', id: 'cal' }, messages);
    expect(screen.getByRole('tab', { name: 'Semaine' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Aujourd’hui' })).toBeTruthy();
    expect(container.querySelector('#cal-title')!.textContent?.trim()).toBe('novembre 2026');
  });

  it('keeps a Calendar locale prop and labels over the provider', () => {
    const { container } = renderInFrench(
      Calendar,
      { today: '2026-11-07', id: 'cal', locale: 'en-US', labels: { week: 'Wk' } },
      { Week: 'Semaine' },
    );
    expect(screen.getByRole('tab', { name: 'Wk' })).toBeTruthy();
    expect(container.querySelector('#cal-title')!.textContent?.trim()).toBe('November 2026');
  });

  it('translates the Table names and empty text, a selectAllLabel winning', () => {
    const messages = {
      'Select all': 'Tout sélectionner',
      'Select {row}': 'Sélectionner {row}',
      'Sort by {column}': 'Trier par {column}',
      'No records found.': 'Aucun enregistrement.',
    };
    renderInFrench(
      Table,
      { headers: [{ key: 'name', label: 'Name', sortable: true }], rows, selectable: true },
      messages,
    );
    expect(screen.getByRole('checkbox', { name: 'Tout sélectionner' })).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'Sélectionner Olivia' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Trier par Name' })).toBeTruthy();

    const empty = renderInFrench(Table, { headers, rows: [] }, messages);
    expect(empty.container.textContent).toContain('Aucun enregistrement.');

    renderInFrench(
      Table,
      { headers, rows, selectable: true, selectAllLabel: 'Everything' },
      messages,
    );
    expect(screen.getByRole('checkbox', { name: 'Everything' })).toBeTruthy();
  });
});
