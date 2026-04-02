import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { nextTick } from 'vue';
import { Popover } from '../../components/layout';

describe('Popover', () => {
  it('renders trigger slot', () => {
    render(Popover, {
      slots: { trigger: '<button>Open</button>', default: 'Popover content' },
    });
    expect(screen.getByText('Open')).toBeTruthy();
  });

  it('renders content slot', () => {
    const { container } = render(Popover, {
      slots: { trigger: '<button>Open</button>', default: 'Popover body' },
    });
    expect(container.querySelector('[role="dialog"]')).toBeTruthy();
  });

  it('does not have dropdown-open class when closed', () => {
    const { container } = render(Popover, {
      slots: { trigger: '<button>Open</button>', default: 'Hidden content' },
    });
    expect(container.querySelector('.dropdown-open')).toBeFalsy();
  });

  it('adds dropdown-open class after clicking trigger in click mode', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'click' },
      slots: { trigger: '<button>Open</button>', default: 'Visible content' },
    });
    await fireEvent.click(screen.getByText('Open'));
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();
  });

  it('sets aria-expanded to true when open', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'click' },
      slots: { trigger: '<button>Open</button>', default: 'Content' },
    });
    await fireEvent.click(screen.getByText('Open'));
    await nextTick();
    const trigger = container.querySelector('[aria-expanded]');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  });

  it('toggles dropdown-open on and off on click in uncontrolled click mode', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'click' },
      slots: { trigger: '<button>Click me</button>', default: 'Content' },
    });
    await fireEvent.click(screen.getByText('Click me'));
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    await fireEvent.click(screen.getByText('Click me'));
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeFalsy();
  });

  it('adds dropdown-open on mouse enter in hover mode', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'hover', showDelay: 0, hideDelay: 0 },
      slots: { trigger: '<button>Hover</button>', default: 'Hover content' },
    });
    const wrapper = container.firstElementChild!;
    await fireEvent.mouseEnter(wrapper);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    await fireEvent.mouseLeave(wrapper);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeFalsy();
  });

  it('applies position class', () => {
    const { container } = render(Popover, {
      props: { position: 'top' },
      slots: { trigger: '<button>Open</button>', default: 'Content' },
    });
    expect(container.querySelector('.dropdown-top')).toBeTruthy();
  });

  it('opens on focus and closes on blur in hover mode', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'hover', showDelay: 0, hideDelay: 0 },
      slots: { trigger: '<button>Focus me</button>', default: 'Focus content' },
    });
    const triggerEl = container.querySelector('[aria-expanded]') as HTMLElement;
    await fireEvent.focusIn(triggerEl);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    await fireEvent.focusOut(triggerEl);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeFalsy();
  });

  it('keeps popover open when focus moves from trigger to content in hover mode', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'hover', showDelay: 0, hideDelay: 0 },
      slots: {
        trigger: '<button>Focus me</button>',
        default: '<button>Content button</button>',
      },
    });
    const triggerEl = container.querySelector('[aria-expanded]') as HTMLElement;
    const contentButton = container.querySelector('[role="dialog"] button') as HTMLElement;

    await fireEvent.focusIn(triggerEl);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    // Focus moves from trigger into content — popover should stay open
    await fireEvent.focusOut(triggerEl, { relatedTarget: contentButton });
    await fireEvent.focusIn(contentButton);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();
  });

  it('persistent popover can still be toggled via trigger click', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'click', persistent: true },
      slots: { trigger: '<button>Click me</button>', default: 'Persistent' },
    });
    await fireEvent.click(screen.getByText('Click me'));
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    await fireEvent.click(screen.getByText('Click me'));
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeFalsy();
  });

  it('persistent hover popover closes on mouse leave', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'hover', persistent: true, showDelay: 0, hideDelay: 0 },
      slots: { trigger: '<button>Hover</button>', default: 'Persistent hover' },
    });
    const wrapper = container.firstElementChild!;
    await fireEvent.mouseEnter(wrapper);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    await fireEvent.mouseLeave(wrapper);
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeFalsy();
  });

  it('Escape closes non-persistent popover', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'click' },
      slots: { trigger: '<button>Open</button>', default: 'Content' },
    });
    await fireEvent.click(screen.getByText('Open'));
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    await fireEvent.keyDown(container.firstElementChild as HTMLElement, { key: 'Escape' });
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeFalsy();
  });

  it('Escape does not close persistent popover', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'click', persistent: true },
      slots: { trigger: '<button>Open</button>', default: 'Content' },
    });
    await fireEvent.click(screen.getByText('Open'));
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    await fireEvent.keyDown(container.firstElementChild as HTMLElement, { key: 'Escape' });
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();
  });

  it('Enter/Space only toggles when trigger has focus', async () => {
    const { container } = render(Popover, {
      props: { triggerMode: 'click' },
      slots: {
        trigger: '<button>Trigger</button>',
        default: '<button>Inner Button</button>',
      },
    });

    const triggerWrapper = container.querySelector('[aria-expanded]') as HTMLElement;

    // Enter on trigger should open
    await fireEvent.keyDown(triggerWrapper, { key: 'Enter' });
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    // Space on trigger should close
    await fireEvent.keyDown(triggerWrapper, { key: ' ' });
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeFalsy();

    // Re-open for content descendant test
    await fireEvent.keyDown(triggerWrapper, { key: 'Enter' });
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    // Enter/Space on content descendant should NOT toggle the popover
    const innerButton = container.querySelector('[role="dialog"] button') as HTMLElement;
    await fireEvent.keyDown(innerButton, { key: 'Enter' });
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();

    await fireEvent.keyDown(innerButton, { key: ' ' });
    await nextTick();
    expect(container.querySelector('.dropdown-open')).toBeTruthy();
  });
});
