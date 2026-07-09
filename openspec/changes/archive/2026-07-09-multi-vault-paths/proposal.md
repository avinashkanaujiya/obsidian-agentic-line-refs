## Why

Users who sync their Obsidian vault across multiple machines or self-hosted servers (e.g., via Git) have no way to produce citations with the correct absolute file paths for a given system. Today there is only one "absolute" path — the local vault root. Adding support for multiple named vault-root paths lets users configure one path per system and select which one is active.

## What Changes

- Add a new settings section for "Vault root paths" where users can add, name, edit, delete, and reorder multiple filesystem root paths.
- Add a dropdown in settings to select the **active** vault root path (the one used for absolute-path citations and for the `absolute` path-format mode).
- The active path replaces the implicit `FileSystemAdapter.getBasePath()` for absolute citations — users can point it at a remote clone, a sync folder, or any other filesystem location they own.
- The existing `pathFormat` setting is unchanged; when `pathFormat` is `absolute`, citations use whichever vault path is selected as active.
- If no custom paths are configured, the plugin falls back to `FileSystemAdapter.getBasePath()` (current behavior — **no breaking change**).

## Capabilities

### New Capabilities

- `vault-paths`: Manage a list of named vault root paths, select an active path, and use it when building absolute-path citations.

### Modified Capabilities

<!-- No existing specs to modify. -->

## Impact

- **Settings** (`settings.ts`): New `VaultPath[]` array and `activeVaultPathId` on the settings interface, plus UI in the settings tab.
- **Main plugin** (`main.ts`): `resolveFilename` updated to check active vault path before falling back to adapter base path.
- **Persistence**: New settings keys stored alongside existing ones — fully backward compatible (`loadData` / `saveData`).
