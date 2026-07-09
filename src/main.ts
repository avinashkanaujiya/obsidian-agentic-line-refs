import {
	FileSystemAdapter,
	MarkdownView,
	Notice,
	Plugin,
	TFile,
} from "obsidian";
import {
	AgenticNoteReferencesSettingTab,
	DEFAULT_SETTINGS,
	type AgenticNoteReferencesSettings,
} from "./settings";
import { buildCitation } from "./citation";
import { RefModeSuggestModal } from "./ref-mode-modal";
import { buildRefModeItems } from "./ref-mode-items";

export default class AgenticNoteReferencesPlugin extends Plugin {
	// Assigned in onload() via loadSettings(); definitely present before any
	// command or setting handler can run.
	settings!: AgenticNoteReferencesSettings;

	async onload() {
		await this.loadSettings();
		console.log("Agentic Note References: loaded");

		this.addCommand({
			id: "copy-agentic-citation",
			name: "Copy agentic citation",
			// Available whenever a Markdown view is open (editor or reading).
			checkCallback: (checking: boolean) => {
				const view =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!view) return false;

				if (!checking) {
					this.showCopyModeModal(view);
				}
				return true;
			},
			hotkeys: [
				{
					modifiers: ["Ctrl", "Alt"],
					key: "i",
				},
			],
		});

		this.addSettingTab(new AgenticNoteReferencesSettingTab(this.app, this));
	}

	onUnload() {
		console.log("Agentic Note References: unloaded");
	}

	/** Resolves the file display string according to the current pathFormat. */
	private resolveFilename(file: TFile): string {
		switch (this.settings.pathFormat) {
			case "vaultRelative":
				return file.path;
			case "absolute": {
				const basePath = this.getActiveVaultBasePath();
				if (!basePath) {
					new Notice(
						"Absolute path is unavailable on this platform — using vault-relative path.",
					);
				}
				return basePath ? `${basePath}/${file.path}` : file.path;
			}
			case "filename":
			default:
				return file.basename;
		}
	}

	/**
	 * Returns the base path for absolute citations: the active vault path
	 * if configured, otherwise the local vault's filesystem base path.
	 */
	private getActiveVaultBasePath(): string {
		const { activeVaultPathId, vaultPaths } = this.settings;
		if (activeVaultPathId) {
			const active = vaultPaths.find((p) => p.id === activeVaultPathId);
			if (active) return active.path;
		}
		const adapter = this.app.vault.adapter;
		if (adapter instanceof FileSystemAdapter) {
			return adapter.getBasePath();
		}
		return "";
	}

	/**
	 * Opens the picker in both editor and reading mode, then copies the
	 * citation built from the chosen mode's template.
	 */
	private showCopyModeModal(view: MarkdownView): void {
		const file = view.file;
		if (!file) {
			new Notice("No active file.");
			return;
		}

		const filename = this.resolveFilename(file);
		const fromLine = view.editor.getCursor("from").line + 1;
		const toLine = view.editor.getCursor("to").line + 1;
		const pickerMode = view.getMode() === "preview" ? "reading" : "editor";
		const allModes = buildRefModeItems(this.settings, pickerMode);

		new RefModeSuggestModal(this.app, allModes, async (item) => {
			const output = buildCitation(
				item.template,
				item.includeLineNumbers
					? {
							filename,
							fromLine,
							toLine,
						}
					: { filename },
			);
			await this.writeToClipboard(output);
		}).open();
	}

	private async writeToClipboard(text: string): Promise<void> {
		try {
			await navigator.clipboard.writeText(text);
			new Notice("Agentic citation copied to clipboard.");
		} catch (err) {
			new Notice("Failed to copy citation to clipboard.");
			console.error("Agentic Note References: clipboard write failed", err);
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
		// Clean up dangling activePathId if the referenced path was deleted.
		if (
			this.settings.activeVaultPathId &&
			!this.settings.vaultPaths.some(
				(p) => p.id === this.settings.activeVaultPathId,
			)
		) {
			this.settings.activeVaultPathId = null;
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
