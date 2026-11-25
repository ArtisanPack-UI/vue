---
title: Inertia Components
menu_order: 90
meta_description: The Inertia.js wrappers in @artisanpack-ui/vue-laravel. Form fields with Laravel errors, Inertia navigation, layouts and flash messages.
---

# Inertia Components

`@artisanpack-ui/vue-laravel` wraps the components for a Laravel app running Inertia.js. The form wrappers show Laravel's validation errors, the navigation wrappers visit pages with Inertia, the layouts set the page title with Inertia's `<Head>`, and the flash components show the session's flash messages. Every export comes from the package root; there are no subpaths.

```ts
import { InertiaForm, InertiaInput, InertiaPagination } from '@artisanpack-ui/vue-laravel';
```

Install and set up the package, share the props it reads, and use its composables as described in [Laravel and Inertia](../laravel-inertia.md).

## Forms

- [InertiaForm](inertia/inertia-form.md): a `<form>` that owns an Inertia form, submits it and hands its errors to the field wrappers inside it.
- [InertiaInput](inertia/inertia-input.md): [Input](form/input.md) with the field's Laravel error.
- [InertiaPassword](inertia/inertia-password.md): [Password](form/password.md) with the field's Laravel error.
- [InertiaTextarea](inertia/inertia-textarea.md): [Textarea](form/textarea.md) with the field's Laravel error.
- [InertiaSelect](inertia/inertia-select.md): [Select](form/select.md) with the field's Laravel error.
- [InertiaCheckbox](inertia/inertia-checkbox.md): [Checkbox](form/checkbox.md) with the field's Laravel error.
- [InertiaToggle](inertia/inertia-toggle.md): [Toggle](form/toggle.md) with the field's Laravel error.
- [InertiaRadioGroup](inertia/inertia-radio-group.md): [RadioGroup](form/radio-group.md) with the field's Laravel error.
- [InertiaRadio](inertia/inertia-radio.md): deprecated. Use InertiaRadioGroup.

## Navigation

- [InertiaMenu](inertia/inertia-menu.md): [Menu](navigation/menu.md) whose links are Inertia `<Link>`s.
- [InertiaBreadcrumbs](inertia/inertia-breadcrumbs.md): [Breadcrumbs](navigation/breadcrumbs.md) whose links are Inertia `<Link>`s.
- [InertiaPagination](inertia/inertia-pagination.md): [Pagination](navigation/pagination.md) driven by a Laravel paginator, visiting pages with Inertia.

## Layouts

- [AppLayout](inertia/app-layout.md): a header, main and footer shell that fills the viewport.
- [AuthLayout](inertia/auth-layout.md): a shell with a sidebar beside the main content, for signed-in pages.
- [GuestLayout](inertia/guest-layout.md): a centered column for sign-in and registration pages.

## Flash messages

- [FlashAlerts](inertia/flash-alerts.md): shows flash messages as inline [Alerts](feedback/alert.md).
- [FlashToasts](inertia/flash-toasts.md): shows flash messages as [toasts](feedback/toast.md) and renders the Toaster.

## How the field wrappers work

Every field wrapper takes a required `name` and an optional `error`, binds its value with `v-model`, and passes every other prop, attribute and listener to the component it wraps. The wrappers don't bind the value to the form for you: bind `v-model` to the form field yourself, such as `v-model="form.email"`.

The error shown is the first of:

1. The `error` prop, when you pass one. An empty string hides the error.
2. Inside an [InertiaForm](inertia/inertia-form.md), the form's error for `name`. The page's `errors` prop isn't read in this case.
3. Outside an InertiaForm, `errors[name]` from the Inertia page props, which Inertia shares after a failed visit.

So the wrappers work inside an `InertiaForm`, with [`useInertiaForm`](../laravel-inertia.md#useinertiaform), or with a form you submit yourself.

## Global registration

`app.use(createArtisanPackUILaravel())` registers every component in this category globally with a prefix, `Ap` by default (`<ApInertiaInput>`, `<ApFlashToasts>`). See [Laravel and Inertia](../laravel-inertia.md#set-up-inertia).
