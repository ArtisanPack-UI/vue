import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/vue';
import { nextTick } from 'vue';
import { Signature } from '../../components/form';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="signature"][data-part="${name}"]`);

const PNG = 'data:image/png;base64,AAAA';

/** jsdom has no canvas: give it a context that draws nothing and a fixed PNG. */
beforeEach(() => {
  const context = new Proxy(
    { measureText: () => ({ width: 100 }) },
    { get: (target, key) => (key in target ? target[key as 'measureText'] : () => {}) },
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(PNG);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Signature', () => {
  it('renders the contract anatomy as a labelled group', () => {
    const { container } = render(Signature, {
      props: { label: 'Signature', required: true, hint: 'Olivia Rhye', error: 'Sign it.' },
      attrs: { id: 'sig' },
    });
    const parts = [...container.querySelectorAll('[data-scope="signature"]')].map((el) =>
      el.getAttribute('data-part'),
    );
    expect([...new Set(parts)]).toEqual([
      'label',
      'required',
      'modes',
      'mode',
      'pad',
      'line',
      'mark',
      'ink',
      'typed',
      'upload',
      'tools',
      'undo',
      'clear',
      'placeholder',
      'hint',
      'error',
      'status',
    ]);
    const root = container.querySelector('.apui-signature')!;
    expect(root.getAttribute('role')).toBe('group');
    expect(root.getAttribute('aria-labelledby')).toBe('sig-label');
    expect(root.getAttribute('aria-describedby')).toBe('sig-hint sig-error');
    expect(root.getAttribute('data-mode')).toBe('draw');
    expect(root.getAttribute('data-pen-color')).toBe('default');
    expect(root.hasAttribute('data-invalid')).toBe(true);
    expect(partOf(container, 'ink')!.getAttribute('role')).toBe('img');
    expect(partOf(container, 'status')!.getAttribute('aria-live')).toBe('polite');
  });

  it('always offers type mode', () => {
    const { container } = render(Signature, { props: { modes: ['draw'], mode: 'upload' } });
    const modes = [...container.querySelectorAll('[data-part="mode"]')].map((el) =>
      el.getAttribute('data-value'),
    );
    expect(modes).toEqual(['draw', 'type']);
    expect(partOf(container, 'upload')).toBeNull();
    expect(container.querySelector('.apui-signature')!.getAttribute('data-mode')).toBe('draw');
  });

  it('switches modes with toggle buttons and shows that mode’s parts', async () => {
    const { container } = render(Signature);
    await fireEvent.click(screen.getByRole('button', { name: 'Type' }));
    expect(screen.getByRole('button', { name: 'Type' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Draw' }).getAttribute('aria-pressed')).toBe('false');
    expect(partOf(container, 'ink')!.hasAttribute('hidden')).toBe(true);
    expect(partOf(container, 'tools')!.hasAttribute('hidden')).toBe(true);
    expect(partOf(container, 'typed')!.hasAttribute('hidden')).toBe(false);
    expect(container.querySelector('.apui-signature')!.getAttribute('data-mode')).toBe('type');
  });

  it('turns a typed name into a PNG value and clears it', async () => {
    const { container, emitted } = render(Signature, {
      props: { mode: 'type' },
      attrs: { name: 'signature' },
    });
    const typed = partOf(container, 'typed') as HTMLInputElement;
    await fireEvent.update(typed, 'Olivia Rhye');
    expect(emitted()['update:modelValue']).toEqual([[PNG]]);
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe('signature');
    expect(hidden.value).toBe(PNG);
    await fireEvent.update(typed, '');
    expect(emitted()['update:modelValue']!.at(-1)).toEqual(['']);
  });

  it('clears a signature from the tools and announces it', async () => {
    const { container, emitted } = render(Signature, { props: { modelValue: PNG } });
    await fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    await nextTick();
    expect(emitted()['update:modelValue']).toEqual([['']]);
    expect(partOf(container, 'status')!.textContent).toBe('Signature cleared.');
  });

  it('keeps undo and clear disabled until there is something to remove', () => {
    const { container } = render(Signature);
    expect((partOf(container, 'undo') as HTMLButtonElement).disabled).toBe(true);
    expect((partOf(container, 'clear') as HTMLButtonElement).disabled).toBe(true);
    expect(partOf(container, 'undo')!.getAttribute('aria-label')).toBe('Undo stroke');
  });

  it('disables every control', () => {
    const { container } = render(Signature, { props: { disabled: true, modelValue: PNG } });
    expect(container.querySelector('.apui-signature')!.hasAttribute('data-disabled')).toBe(true);
    for (const button of container.querySelectorAll('button')) {
      expect((button as HTMLButtonElement).disabled).toBe(true);
    }
  });

  it('takes label props, a placeholder and a pen color', () => {
    const { container } = render(Signature, {
      props: { clearLabel: 'Erase', placeholder: 'Sign here', penColor: 'primary' },
    });
    expect(partOf(container, 'clear')!.textContent).toContain('Erase');
    expect(partOf(container, 'placeholder')!.textContent).toBe('Sign here');
    expect(container.querySelector('.apui-signature')!.getAttribute('data-pen-color')).toBe(
      'primary',
    );
  });
});
