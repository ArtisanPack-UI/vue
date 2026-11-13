import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { Form } from '../../components/form';

describe('Form', () => {
  it('renders a native form with the fields and the actions row', () => {
    const { container } = render(Form, {
      attrs: { 'aria-label': 'Invite' },
      slots: { default: '<input aria-label="Email" />', actions: '<button>Send</button>' },
    });
    const root = container.querySelector('form.apui-form')!;
    expect(root.getAttribute('aria-label')).toBe('Invite');
    expect(root.hasAttribute('data-divided')).toBe(false);
    const actions = root.querySelector('[data-scope="form"][data-part="actions"]')!;
    expect(actions.querySelector('button')).not.toBeNull();
    expect(root.lastElementChild).toBe(actions);
  });

  it('omits the actions row when empty and flags divided', () => {
    const { container } = render(Form, { props: { divided: true }, slots: { default: 'Fields' } });
    expect(container.querySelector('[data-part="actions"]')).toBeNull();
    expect(container.querySelector('form')!.hasAttribute('data-divided')).toBe(true);
  });

  it('passes the submit listener to the form', async () => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    const { container } = render(Form, { attrs: { onSubmit }, props: { actions: 'Save' } });
    await fireEvent.submit(container.querySelector('form')!);
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(container.querySelector('[data-part="actions"]')!.textContent).toBe('Save');
  });
});
