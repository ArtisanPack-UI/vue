import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  button: 'src-components-form-button-button-story-vue',
  checkbox: 'src-components-form-checkbox-checkbox-story-vue',
  colorPicker: 'src-components-form-colorpicker-colorpicker-story-vue',
  datePicker: 'src-components-form-datepicker-datepicker-story-vue',
  editor: 'src-components-form-editor-editor-story-vue',
  file: 'src-components-form-file-file-story-vue',
  input: 'src-components-form-input-input-story-vue',
  password: 'src-components-form-password-password-story-vue',
  pin: 'src-components-form-pin-pin-story-vue',
  radio: 'src-components-form-radio-radio-story-vue',
  range: 'src-components-form-range-range-story-vue',
  richTextEditor: 'src-components-form-richtexteditor-richtexteditor-story-vue',
  select: 'src-components-form-select-select-story-vue',
  textarea: 'src-components-form-textarea-textarea-story-vue',
  toggle: 'src-components-form-toggle-toggle-story-vue',
};

test.describe('Form / Button', () => {
  test('colors', async ({ page }) => {
    await testVariant(page, STORY.button, 1, 'button-colors');
  });

  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.button, 2, 'button-sizes');
  });

  test('loading', async ({ page }) => {
    await testVariant(page, STORY.button, 3, 'button-loading');
  });

  test('disabled', async ({ page }) => {
    await testVariant(page, STORY.button, 6, 'button-disabled');
  });
});

test.describe('Form / Input', () => {
  test('with label and hint', async ({ page }) => {
    await testVariant(page, STORY.input, 1, 'input-label-hint');
  });

  test('with error', async ({ page }) => {
    await testVariant(page, STORY.input, 2, 'input-error');
  });

  test('disabled', async ({ page }) => {
    await testVariant(page, STORY.input, 5, 'input-disabled');
  });

  test('input types', async ({ page }) => {
    await testVariant(page, STORY.input, 6, 'input-types');
  });
});

test.describe('Form / Checkbox', () => {
  test('colors', async ({ page }) => {
    await testVariant(page, STORY.checkbox, 1, 'checkbox-colors');
  });

  test('card style', async ({ page }) => {
    await testVariant(page, STORY.checkbox, 2, 'checkbox-card-style');
  });
});

test.describe('Form / Select', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.select, 0, 'select-default');
  });

  test('with error', async ({ page }) => {
    await testVariant(page, STORY.select, 1, 'select-error');
  });

  test('disabled', async ({ page }) => {
    await testVariant(page, STORY.select, 2, 'select-disabled');
  });
});

test.describe('Form / Textarea', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.textarea, 0, 'textarea-default');
  });

  test('with error', async ({ page }) => {
    await testVariant(page, STORY.textarea, 1, 'textarea-error');
  });
});

test.describe('Form / Toggle', () => {
  test('colors', async ({ page }) => {
    await testVariant(page, STORY.toggle, 1, 'toggle-colors');
  });
});

test.describe('Form / Radio', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.radio, 0, 'radio-default');
  });

  test('card style', async ({ page }) => {
    await testVariant(page, STORY.radio, 2, 'radio-card-style');
  });
});

test.describe('Form / Range', () => {
  test('colors', async ({ page }) => {
    await testVariant(page, STORY.range, 1, 'range-colors');
  });
});

test.describe('Form / Password', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.password, 0, 'password-default');
  });

  test('with error', async ({ page }) => {
    await testVariant(page, STORY.password, 1, 'password-error');
  });
});

test.describe('Form / Pin', () => {
  test('4-digit numeric', async ({ page }) => {
    await testVariant(page, STORY.pin, 1, 'pin-numeric');
  });
});

test.describe('Form / File', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.file, 0, 'file-default');
  });

  test('drag and drop', async ({ page }) => {
    await testVariant(page, STORY.file, 1, 'file-drag-drop');
  });
});

test.describe('Form / ColorPicker', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.colorPicker, 0, 'colorpicker-default');
  });
});

test.describe('Form / DatePicker', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.datePicker, 0, 'datepicker-default');
  });
});

test.describe('Form / Editor', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.editor, 0, 'editor-default');
  });
});

test.describe('Form / RichTextEditor', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.richTextEditor, 0, 'richtexteditor-default');
  });
});
