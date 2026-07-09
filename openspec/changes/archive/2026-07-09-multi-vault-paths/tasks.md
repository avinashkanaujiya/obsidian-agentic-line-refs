## 1. Settings data model

- [x] 1.1 Add `VaultPath` interface (`{ id: string, name: string, path: string }`) and `vaultPaths`, `activeVaultPathId` fields to `AgenticNoteReferencesSettings`
- [x] 1.2 Add sensible defaults for `vaultPaths` (empty array) and `activeVaultPathId` (null) in `DEFAULT_SETTINGS`

## 2. Settings UI

- [x] 2.1 Add "Vault paths" section heading in the settings tab
- [x] 2.2 Add an active path dropdown that lists all configured vault paths plus a "Use local vault path" option; wire storage to `activeVaultPathId`
- [x] 2.3 Render the vault paths list with name field, path field, move-up, move-down, and delete buttons per entry (follow same pattern as custom ref modes)
- [x] 2.4 Add an "Add vault path" button that appends a new entry and refreshes the view

## 3. Path resolution

- [x] 3.1 In `resolveFilename`, when `pathFormat` is `absolute` and `activeVaultPathId` is non-null, look up the active path and use it instead of `FileSystemAdapter.getBasePath()`
- [x] 3.2 Fall back to adapter base path when `activeVaultPathId` is null (current behavior)

## 4. Dangling reference cleanup

- [x] 4.1 In `loadSettings`, after merging defaults, validate that `activeVaultPathId` references an existing entry in `vaultPaths`; reset to null if not found

## 5. Verification

- [ ] 5.1 Manual test: add multiple paths, switch active, copy absolute citations — verify path matches active selection
- [ ] 5.2 Manual test: verify fallback to adapter base path when no active path is set
- [ ] 5.3 Manual test: delete the active path, verify active path resets and citations use fallback
