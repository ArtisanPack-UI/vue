# @artisanpack-ui/vue

## 1.0.1

### Minor Changes

- [#33](https://github.com/ArtisanPack-UI/vue/pull/33) Add a new `ai/` subpath ([ArtisanPack-UI/ai#18](https://github.com/ArtisanPack-UI/ai/issues/18)) — drop-in Vue 3 components + composables that consume the `artisanpack-ui/ai` JSON API. Ships `SettingsPage` (GET/PUT `/settings` + `test-connection` probe, provider-switch clears the typed key), `UsageDashboard` (GET `/usage` with sequence-guarded polling via `refreshInterval`, watches `from`/`to` prop changes), `FeatureToggles` (optimistic POST `/features/{key}/toggle` with rollback on failure), `createAiApiClient` (small fetch wrapper with `AiApiError` for 422 handling; skips `Content-Type` on GET), and `useStreamingText` (composable that reads a `fetch` response body as a UTF-8 text stream via the Streams API + `AbortController`). Full Vitest coverage (20 new tests).

## 1.0.0

### Major Changes

- [#30](https://github.com/ArtisanPack-UI/vue/pull/30) [`1fe6722`](https://github.com/ArtisanPack-UI/vue/commit/1fe67223ba9820c8b6c54d0f3bab18ce0abd5b1c) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Initial v1.0.0 release — 56+ Vue 3 UI components with DaisyUI/Tailwind CSS styling, tree-shakeable category exports, composables, and Inertia.js Laravel adapter
