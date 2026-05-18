import { App, SuggestModal } from "obsidian";
import type { RefModeItem } from "./ref-mode-items";

/**
 * Keyboard-navigable picker shown whenever the user triggers Ctrl+Alt+I.
 * Lists ref modes and the built-in reading-mode preset.
 */
export class RefModeSuggestModal extends SuggestModal<RefModeItem> {
	private readonly items: RefModeItem[];
	private readonly onChoose: (item: RefModeItem) => void;

	constructor(
		app: App,
		items: RefModeItem[],
		onChoose: (item: RefModeItem) => void,
	) {
		super(app);
		this.items = items;
		this.onChoose = onChoose;
		this.setPlaceholder("Select what to copy…");
	}

	getSuggestions(query: string): RefModeItem[] {
		const lower = query.toLowerCase();
		return this.items.filter((item) =>
			`${item.name} ${item.description}`.toLowerCase().includes(lower),
		);
	}

	renderSuggestion(item: RefModeItem, el: HTMLElement): void {
		el.createEl("div", { text: item.name, cls: "suggestion-title" });
		el.createEl("small", {
			text: item.description,
			cls: "suggestion-note",
		});
	}

	onChooseSuggestion(item: RefModeItem): void {
		this.onChoose(item);
	}
}
