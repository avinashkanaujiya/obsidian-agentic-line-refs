import { test } from "node:test";
import assert from "node:assert/strict";
import { buildRefModeItems } from "../src/ref-mode-items.ts";

const settings = {
	template: "default-template",
	pathFormat: "filename",
	readingModeTemplate: "reading-template",
	customRefModes: [
		{
			id: "custom-1",
			name: "Summarize",
			template: "summarize-template",
		},
	],
};

test("editor picker keeps ref modes first and appends reading mode", () => {
	const items = buildRefModeItems(settings, "editor");

	assert.deepEqual(
		items.map((item) => item.name),
		["Default", "Summarize", "Reading mode"],
	);
});

test("reading picker puts reading mode first", () => {
	const items = buildRefModeItems(settings, "reading");

	assert.deepEqual(
		items.map((item) => item.name),
		["Reading mode", "Default", "Summarize"],
	);
});

test("picker items expose their category and line-number behavior", () => {
	const [readingMode, defaultMode, customMode] = buildRefModeItems(
		settings,
		"reading",
	);

	assert.deepEqual(readingMode, {
		name: "Reading mode",
		template: "reading-template",
		description: "Preset read mode",
		includeLineNumbers: false,
	});

	assert.equal(defaultMode.description, "Built-in ref mode");
	assert.equal(defaultMode.includeLineNumbers, true);
	assert.equal(customMode.description, "Custom ref mode");
	assert.equal(customMode.includeLineNumbers, true);
});
