import { beforeEach, describe, expect, it } from "vitest";
import {
  BUILT_IN_INSTRUMENT_PRESETS,
  BUILDER_INSTRUMENT_TYPES,
  MAX_INSTRUMENT_STRINGS,
  changeInstrumentType,
  generatePresetName,
  getDefaultPresetForType,
  changeStringPitch,
  createInstrumentDraft,
  midiToNoteName,
  noteNameToMidi,
  resizeInstrumentStrings,
  setStringWinding,
  suggestWinding,
  validateInstrumentPreset,
  toFretboardInstrument,
} from "./instrumentBuilder.utils.js";
import {
  INSTRUMENT_BUILDER_STORAGE_KEY,
  loadSavedInstrumentPresets,
  saveInstrumentPresets,
} from "./instrumentBuilder.storage.js";

describe("instrument builder presets", () => {
  it("provides built-in presets for all five instrument types", () => {
    expect(new Set(BUILT_IN_INSTRUMENT_PRESETS.map(({ type }) => type))).toEqual(
      new Set(BUILDER_INSTRUMENT_TYPES.map(({ id }) => id)),
    );
    expect(BUILT_IN_INSTRUMENT_PRESETS.every(({ strings }) => strings.length <= MAX_INSTRUMENT_STRINGS)).toBe(true);
    expect(BUILT_IN_INSTRUMENT_PRESETS.every((preset) => validateInstrumentPreset(preset).length === 0)).toBe(true);
  });


  it("adapts builder string definitions to fretboard pitches and winding", () => {
    const preset = {
      id: "user-test",
      name: "Custom Guitar",
      type: "guitar",
      strings: [
        { id: "high", midi: 64, winding: { mode: "manual", value: true } },
        { id: "low", midi: 40, winding: { mode: "auto", value: false } },
      ],
    };
    expect(toFretboardInstrument(preset)).toMatchObject({
      id: "user-test",
      name: "Custom Guitar",
      type: "guitar",
      strings: [7, 7],
      openStringMidi: [64, 40],
      stringDefinitions: [
        { id: "high", midi: 64, winding: { mode: "manual", value: true } },
        { id: "low", midi: 40, winding: { mode: "auto", value: true } },
      ],
    });
  });

  it("returns the built-in default preset for each instrument icon", () => {
    expect(getDefaultPresetForType("guitar").id).toBe("builtin-guitar-standard");
    expect(getDefaultPresetForType("bass").id).toBe("builtin-bass-standard");
    expect(getDefaultPresetForType("ukulele").id).toBe("builtin-ukulele-standard");
    expect(getDefaultPresetForType("banjo").strings).toHaveLength(5);
    expect(getDefaultPresetForType("mandolin").strings).toHaveLength(4);
    expect(getDefaultPresetForType("unknown")).toBeUndefined();
  });

  it("generates a useful preset name from instrument type, string count, and tuning", () => {
    const guitar = getDefaultPresetForType("guitar");
    expect(generatePresetName(guitar.type, guitar.strings)).toBe("6-String Guitar (E4 B3 G3 D3 A2 E2)");
  });

  it("converts MIDI pitches to readable note names and back", () => {
    expect(midiToNoteName(64)).toBe("E4");
    expect(midiToNoteName(40)).toBe("E2");
    expect(noteNameToMidi("E4")).toBe(64);
    expect(noteNameToMidi("Bb3")).toBe(58);
    expect(noteNameToMidi("invalid")).toBeNull();
    expect(noteNameToMidi("C9")).toBeNull();
  });

  it("suggests winding based on instrument type and pitch", () => {
    expect(suggestWinding("bass", 40)).toBe(true);
    expect(suggestWinding("guitar", 64)).toBe(false);
    expect(suggestWinding("guitar", 40)).toBe(true);
    expect(suggestWinding("ukulele", 40)).toBe(false);
  });

  it("updates automatic winding when pitch or instrument type changes", () => {
    const draft = createInstrumentDraft(BUILT_IN_INSTRUMENT_PRESETS[0]);
    const changedPitch = changeStringPitch(draft, draft.strings[0].id, 40);
    expect(changedPitch.strings[0].winding).toEqual({ mode: "auto", value: true });
    const changedType = changeInstrumentType(draft, "bass");
    expect(changedType.strings[0].winding).toEqual({ mode: "auto", value: false });
  });

  it("preserves manual winding overrides across pitch and type changes", () => {
    const draft = createInstrumentDraft(BUILT_IN_INSTRUMENT_PRESETS[0]);
    const manual = setStringWinding(draft, draft.strings[0].id, "wound");
    const changedPitch = changeStringPitch(manual, manual.strings[0].id, 75);
    const changedType = changeInstrumentType(changedPitch, "ukulele");
    expect(changedType.strings[0].winding).toEqual({ mode: "manual", value: true });
  });

  it("limits string counts and assigns stable string identifiers", () => {
    const draft = createInstrumentDraft(BUILT_IN_INSTRUMENT_PRESETS[0]);
    const eightStrings = resizeInstrumentStrings(draft, 99);
    expect(eightStrings.strings).toHaveLength(MAX_INSTRUMENT_STRINGS);
    expect(new Set(eightStrings.strings.map(({ id }) => id)).size).toBe(MAX_INSTRUMENT_STRINGS);
    expect(resizeInstrumentStrings(draft, 0).strings).toHaveLength(1);
  });

  it("rejects invalid pitch ranges, types, and empty names", () => {
    const draft = createInstrumentDraft(BUILT_IN_INSTRUMENT_PRESETS[0]);
    expect(validateInstrumentPreset({ ...draft, name: " ", type: "other" })).toContain("Enter a preset name.");
    expect(validateInstrumentPreset({ ...draft, strings: [{ ...draft.strings[0], midi: 120 }] })[0]).toContain("MIDI pitch");
  });
});

describe("instrument builder browser storage", () => {
  let values;

  beforeEach(() => {
    values = new Map();
  });

  const storage = {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value),
  };

  it("round-trips valid custom presets under a dedicated key", () => {
    const preset = { ...createInstrumentDraft(BUILT_IN_INSTRUMENT_PRESETS[0]), id: "user-test", isBuiltIn: false };
    expect(saveInstrumentPresets([preset], storage)).toBe(true);
    expect(values.has(INSTRUMENT_BUILDER_STORAGE_KEY)).toBe(true);
    expect(loadSavedInstrumentPresets(storage)).toEqual([preset]);
  });

  it("ignores malformed browser storage without throwing", () => {
    values.set(INSTRUMENT_BUILDER_STORAGE_KEY, "{bad json");
    expect(loadSavedInstrumentPresets(storage)).toEqual([]);
  });

  it("does not persist built-in presets as user presets", () => {
    expect(saveInstrumentPresets(BUILT_IN_INSTRUMENT_PRESETS, storage)).toBe(true);
    expect(loadSavedInstrumentPresets(storage)).toEqual([]);
  });
});
