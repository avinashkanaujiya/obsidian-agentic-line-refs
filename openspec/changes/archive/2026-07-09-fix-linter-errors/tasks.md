## 1. Manifest version bump

- [x] 1.1 Update `minAppVersion` in `manifest.json` from `0.15.0` to `1.2.3`

## 2. Remove default hotkey

- [x] 2.1 Remove the `hotkeys` array from `addCommand` in `src/main.ts` (lines 40–45)

## 3. Fix Promise in void context

- [x] 3.1 Change the `async (item) => {}` callback in `showCopyModeModal` to a sync wrapper that uses `void` to discard the promise: `(item) => { void (async () => { ... })(); }`

## 4. Fix unsafe type assignments

- [x] 4.1 Add explicit `unknown` type annotation to `catch (err: unknown)` in `writeToClipboard`
- [x] 4.2 Cast `await this.loadData()` result in `loadSettings` to `Partial<AgenticNoteReferencesSettings>` before `Object.assign`

## 5. Verification

- [x] 5.1 Run TypeScript compiler (`npx tsc -noEmit -skipLibCheck`) and confirm zero errors
- [x] 5.2 Run `npm run build` and confirm clean build
