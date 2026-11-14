---
'@artisanpack-ui/vue': minor
---

Add Dialog, DropdownMenu and Toast on the design system (ArtisanPack-UI/design-system#49 to #51), built on the shared Zag behavior engine through `@artisanpack-ui/behavior/vue`.

- `Dialog`: `v-model:open`, focus trap, Escape and backdrop dismissal, scroll lock, focus return, `role="alertdialog"` for confirmations, and a `trigger` prop or slot.
- `DropdownMenu` with `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator`, or the same children from `items`: arrow keys, typeahead, `select` and `checked-change`.
- `Toast` (static), `Toaster` (the region) and the `toast` toaster: `toast.create({ title, description, color, action })`. `createToaster()` makes a separate stack.
- Overlays take `portal` (default true) and teleport to the body. Dialog, Toast and Toaster take `closeLabel` to name (and translate) the close button.
- `@zag-js/vue` is now a dependency.

Modal, Dropdown/DropdownItem and ToastProvider/ToastMessage/useToast are deprecated in favor of these and stay exported for now.
