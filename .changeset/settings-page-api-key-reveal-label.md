---
'@artisanpack-ui/vue': patch
---

`SettingsPage`'s `labels` prop takes a new `apiKeyReveal` key that names the API key field's reveal button (default `Show password`). Before, the button always kept `Password`'s default name, so an app translating through `labels` alone couldn't change it.

The `labels` prop stays partial, so apps that pass it need no change. Code that declares a complete `SettingsPageLabels` object must add `apiKeyReveal` to type-check.
