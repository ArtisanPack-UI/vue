import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { ValidationSummary } from '../../components/form';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

const errors = [
  { field: 'postal', message: 'Spanish postal codes have 5 digits.' },
  { field: 'photos', message: 'Add at least 2 more photos.' },
];

describe('ValidationSummary', () => {
  it('renders nothing without errors', () => {
    const { container } = render(ValidationSummary, { props: { errors: [] } });
    expect(container.querySelector('.apui-validation-summary')).toBeNull();
  });

  it('lists each error as a link to its field, as a focused alert', async () => {
    const { container } = render(ValidationSummary, { props: { errors } });
    await settle();
    const root = container.querySelector('.apui-validation-summary') as HTMLElement;
    expect(root.getAttribute('role')).toBe('alert');
    expect(root.getAttribute('tabindex')).toBe('-1');
    expect(root.getAttribute('data-color')).toBe('error');
    expect(document.activeElement).toBe(root);
    expect(root.querySelector('[data-part="title"]')!.textContent!.trim()).toBe('Fix 2 fields');
    const links = [...root.querySelectorAll('a[data-part="link"]')];
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['#postal', '#photos']);
    expect(root.querySelectorAll('li[data-part="item"]')).toHaveLength(2);
    expect(root.querySelector('[data-part="icon"]')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('takes a map of field to messages', () => {
    const { container } = render(ValidationSummary, {
      props: { errors: { email: ['Enter a valid email.', 'Second'], name: 'Required.' } },
    });
    const links = [...container.querySelectorAll('a[data-part="link"]')];
    expect(links.map((link) => link.textContent)).toEqual(['Enter a valid email.', 'Required.']);
    expect(container.querySelector('[data-part="title"]')!.textContent!.trim()).toBe(
      'Fix 2 fields',
    );
  });

  it('is a status, not focused, for warnings', async () => {
    const { container } = render(ValidationSummary, {
      props: { errors: [errors[0]!], color: 'warning' },
    });
    await settle();
    const root = container.querySelector('.apui-validation-summary') as HTMLElement;
    expect(root.getAttribute('role')).toBe('status');
    expect(root.hasAttribute('tabindex')).toBe(false);
    expect(document.activeElement).not.toBe(root);
    expect(root.querySelector('[data-part="title"]')!.textContent!.trim()).toBe('1 recommendation');
  });

  it('moves focus to the field by id, then by name, then by wire:model', async () => {
    const byId = document.createElement('input');
    byId.id = 'postal';
    const byName = document.createElement('input');
    byName.name = 'photos';
    const byModel = document.createElement('input');
    byModel.setAttribute('wire:model.live', 'terms');
    document.body.append(byId, byName, byModel);
    const { container } = render(ValidationSummary, {
      props: { errors: [...errors, { field: 'terms', message: 'Accept the terms.' }] },
    });
    await settle();
    const links = [...container.querySelectorAll('a[data-part="link"]')];
    await fireEvent.click(links[0]!);
    expect(document.activeElement).toBe(byId);
    await fireEvent.click(links[1]!);
    expect(document.activeElement).toBe(byName);
    await fireEvent.click(links[2]!);
    expect(document.activeElement).toBe(byModel);
  });

  it('focuses itself when errors first appear and uses a custom title', async () => {
    const list = ref<{ field: string; message: string }[]>([]);
    const { container } = render(
      defineComponent({
        render: () => h(ValidationSummary, { errors: list.value, title: 'Fix these' }),
      }),
    );
    list.value = errors;
    await nextTick();
    await settle();
    const root = container.querySelector('.apui-validation-summary') as HTMLElement;
    expect(document.activeElement).toBe(root);
    expect(root.querySelector('[data-part="title"]')!.textContent!.trim()).toBe('Fix these');
  });
});
