import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { nextTick } from 'vue';
import { Collapse } from '../../components/layout';

describe('Collapse', () => {
  it('renders with title', () => {
    render(Collapse, { props: { title: 'Section' }, slots: { default: 'Content' } });
    expect(screen.getByText('Section')).toBeTruthy();
  });

  it('applies arrow icon class by default', () => {
    const { container } = render(Collapse, {
      props: { title: 'Test' },
      slots: { default: 'Content' },
    });
    expect(container.querySelector('.collapse-arrow')).toBeTruthy();
  });

  it('applies plus icon class', () => {
    const { container } = render(Collapse, {
      props: { title: 'Test', icon: 'plus' },
      slots: { default: 'Content' },
    });
    expect(container.querySelector('.collapse-plus')).toBeTruthy();
  });

  it('applies no icon class when icon is none', () => {
    const { container } = render(Collapse, {
      props: { title: 'Test', icon: 'none' },
      slots: { default: 'Content' },
    });
    expect(container.querySelector('.collapse-arrow')).toBeFalsy();
    expect(container.querySelector('.collapse-plus')).toBeFalsy();
  });

  it('applies bordered class', () => {
    const { container } = render(Collapse, {
      props: { title: 'Test', bordered: true },
      slots: { default: 'Content' },
    });
    expect(container.querySelector('.collapse-border')).toBeTruthy();
  });

  it('has correct ARIA attributes', () => {
    render(Collapse, { props: { title: 'Test' }, slots: { default: 'Content' } });
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBeTruthy();
  });

  it('toggles open state on click', async () => {
    render(Collapse, { props: { title: 'Test' }, slots: { default: 'Content' } });
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await fireEvent.click(trigger);
    await nextTick();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    await fireEvent.click(trigger);
    await nextTick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles on Enter key', async () => {
    render(Collapse, { props: { title: 'Test' }, slots: { default: 'Content' } });
    const trigger = screen.getByRole('button');

    await fireEvent.keyDown(trigger, { key: 'Enter' });
    await nextTick();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    await fireEvent.keyDown(trigger, { key: 'Enter' });
    await nextTick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles on Space key', async () => {
    render(Collapse, { props: { title: 'Test' }, slots: { default: 'Content' } });
    const trigger = screen.getByRole('button');

    await fireEvent.keyDown(trigger, { key: ' ' });
    await nextTick();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('starts open when defaultOpen is true', async () => {
    render(Collapse, {
      props: { title: 'Test', defaultOpen: true },
      slots: { default: 'Content' },
    });
    await nextTick();
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
  });

  it('renders slot content', () => {
    render(Collapse, { props: { title: 'Test' }, slots: { default: 'Inner content' } });
    expect(screen.getByText('Inner content')).toBeTruthy();
  });

  it('applies disabled styling and prevents toggle', async () => {
    const { container } = render(Collapse, {
      props: { title: 'Test', disabled: true },
      slots: { default: 'Content' },
    });
    expect(container.querySelector('.opacity-50')).toBeTruthy();

    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    await fireEvent.click(trigger);
    await nextTick();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('emits update:open in controlled mode', async () => {
    const { emitted } = render(Collapse, {
      props: { title: 'Test', open: false, 'onUpdate:open': () => {} },
      slots: { default: 'Content' },
    });
    const trigger = screen.getByRole('button');
    await fireEvent.click(trigger);
    expect(emitted()['update:open']).toBeTruthy();
    expect(emitted()['update:open'][0]).toEqual([true]);
  });
});
