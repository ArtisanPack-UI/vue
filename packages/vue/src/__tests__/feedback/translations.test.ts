import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/vue';
import { h, nextTick, type Component } from 'vue';
import { TranslationProvider, type TranslationMessages } from '../../i18n/translator';
import { Alert, ErrorDisplay, Loading, Toast, Toaster, toast } from '../../components/feedback';
import { defaultToaster } from '../../components/feedback/Toast/toaster';

const fr: TranslationMessages = {
  Dismiss: 'Fermer',
  Loading: 'Chargement',
  'Dismiss notification': 'Fermer la notification',
  Notifications: 'Avis',
  'Something went wrong': 'Une erreur est survenue',
  'Try again': 'Réessayer',
};

/** Renders `component` under a French provider. */
function renderFr(component: Component, props: Record<string, unknown> = {}) {
  return render(() =>
    h(TranslationProvider, { locale: 'fr', messages: fr }, () => h(component, props)),
  );
}

/** Lets the machines' effects run. */
const settle = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

describe('feedback translations', () => {
  afterEach(() => {
    toast.remove();
    defaultToaster.remove();
  });

  it("translates and overrides Alert's close button", () => {
    renderFr(Alert, { title: 'Saved', dismissible: true });
    expect(screen.getByRole('button', { name: 'Fermer' })).toBeTruthy();
    document.body.innerHTML = '';
    renderFr(Alert, { title: 'Saved', dismissible: true, closeLabel: 'Hide' });
    expect(screen.getByRole('button', { name: 'Hide' })).toBeTruthy();
  });

  it("translates and overrides Loading's label", () => {
    expect(renderFr(Loading).container.textContent).toContain('Chargement');
    expect(renderFr(Loading, { label: 'Fetching' }).container.textContent).toContain('Fetching');
  });

  it("translates and overrides Toast's close button", () => {
    renderFr(Toast, { title: 'Saved' });
    expect(screen.getByRole('button', { name: 'Fermer la notification' })).toBeTruthy();
    document.body.innerHTML = '';
    renderFr(Toast, { title: 'Saved', closeLabel: 'Hide' });
    expect(screen.getByRole('button', { name: 'Hide' })).toBeTruthy();
  });

  it("translates the Toaster's region and close buttons", async () => {
    renderFr(Toaster);
    toast.create({ title: 'Saved', duration: 0 });
    await settle();
    const region = document.body.querySelector('[data-scope="toast"][data-part="group"]')!;
    expect(region.getAttribute('aria-label')).toContain('Avis');
    expect(screen.getByRole('button', { name: 'Fermer la notification' })).toBeTruthy();
  });

  it("keeps the Toaster's explicit labels", async () => {
    renderFr(Toaster, { label: 'Alerts', closeLabel: 'Hide' });
    toast.create({ title: 'Saved', duration: 0 });
    await settle();
    const region = document.body.querySelector('[data-scope="toast"][data-part="group"]')!;
    expect(region.getAttribute('aria-label')).toContain('Alerts');
    expect(screen.getByRole('button', { name: 'Hide' })).toBeTruthy();
  });

  it('translates and overrides the deprecated ErrorDisplay', () => {
    renderFr(ErrorDisplay, { retryable: true });
    expect(screen.getByText('Une erreur est survenue')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Réessayer' })).toBeTruthy();
    document.body.innerHTML = '';
    renderFr(ErrorDisplay, { retryable: true, title: 'Oops', retryLabel: 'Again' });
    expect(screen.getByText('Oops')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Again' })).toBeTruthy();
  });
});
