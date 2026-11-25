---
'@artisanpack-ui/vue': minor
---

`SettingsPage`'s `labels` prop takes a new optional `apiKeyReveal` key that names the API key field's reveal button (default `Show password`). Before, the button always kept `Password`'s default name, so an app translating through `labels` alone couldn't change it. The key is optional on `SettingsPageLabels`, so complete label objects written for 2.0 still type-check.
