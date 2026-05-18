# Agentic Note References

An Obsidian plugin that copies a formatted note reference to the clipboard — ready to paste into any AI agent chat.

## How it works

### Editor mode (Live Preview / Source)

1. Place your cursor on a line, or select a range of lines.
2. Press **Ctrl+Alt+I** (or run *Copy agentic citation* from the command palette).
3. A picker appears — type to filter, arrow keys or mouse to choose:

   - **Default** — built-in ref mode; uses the Default citation template from Settings
   - *Custom modes* — ref modes you define in Settings, in the order you set
   - **Reading mode** — built-in preset read mode; uses the Reading mode template

4. The formatted citation is copied to the clipboard.

### Reading mode

Press **Ctrl+Alt+I** while in Reading mode and the same picker appears.

- **Reading mode** is listed first and uses the Reading mode template.
- **Ref modes** remain available too; when selected, they use the note's current editor cursor/selection for line numbers.

---

## Settings

Go to **Settings → Agentic Note References**.

### Path format

Controls how `{{filename}}` resolves in every template:

| Option | Example |
|--------|---------|
| File name only *(default)* | `My Note` |
| Relative to vault root | `folder/My Note.md` |
| Absolute filesystem path | `/home/user/vault/folder/My Note.md` |

### Editor mode — Default citation template

The template used by the built-in **Default** ref mode in the picker.

Default value:
```
[[{{filename}}]] — Lines {{from}}–{{to}}

Here is the referenced section:
```

### Reading mode template

The template used by the built-in **Reading mode** option in the picker.

Default value: `[[{{filename}}]]`

### Custom ref modes

Click **Add ref mode** to create a new mode. Each mode has:

- **Name** — shown in the picker list
- **Template** — the text that gets copied

Use the **↑ / ↓** buttons to reorder modes. Their order in Settings is the order they appear among the ref modes in the picker.

### Template placeholders

| Placeholder | Expands to | Available in |
|-------------|------------|--------------|
| `{{filename}}` | File reference per path format | All modes |
| `{{from}}` | Starting line number (1-indexed) | Ref modes only |
| `{{to}}` | Ending line number (1-indexed) | Ref modes only |
| `{{lines}}` | `Line 5` or `Lines 3–7` | Ref modes only |

In the Reading mode template, `{{from}}`, `{{to}}`, and `{{lines}}` are not available — use only `{{filename}}`.

Use `\n` for explicit newlines in any template.

---

## Installation

```bash
git clone <repo> ~/.obsidian/plugins/agentic-note-references
cd ~/.obsidian/plugins/agentic-note-references
npm install && npm run build
```

Enable **Agentic Note References** in **Settings → Community Plugins**.

## Development

Build and sync to your vault in one step:

```bash
./sync.sh
```

Options:

```
-n, --no-build      Skip npm build (copy existing main.js)
-v, --vault <path>  Target vault root  (default: ~/obsidian/notes)
-s, --src   <path>  Plugin source dir  (default: ~/github/obsidian-agentic-note-references)
```

After syncing, reload the plugin in Obsidian: **Settings → Community Plugins → toggle off/on**.
