import type { AgenticNoteReferencesSettings } from "./settings";

export type PickerContextMode = "editor" | "reading";

export interface RefModeItem {
	name: string;
	template: string;
	description: string;
	includeLineNumbers: boolean;
}

export function buildRefModeItems(
	settings: AgenticNoteReferencesSettings,
	mode: PickerContextMode,
): RefModeItem[] {
	const readingModeItem: RefModeItem = {
		name: "Reading mode",
		template: settings.readingModeTemplate,
		description: "Preset read mode",
		includeLineNumbers: false,
	};

	const refModeItems: RefModeItem[] = [
		{
			name: "Default",
			template: settings.template,
			description: "Built-in ref mode",
			includeLineNumbers: true,
		},
		...settings.customRefModes.map((modeItem) => ({
			name: modeItem.name,
			template: modeItem.template,
			description: "Custom ref mode",
			includeLineNumbers: true,
		})),
	];

	return mode === "reading"
		? [readingModeItem, ...refModeItems]
		: [...refModeItems, readingModeItem];
}
