import { describe, it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { Password } from '../../components/form';
import { passwordStrength } from '../../components/_shared/form-text';

const partOf = (container: Element, name: string) =>
  container.querySelector(`[data-scope="password"][data-part="${name}"]`);

describe('Password', () => {
  it('renders the field anatomy with a reveal button', () => {
    const { container } = render(Password, {
      props: { label: 'Password', leadingIcon: 'lock', hint: 'Hint', error: 'Bad' },
      attrs: { id: 'p' },
    });
    const root = container.querySelector('.apui-password')!;
    expect(root.getAttribute('data-size')).toBe('md');
    expect(
      [...partOf(container, 'box')!.children].map((el) => el.getAttribute('data-part')),
    ).toEqual(['icon', 'control', 'reveal']);
    const control = partOf(container, 'control')!;
    expect(control.getAttribute('type')).toBe('password');
    expect(control.getAttribute('autocomplete')).toBe('current-password');
    expect(control.getAttribute('aria-describedby')).toBe('p-hint p-error');
    const reveal = partOf(container, 'reveal')!;
    expect(reveal.getAttribute('type')).toBe('button');
    expect(reveal.getAttribute('aria-label')).toBe('Show password');
    expect(reveal.getAttribute('aria-pressed')).toBe('false');
    expect(reveal.getAttribute('aria-controls')).toBe('p');
    expect(reveal.querySelectorAll('svg[data-icon]')).toHaveLength(2);
  });

  it('reveals and hides the value with aria-pressed and a fixed name', async () => {
    const { container } = render(Password, {
      props: { label: 'Password', revealLabel: 'Mostrar' },
    });
    const reveal = partOf(container, 'reveal')!;
    await fireEvent.click(reveal);
    expect(partOf(container, 'control')!.getAttribute('type')).toBe('text');
    expect(reveal.getAttribute('aria-pressed')).toBe('true');
    expect(reveal.getAttribute('aria-label')).toBe('Mostrar');
    await fireEvent.click(reveal);
    expect(partOf(container, 'control')!.getAttribute('type')).toBe('password');
    expect(reveal.getAttribute('aria-pressed')).toBe('false');
  });

  it('disables the reveal button with the field', () => {
    const { container } = render(Password, { props: { label: 'Password', disabled: true } });
    expect(partOf(container, 'reveal')!.hasAttribute('disabled')).toBe(true);
    expect(container.querySelector('.apui-password')!.hasAttribute('data-disabled')).toBe(true);
  });

  it('uses the autocomplete prop', () => {
    const { container } = render(Password, { props: { label: 'P', autocomplete: 'new-password' } });
    expect(partOf(container, 'control')!.getAttribute('autocomplete')).toBe('new-password');
  });

  it('scores strength the same way in every stack', () => {
    expect(passwordStrength('')).toBe(0);
    expect(passwordStrength('abc')).toBe(1);
    expect(passwordStrength('password1')).toBe(1);
    expect(passwordStrength('Password1')).toBe(2);
    expect(passwordStrength('Password1!')).toBe(3);
    expect(passwordStrength('Password12345!')).toBe(4);
  });

  it('shows the meter and announces the level name', async () => {
    const { container } = render(Password, {
      props: { label: 'Password', strengthMeter: true, labels: { fair: 'Regular' } },
    });
    const strength = partOf(container, 'strength')!;
    expect(strength.getAttribute('aria-hidden')).toBe('true');
    expect(strength.getAttribute('data-level')).toBe('0');
    expect(strength.querySelectorAll('[data-part="segment"]')).toHaveLength(4);
    const label = partOf(container, 'strengthLabel')!;
    expect(label.textContent).toContain('Strength');
    await fireEvent.update(partOf(container, 'control')!, 'Password1');
    expect(strength.getAttribute('data-level')).toBe('2');
    expect(label.querySelector('[aria-live="polite"]')!.textContent).toBe('Regular');
  });

  it('checks the requirements as people type and says so in text', async () => {
    const { container, emitted } = render(Password, {
      props: {
        label: 'Password',
        requirements: [
          { label: 'At least 12 characters', pattern: '.{12,}' },
          { label: 'One number', pattern: '\\d' },
          { label: 'Broken', pattern: '(' },
        ],
      },
      attrs: { id: 'p' },
    });
    const list = partOf(container, 'requirements')!;
    expect(list.id).toBe('p-requirements');
    expect(partOf(container, 'control')!.getAttribute('aria-describedby')).toBe('p-requirements');
    await fireEvent.update(partOf(container, 'control')!, 'abc1');
    expect(emitted()['update:modelValue']).toEqual([['abc1']]);
    const items = [...list.querySelectorAll('[data-part="requirement"]')];
    expect(items.map((item) => item.hasAttribute('data-met'))).toEqual([false, true, false]);
    expect(items[1]!.textContent).toContain('(Met)');
    expect(items[0]!.textContent).toContain('(Not met)');
  });
});
