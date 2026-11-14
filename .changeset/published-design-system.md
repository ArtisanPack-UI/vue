---
'@artisanpack-ui/vue': patch
'@artisanpack-ui/vue-laravel': patch
---

Depend on the published design-system packages: `@artisanpack-ui/behavior` `^1.0.0` instead of a local path. The unused `@artisanpack-ui/tokens` 1.x dependency is gone from both packages, since the design tokens now ship with `@artisanpack-ui/css`.
