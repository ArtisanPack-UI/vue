import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import { Button, Checkbox, Input, Password, Pin, Radio, Range, Select, Textarea, Toggle } from '../../components/form';

describe('Form components accessibility', () => {
  it('Button has no a11y violations', async () => {
    const { container } = render(Button, { props: { label: 'Submit' } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Button with loading state has no a11y violations', async () => {
    const { container } = render(Button, { props: { label: 'Loading', loading: true } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Checkbox has no a11y violations', async () => {
    const { container } = render(Checkbox, { props: { label: 'Accept terms', modelValue: false } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Input has no a11y violations', async () => {
    const { container } = render(Input, { props: { label: 'Email', type: 'email' } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Input with error has no a11y violations', async () => {
    const { container } = render(Input, {
      props: { label: 'Email', type: 'email', error: 'Invalid email' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Password has no a11y violations', async () => {
    const { container } = render(Password, { props: { label: 'Password' } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Pin has no a11y violations', async () => {
    const { container } = render(Pin, { props: { length: 4 } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Radio has no a11y violations', async () => {
    const { container } = render(Radio, {
      props: {
        label: 'Color',
        modelValue: '',
        options: [
          { id: 'red', name: 'Red' },
          { id: 'blue', name: 'Blue' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Range has no a11y violations', async () => {
    const { container } = render(Range, {
      props: { label: 'Volume', modelValue: 50, min: 0, max: 100 },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Select has no a11y violations', async () => {
    const { container } = render(Select, {
      props: {
        label: 'Country',
        options: [
          { id: '1', name: 'USA' },
          { id: '2', name: 'Canada' },
        ],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Textarea has no a11y violations', async () => {
    const { container } = render(Textarea, { props: { label: 'Comments' } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Toggle has no a11y violations', async () => {
    const { container } = render(Toggle, { props: { label: 'Notifications', modelValue: false } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
