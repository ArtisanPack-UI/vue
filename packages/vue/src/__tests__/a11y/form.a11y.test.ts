import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { axe } from 'vitest-axe';
import {
  Button,
  Checkbox,
  Fieldset,
  Form,
  Input,
  Password,
  Pin,
  Radio,
  Range,
  Select,
  Textarea,
  Toggle,
  ValidationSummary,
} from '../../components/form';

describe('Form components accessibility', () => {
  it('Button has no a11y violations', async () => {
    const { container } = render(Button, { slots: { default: 'Submit' } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Button with loading state has no a11y violations', async () => {
    const { container } = render(Button, {
      props: { loading: true },
      slots: { default: 'Loading' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Checkbox has no a11y violations', async () => {
    const { container } = render(Checkbox, { props: { label: 'Accept terms', checked: false } });
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

  it('Input with every part has no a11y violations', async () => {
    const { container } = render(Input, {
      props: {
        label: 'Email',
        required: true,
        hint: 'We never share it.',
        prefix: 'to:',
        suffix: '@work',
        leadingIcon: 'mail',
        trailingIcon: 'search',
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Input without a visible label has no a11y violations', async () => {
    const { container } = render(Input, {
      props: { placeholder: 'Enter text...' },
      attrs: { 'aria-label': 'Search' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Password has no a11y violations', async () => {
    const { container } = render(Password, { props: { label: 'Password' } });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Password with every part has no a11y violations', async () => {
    const { container } = render(Password, {
      props: {
        label: 'Password',
        required: true,
        leadingIcon: 'lock',
        hint: 'Use a password you do not use elsewhere.',
        error: 'Passwords do not match.',
        strengthMeter: true,
        modelValue: 'summit-trail',
        requirements: [{ label: 'At least 12 characters', pattern: '.{12,}' }],
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Pin has no a11y violations', async () => {
    const { container } = render(Pin, {
      props: { label: 'Verification code', length: 6, groupSize: 3, modelValue: '482' },
    });
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

  it('Range with two thumbs and marks has no a11y violations', async () => {
    const { container } = render(Range, {
      props: {
        label: 'Price',
        dual: true,
        modelValue: [200, 450],
        min: 100,
        max: 700,
        format: '${value}k',
        marks: [
          { value: 100, label: '$100k' },
          { value: 700, label: '$700k' },
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
          { value: 'us', label: 'USA' },
          { value: 'ca', label: 'Canada' },
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

  it('Textarea with a counter has no a11y violations', async () => {
    const { container } = render(Textarea, {
      props: { label: 'Notes', maxLength: 20, modelValue: 'Nearly at the limit' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Toggle has no a11y violations', async () => {
    const { container } = render(Toggle, {
      props: { label: 'Notifications', description: 'Every Monday.', checked: true },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Fieldset has no a11y violations', async () => {
    const { container } = render(Fieldset, {
      props: { title: 'Contact', description: 'Who to reach.' },
      slots: { default: '<label for="n">Name</label><input id="n" />' },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Form has no a11y violations', async () => {
    const { container } = render(Form, {
      attrs: { 'aria-label': 'Invite' },
      slots: {
        default: '<label for="e">Email</label><input id="e" />',
        actions: '<button>Send</button>',
      },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ValidationSummary has no a11y violations', async () => {
    const { container } = render(ValidationSummary, {
      props: { errors: [{ field: 'email', message: 'Enter a valid email.' }] },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
