import { App, PluginSettingTab, Setting } from "obsidian";
import type AgenticNoteReferencesPlugin from "./main";

export type PathFormat = "filename" | "vaultRelative" | "absolute";

export interface RefMode {
	/** Stable unique ID used to identify modes across edits. */
	id: string;
	/** Display name shown in the picker modal. */
	name: string;
	/** Template string. Supports {{filename}}, {{from}}, {{to}}, {{lines}}. */
	template: string;
}

export interface AgenticNoteReferencesSettings {
	/** Template for the built-in "Default" ref mode shown in the picker. */
	template: string;
	pathFormat: PathFormat;
	/** Template for the built-in "Reading mode" option shown in the picker. */
	readingModeTemplate: string;
	/** User-defined ref modes that appear in the shared picker. */
	customRefModes: RefMode[];
}

export const DEFAULT_SETTINGS: AgenticNoteReferencesSettings = {
	template:
		"[[{{filename}}]] — Lines {{from}}–{{to}}\n\nHere is the referenced section:",
	pathFormat: "filename",
	readingModeTemplate: "[[{{filename}}]]",
	customRefModes: [],
};

export class AgenticNoteReferencesSettingTab extends PluginSettingTab {
	plugin: AgenticNoteReferencesPlugin;

	constructor(app: App, plugin: AgenticNoteReferencesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// ── Global ────────────────────────────────────────────────────────────
		new Setting(containerEl)
			.setName("Path format")
			.setDesc("Choose how the file path is inserted into citations.")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("filename", "File name only")
					.addOption("vaultRelative", "Relative to vault root")
					.addOption("absolute", "Absolute filesystem path")
					.setValue(this.plugin.settings.pathFormat)
					.onChange(async (value) => {
						this.plugin.settings.pathFormat = value as PathFormat;
						await this.plugin.saveSettings();
					}),
			);

		// ── Editor mode ───────────────────────────────────────────────────────
		new Setting(containerEl).setName("Editor mode").setHeading();

		new Setting(containerEl)
			.setName("Default citation template")
			.setDesc(
				"The built-in 'Default' ref mode shown in the picker. " +
					"Placeholders: {{filename}}, {{from}}, {{to}}, {{lines}}. " +
					"Use \\n for new lines.",
			)
			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.template)
					.onChange(async (value) => {
						this.plugin.settings.template = value;
						await this.plugin.saveSettings();
					}),
			);

		// ── Reading mode ──────────────────────────────────────────────────────
		new Setting(containerEl).setName("Reading mode").setHeading();

		new Setting(containerEl)
			.setName("Reading mode template")
			.setDesc(
				"The built-in 'Reading mode' option shown in the picker. " +
					"Only {{filename}} is available here — no line numbers. " +
					"Use \\n for new lines.",
			)
			.addTextArea((text) =>
				text
					.setValue(this.plugin.settings.readingModeTemplate)
					.onChange(async (value) => {
						this.plugin.settings.readingModeTemplate = value;
						await this.plugin.saveSettings();
					}),
			);

		// ── Custom ref modes ──────────────────────────────────────────────────
		new Setting(containerEl).setName("Custom ref modes").setHeading();

		new Setting(containerEl)
			.setName("")
			.setDesc(
				"Custom modes appear in the picker whenever Ctrl+Alt+I is pressed. " +
					"Placeholders: {{filename}}, {{from}}, {{to}}, {{lines}}.",
			);

		this.renderRefModes(containerEl);

		new Setting(containerEl).addButton((btn) =>
			btn
				.setButtonText("Add ref mode")
				.setCta()
				.onClick(async () => {
					this.plugin.settings.customRefModes.push({
						id: Date.now().toString(36),
						name: "New mode",
						template: "[[{{filename}}]] — {{lines}}",
					});
					await this.plugin.saveSettings();
					this.display();
				}),
		);
	}

	private renderRefModes(containerEl: HTMLElement): void {
		const modes = this.plugin.settings.customRefModes;

		for (let i = 0; i < modes.length; i++) {
			const mode = modes[i];

			// Name row — reorder + delete buttons on the right
			new Setting(containerEl)
				.setName("Name")
				.addText((text) =>
					text
						.setPlaceholder("Mode name")
						.setValue(mode.name)
						.onChange(async (value) => {
							mode.name = value;
							await this.plugin.saveSettings();
						}),
				)
				.addExtraButton((btn) =>
					btn
						.setIcon("arrow-up")
						.setTooltip("Move up")
						.setDisabled(i === 0)
						.onClick(async () => {
							[modes[i - 1], modes[i]] = [modes[i], modes[i - 1]];
							await this.plugin.saveSettings();
							this.display();
						}),
				)
				.addExtraButton((btn) =>
					btn
						.setIcon("arrow-down")
						.setTooltip("Move down")
						.setDisabled(i === modes.length - 1)
						.onClick(async () => {
							[modes[i], modes[i + 1]] = [modes[i + 1], modes[i]];
							await this.plugin.saveSettings();
							this.display();
						}),
				)
				.addExtraButton((btn) =>
					btn
						.setIcon("trash")
						.setTooltip("Delete this ref mode")
						.onClick(async () => {
							this.plugin.settings.customRefModes =
								modes.filter((m) => m.id !== mode.id);
							await this.plugin.saveSettings();
							this.display();
						}),
				);

			// Template row
			new Setting(containerEl)
				.setName("Template")
				.addTextArea((text) =>
					text
						.setPlaceholder("{{filename}} — {{lines}}")
						.setValue(mode.template)
						.onChange(async (value) => {
							mode.template = value;
							await this.plugin.saveSettings();
						}),
				);
		}
	}
}
