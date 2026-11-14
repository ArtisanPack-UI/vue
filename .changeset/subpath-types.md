---
'@artisanpack-ui/vue': patch
---

Ship a declaration file for every subpath export (`/form`, `/layout`, `/navigation`, `/display`, `/data`, `/feedback`, `/utility`, `/composables`, `/ai`). They were declared in `package.json` but never written, so subpath imports resolved untyped (TS7016).
