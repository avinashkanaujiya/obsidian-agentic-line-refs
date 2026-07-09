## Context

The plugin currently resolves file paths for citations using `resolveFilename()`, which maps a `TFile` to a display string based on the `pathFormat` setting. When `pathFormat` is `absolute`, it prepends the Obsidian vault's local filesystem base path via `FileSystemAdapter.getBasePath()`.

Users who sync their vault across machines (e.g., via Git) need citations with paths relative to whatever machine they're asking about. There is no mechanism to configure multiple root paths.

The change is scoped to settings persistence and path resolution. No new dependencies, no UI outside the settings tab, no network calls.

## Goals / Non-Goals

**Goals:**
- Let users add, edit, delete, and reorder named vault root paths in settings.
- Let users select which path is "active" via a dropdown.
- When `pathFormat` is `absolute`, use the active vault path instead of `FileSystemAdapter.getBasePath()`.
- Fall back to the adapter's base path when no custom paths are configured (backward compatible).

**Non-Goals:**
- Validating that paths actually exist on disk (user may configure paths for remote machines).
- Auto-detecting or syncing paths across devices.
- Changing the `pathFormat` setting or adding a separate "vault path" format mode.
- Changing how filename-only or vault-relative formats work.

## Decisions

### Data model: array of path objects with an ID

Each vault path is `{ id: string, name: string, path: string }`. An id-based approach (nanoid-style) avoids issues when reordering or renaming. The active path is referenced by `activeVaultPathId: string | null`.

**Alternative considered:** index-based approach (activePathIndex). Rejected because reordering would silently switch the active path.

### Fallback: null activePathId = use adapter base path

When `activeVaultPathId` is `null` (default for existing users), the plugin falls back to `FileSystemAdapter.getBasePath()`. This preserves existing behavior and avoids breaking anyone's workflow.

### Settings UI: custom section with sequential rendering

The paths section follows the same pattern as the existing `Custom ref modes` section: render a list of rows with add/edit/delete/reorder buttons plus a dropdown to select the active path. This keeps the codebase consistent.

### Path resolution: prepend activePath, then `/`, then vault-relative path

The `resolveFilename` method already knows how to join paths. When an active path is set, it replaces `adapter.getBasePath()` in the `absolute` case. The rest of the logic is unchanged.

## Risks / Trade-offs

- Users might configure a path that doesn't exist on the current machine → **mitigation**: add a notice when path is unresolvable (future enhancement; not in this change).
- If a user deletes the active path, the activePathId becomes dangling → **mitigation**: on settings load, validate activePathId against the list; reset to null if missing.
- No validation that paths are valid at entry time → acceptable because these are for remote systems anyway.
