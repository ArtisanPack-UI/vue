import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, reactive, ref } from 'vue';

const form = reactive({
  processing: false,
  recentlySuccessful: false,
  isDirty: false,
  errors: {} as Record<string, string>,
  reset: vi.fn(),
  clearErrors: vi.fn(),
  submit: vi.fn(),
});

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({ props: {} }),
  useForm: () => form,
}));

import InertiaForm from '../../../components/form/InertiaForm.vue';

describe('InertiaForm', () => {
  it('passes processing, recentlySuccessful and isDirty to its slot as booleans that stay reactive', async () => {
    const seen: Record<string, unknown>[] = [];
    const { container } = render(InertiaForm, {
      props: { data: {} },
      slots: {
        default: (slotProps: Record<string, unknown>) => {
          seen.push(slotProps);
          return h(
            'button',
            { disabled: slotProps.processing as boolean },
            `${slotProps.processing}|${slotProps.recentlySuccessful}|${slotProps.isDirty}`,
          );
        },
      },
    });

    const latest = () => seen.at(-1)!;
    expect(typeof latest().processing).toBe('boolean');
    expect(typeof latest().recentlySuccessful).toBe('boolean');
    expect(typeof latest().isDirty).toBe('boolean');
    expect(container.querySelector('button')!.disabled).toBe(false);
    expect(container.textContent).toBe('false|false|false');

    form.processing = true;
    form.recentlySuccessful = true;
    form.isDirty = true;
    await nextTick();

    expect(latest().processing).toBe(true);
    expect(container.querySelector('button')!.disabled).toBe(true);
    expect(container.textContent).toBe('true|true|true');

    form.processing = false;
    form.recentlySuccessful = false;
    form.isDirty = false;
  });

  it('exposes unwrapped state on a template ref', async () => {
    const formRef = ref<{ processing: boolean; isDirty: boolean } | null>(null);
    render(
      defineComponent({
        setup: () => () => h(InertiaForm, { ref: formRef, data: {} }),
      }),
    );
    expect(formRef.value!.processing).toBe(false);
    form.processing = true;
    await nextTick();
    expect(formRef.value!.processing).toBe(true);
    form.processing = false;
  });

  it('submits to action with the method and emits success', async () => {
    form.submit.mockImplementation((_m: string, _u: string, options: { onSuccess?: () => void }) =>
      options.onSuccess?.(),
    );
    const { container, emitted } = render(InertiaForm, {
      props: { data: { name: '' }, action: '/users', method: 'put' },
      slots: { default: '<button type="submit">Save</button>' },
    });
    container.querySelector('form')!.dispatchEvent(new Event('submit'));
    expect(form.submit).toHaveBeenCalledWith('put', '/users', expect.any(Object));
    expect(emitted().success).toHaveLength(1);
  });
});
