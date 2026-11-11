import { test } from '@playwright/test';
import { testVariant } from './helpers';

const STORY = {
  button: 'src-components-form-button-button-story-vue',
  checkbox: 'src-components-form-checkbox-checkbox-story-vue',
  checkboxGroup: 'src-components-form-checkboxgroup-checkboxgroup-story-vue',
  codeEditor: 'src-components-form-codeeditor-codeeditor-story-vue',
  colorPicker: 'src-components-form-colorpicker-colorpicker-story-vue',
  combobox: 'src-components-form-combobox-combobox-story-vue',
  datePicker: 'src-components-form-datepicker-datepicker-story-vue',
  editor: 'src-components-form-editor-editor-story-vue',
  fieldset: 'src-components-form-fieldset-fieldset-story-vue',
  file: 'src-components-form-file-file-story-vue',
  form: 'src-components-form-form-form-story-vue',
  input: 'src-components-form-input-input-story-vue',
  password: 'src-components-form-password-password-story-vue',
  pin: 'src-components-form-pin-pin-story-vue',
  radio: 'src-components-form-radio-radio-story-vue',
  radioGroup: 'src-components-form-radiogroup-radiogroup-story-vue',
  range: 'src-components-form-range-range-story-vue',
  rating: 'src-components-form-rating-rating-story-vue',
  richTextEditor: 'src-components-form-richtexteditor-richtexteditor-story-vue',
  select: 'src-components-form-select-select-story-vue',
  signature: 'src-components-form-signature-signature-story-vue',
  textarea: 'src-components-form-textarea-textarea-story-vue',
  toggle: 'src-components-form-toggle-toggle-story-vue',
  validationSummary: 'src-components-form-validationsummary-validationsummary-story-vue',
};

test.describe('Form / Button', () => {
  test('variants', async ({ page }) => {
    await testVariant(page, STORY.button, 1, 'button-variants');
  });

  test('colors', async ({ page }) => {
    await testVariant(page, STORY.button, 2, 'button-colors');
  });

  test('sizes', async ({ page }) => {
    await testVariant(page, STORY.button, 3, 'button-sizes');
  });

  test('loading', async ({ page }) => {
    await testVariant(page, STORY.button, 4, 'button-loading');
  });

  test('icons', async ({ page }) => {
    await testVariant(page, STORY.button, 5, 'button-icons');
  });

  test('disabled', async ({ page }) => {
    await testVariant(page, STORY.button, 7, 'button-disabled');
  });
});

test.describe('Form / Input', () => {
  test('with label and hint', async ({ page }) => {
    await testVariant(page, STORY.input, 1, 'input-label-hint');
  });

  test('with error', async ({ page }) => {
    await testVariant(page, STORY.input, 2, 'input-error');
  });

  test('prefix, suffix and icons', async ({ page }) => {
    await testVariant(page, STORY.input, 3, 'input-affixes');
  });

  test('disabled', async ({ page }) => {
    await testVariant(page, STORY.input, 5, 'input-disabled');
  });

  test('input types', async ({ page }) => {
    await testVariant(page, STORY.input, 6, 'input-types');
  });
});

test.describe('Form / Checkbox', () => {
  test('states', async ({ page }) => {
    await testVariant(page, STORY.checkbox, 1, 'checkbox-states');
  });

  test('description and error', async ({ page }) => {
    await testVariant(page, STORY.checkbox, 2, 'checkbox-description-error');
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

test.describe('Form / Radio', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.radio, 0, 'radio-default');
  });

  test('card style', async ({ page }) => {
    await testVariant(page, STORY.radio, 2, 'radio-card-style');
  });
});

test.describe('Form / Editor', () => {
  test('default', async ({ page }) => {
    await testVariant(page, STORY.editor, 0, 'editor-default');
  });
});

test.describe('Form / Textarea', () => {
  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.textarea, 0, 'textarea-playground');
  });

  test('Counter', async ({ page }) => {
    await testVariant(page, STORY.textarea, 1, 'textarea-counter');
  });

  test('States', async ({ page }) => {
    await testVariant(page, STORY.textarea, 2, 'textarea-states');
  });
});

test.describe('Form / Toggle', () => {
  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.toggle, 0, 'toggle-playground');
  });

  test('Settings rows', async ({ page }) => {
    await testVariant(page, STORY.toggle, 1, 'toggle-settings-rows');
  });

  test('Sizes', async ({ page }) => {
    await testVariant(page, STORY.toggle, 2, 'toggle-sizes');
  });
});

test.describe('Form / Range', () => {
  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.range, 0, 'range-playground');
  });

  test('Two thumbs', async ({ page }) => {
    await testVariant(page, STORY.range, 1, 'range-two-thumbs');
  });

  test('Colors, sizes and states', async ({ page }) => {
    await testVariant(page, STORY.range, 2, 'range-colors-sizes-and-states');
  });
});

test.describe('Form / Password', () => {
  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.password, 0, 'password-playground');
  });

  test('Strength and requirements', async ({ page }) => {
    await testVariant(page, STORY.password, 1, 'password-strength-and-requirements');
  });

  test('Sizes', async ({ page }) => {
    await testVariant(page, STORY.password, 2, 'password-sizes');
  });
});

test.describe('Form / Pin', () => {
  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.pin, 0, 'pin-playground');
  });

  test('Masked and alphanumeric', async ({ page }) => {
    await testVariant(page, STORY.pin, 1, 'pin-masked-and-alphanumeric');
  });

  test('States and sizes', async ({ page }) => {
    await testVariant(page, STORY.pin, 2, 'pin-states-and-sizes');
  });
});

