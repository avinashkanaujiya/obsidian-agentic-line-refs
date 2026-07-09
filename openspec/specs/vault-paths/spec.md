### Requirement: Vault path list management

The system SHALL allow users to maintain a list of named vault root paths in the plugin settings. Each path entry consists of a unique id, a human-readable name, and a filesystem path.

#### Scenario: Add a new vault path

- **WHEN** the user clicks "Add vault path" in the Vault paths settings section
- **THEN** a new entry is appended with a default name "New path" and an empty path string, and settings are persisted.

#### Scenario: Edit a vault path name

- **WHEN** the user changes the name text field of a vault path entry
- **THEN** the entry's name is updated and settings are persisted.

#### Scenario: Edit a vault path value

- **WHEN** the user changes the path text field of a vault path entry
- **THEN** the entry's path is updated and settings are persisted.

#### Scenario: Delete a vault path

- **WHEN** the user clicks the delete button on a vault path entry
- **THEN** the entry is removed from the list and settings are persisted. If the deleted entry was the active path, the active path selection resets to none (adapter fallback).

#### Scenario: Reorder vault paths

- **WHEN** the user clicks the move-up or move-down button on a vault path entry
- **THEN** the entry swaps positions with the adjacent entry and settings are persisted.

### Requirement: Active vault path selection

The system SHALL allow the user to select one vault path as active via a dropdown in the Vault paths settings section. The active path is used for absolute-path citations.

#### Scenario: Select an active vault path

- **WHEN** the user selects a vault path from the active path dropdown
- **THEN** the selected path's id is stored as `activeVaultPathId` and settings are persisted.

#### Scenario: Active path dropdown reflects current selection

- **WHEN** the settings tab is opened
- **THEN** the active path dropdown shows the currently selected vault path, or a placeholder option "Use local vault path" when none is selected.

#### Scenario: Deselect active path

- **WHEN** the user selects "Use local vault path" (the none option) from the active path dropdown
- **THEN** `activeVaultPathId` is set to null and settings are persisted.

### Requirement: Absolute path resolution uses active vault path

The system SHALL use the active vault path (when set) when building absolute-path citations, in place of the local Obsidian vault base path.

#### Scenario: Citation with active vault path set

- **WHEN** `pathFormat` is `absolute`, an active vault path is configured (`activeVaultPathId` is non-null and references an existing entry), and the user copies a citation
- **THEN** the citation file path is built as `<active-vault-path>/<vault-relative-path>`.

#### Scenario: Citation with no active vault path (fallback)

- **WHEN** `pathFormat` is `absolute` and no active vault path is configured (`activeVaultPathId` is null)
- **THEN** the citation file path is built using the local vault's `FileSystemAdapter.getBasePath()` as before.

#### Scenario: Citation with non-absolute path format

- **WHEN** `pathFormat` is `filename` or `vaultRelative`
- **THEN** the vault paths configuration has no effect on citation output.

### Requirement: Dangling active path is cleaned up on load

The system SHALL validate the `activeVaultPathId` against the configured vault paths list when settings are loaded, and reset it to null if it references a deleted entry.

#### Scenario: Active path references a deleted entry

- **WHEN** settings are loaded and `activeVaultPathId` does not match any existing vault path entry
- **THEN** `activeVaultPathId` is reset to null before any command or setting handler executes.
