## Context

The ESLint plugin `@obsidianmd/eslint-plugin` flags several issues in the codebase:

1. **`obsidianmd/no-unsupported-api`** — `ExtraButtonComponent.setDisabled()` requires Obsidian ≥ 1.2.3, but `minAppVersion` is `0.15.0`.
2. **Default hotkey** — `Ctrl+Alt+I` is hardcoded in `addCommand()`, which may conflict with user or built-in bindings.
3. **Promise in void context** — `async` callback passed where `(item: RefModeItem) => void` is expected.
4. **Unsafe `any` assignment** — `catch (err)` passes implicitly-`any` `err` to `console.error`, and `loadData()` returns `Promise<unknown>` assigned into a typed object.

## Goals / Non-Goals

**Goals:**
- Resolve all lint errors/warnings so the plugin passes community review.
- Bump `minAppVersion` to the minimum version that covers all APIs used.

**Non-Goals:**
- No behavior changes to citation building, settings, or modal UX.
- No refactoring beyond what the lint fixes require.

## Decisions

### 1. Bump `minAppVersion` to `1.2.3`

The highest API version used is `ExtraButtonComponent.setDisabled` (`@since 1.2.3`). Alternatives:
- **Remove `setDisabled` calls** — degrades UX (users can reorder/delete the active item). Rejected.
- **Guard with version checks** — adds complexity for a narrow version gap. The Obsidian ecosystem moves fast; 1.2.3 was released in 2023. Rejected.

### 2. Remove default hotkey

Obsidian's own [developer guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines) recommend against default hotkeys. Users bind commands through Settings → Hotkeys. No alternative considered — this is a compliance requirement.

### 3. Wrap async callback with `void` operator

`RefModeSuggestModal` expects `(item: RefModeItem) => void`. The caller passes `async (item) => {...}` which returns `Promise<void>`. Fix: wrap in `void` to explicitly discard the promise:

```ts
new RefModeSuggestModal(this.app, allModes, (item) => {
  void (async () => { ... })();
}).open();
```

Alternative: change `onChoose` type to accept `Promise<void>`. Rejected — increases the API surface of the modal class for a single caller.

### 4. Type `catch` error as `unknown` and cast `loadData` result

- `catch (err)` → `catch (err: unknown)`. Pass to `console.error` as-is (it accepts `unknown`).
- `await this.loadData()` → cast to `Partial<AgenticNoteReferencesSettings>` before `Object.assign`. This is safe because `loadData()` returns the stored settings object (or `null`/`undefined`).

## Risks / Trade-offs

- **Dropped Obsidian versions**: Users on Obsidian 0.15.0–1.2.2 can no longer install updates. Mitigation: these versions are 3+ years old; Obsidian auto-updates aggressively.
- **Removed hotkey**: Existing users who relied on `Ctrl+Alt+I` will need to re-bind it once. Mitigation: Obsidian shows a notice when a command loses its hotkey after plugin update.