test.describe('Form / File', () => {
  test('Drop zone', async ({ page }) => {
    await testVariant(page, STORY.file, 0, 'file-drop-zone');
  });

  test('With files', async ({ page }) => {
    await testVariant(page, STORY.file, 1, 'file-with-files');
  });

  test('Compact', async ({ page }) => {
    await testVariant(page, STORY.file, 2, 'file-compact');
  });
});

test.describe('Form / ColorPicker', () => {
  test('Default', async ({ page }) => {
    await testVariant(page, STORY.colorPicker, 0, 'color-picker-default');
  });

  test('Swatches', async ({ page }) => {
    await testVariant(page, STORY.colorPicker, 1, 'color-picker-swatches');
  });

  test('Open, OKLCH', async ({ page }) => {
    await testVariant(page, STORY.colorPicker, 2, 'color-picker-open-oklch');
  });

  test('States', async ({ page }) => {
    await testVariant(page, STORY.colorPicker, 3, 'color-picker-states');
  });
});

test.describe('Form / DatePicker', () => {
  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.datePicker, 0, 'date-picker-playground');
  });

  test('Open in place', async ({ page }) => {
    await testVariant(page, STORY.datePicker, 1, 'date-picker-open-in-place');
  });

  test('Range', async ({ page }) => {
    await testVariant(page, STORY.datePicker, 2, 'date-picker-range');
  });

  test('Date and time', async ({ page }) => {
    await testVariant(page, STORY.datePicker, 3, 'date-picker-date-and-time');
  });

  test('Right to left', async ({ page }) => {
    await testVariant(page, STORY.datePicker, 4, 'date-picker-right-to-left');
  });
});

test.describe('Form / RichTextEditor', () => {
  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.richTextEditor, 0, 'rich-text-editor-playground');
  });

  test('Compact', async ({ page }) => {
    await testVariant(page, STORY.richTextEditor, 1, 'rich-text-editor-compact');
  });

  test('Markdown output', async ({ page }) => {
    await testVariant(page, STORY.richTextEditor, 2, 'rich-text-editor-markdown-output');
  });

  test('Invalid', async ({ page }) => {
    await testVariant(page, STORY.richTextEditor, 3, 'rich-text-editor-invalid');
  });
});

test.describe('Form / CheckboxGroup', () => {
  test('Select all', async ({ page }) => {
    await testVariant(page, STORY.checkboxGroup, 0, 'checkbox-group-select-all');
  });

  test('Columns', async ({ page }) => {
    await testVariant(page, STORY.checkboxGroup, 1, 'checkbox-group-columns');
  });

  test('Cards', async ({ page }) => {
    await testVariant(page, STORY.checkboxGroup, 2, 'checkbox-group-cards');
  });
});

test.describe('Form / CodeEditor', () => {
  test('Files, languages and diagnostics', async ({ page }) => {
    await testVariant(page, STORY.codeEditor, 0, 'code-editor-files-languages-and-diagnostics');
  });

  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.codeEditor, 1, 'code-editor-playground');
  });
});

test.describe('Form / Combobox', () => {
  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.combobox, 0, 'combobox-playground');
  });

  test('Tags (multiple + allowCreate)', async ({ page }) => {
    await testVariant(page, STORY.combobox, 1, 'combobox-tags-multiple-allowcreate');
  });

  test('Open with matches', async ({ page }) => {
    await testVariant(page, STORY.combobox, 2, 'combobox-open-with-matches');
  });

  test('Empty and invalid', async ({ page }) => {
    await testVariant(page, STORY.combobox, 3, 'combobox-empty-and-invalid');
  });
});

test.describe('Form / Fieldset', () => {
  test('Panel', async ({ page }) => {
    await testVariant(page, STORY.fieldset, 0, 'fieldset-panel');
  });

  test('Divided and plain', async ({ page }) => {
    await testVariant(page, STORY.fieldset, 1, 'fieldset-divided-and-plain');
  });
});

test.describe('Form / Form', () => {
  test('Basic', async ({ page }) => {
    await testVariant(page, STORY.form, 0, 'form-basic');
  });

  test('Divided, with a summary', async ({ page }) => {
    await testVariant(page, STORY.form, 1, 'form-divided-with-a-summary');
  });
});

test.describe('Form / RadioGroup', () => {
  test('Default', async ({ page }) => {
    await testVariant(page, STORY.radioGroup, 0, 'radio-group-default');
  });

  test('Cards', async ({ page }) => {
    await testVariant(page, STORY.radioGroup, 1, 'radio-group-cards');
  });

  test('Segmented', async ({ page }) => {
    await testVariant(page, STORY.radioGroup, 2, 'radio-group-segmented');
  });

  test('Invalid', async ({ page }) => {
    await testVariant(page, STORY.radioGroup, 3, 'radio-group-invalid');
  });
});

test.describe('Form / Rating', () => {
  test('Read-only', async ({ page }) => {
    await testVariant(page, STORY.rating, 0, 'rating-read-only');
  });

  test('Input', async ({ page }) => {
    await testVariant(page, STORY.rating, 1, 'rating-input');
  });
});

test.describe('Form / Signature', () => {
  test('Playground', async ({ page }) => {
    await testVariant(page, STORY.signature, 0, 'signature-playground');
  });

  test('Type first', async ({ page }) => {
    await testVariant(page, STORY.signature, 1, 'signature-type-first');
  });

  test('Invalid', async ({ page }) => {
    await testVariant(page, STORY.signature, 2, 'signature-invalid');
  });
});

test.describe('Form / ValidationSummary', () => {
  test('Errors', async ({ page }) => {
    await testVariant(page, STORY.validationSummary, 0, 'validation-summary-errors');
  });

  test('Warnings', async ({ page }) => {
    await testVariant(page, STORY.validationSummary, 1, 'validation-summary-warnings');
  });
});
