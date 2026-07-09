## Why

The plugin has accumulated lint errors and warnings that block community plugin review and degrade code quality. Fixing them now ensures the next release passes Obsidian's automated review checks without blocking issues.

## What Changes

- Bump `minAppVersion` from `0.15.0` to `1.2.3` to match the actual Obsidian APIs used (`ExtraButtonComponent.setDisabled` requires 1.2.3).
- Remove the default hotkey (`Ctrl+Alt+I`) from the command registration — users bind hotkeys through Obsidian's native hotkey settings instead.
- Fix the `Promise`-returning callback passed to `RefModeSuggestModal` where a `void` return is expected.
- Fix the unsafe `any`-typed `err` in `catch` blocks per `@typescript-eslint/no-unsafe-assignment`.

## Capabilities

### New Capabilities

None. This change is purely a maintenance fix — no new user-facing capabilities.

### Modified Capabilities

None. No existing spec requirements change. The API version bump and type fixes are implementation details that don't alter behavior.

## Impact

- `manifest.json` — `minAppVersion` field
- `src/main.ts` — command registration (remove hotkey), `showCopyModeModal` callback, `writeToClipboard` error handling, `loadSettings` type safety
- `src/settings.ts` — no changes needed (the `addExtraButton` calls are fine; only the manifest version needs bumping)
