export const MAX_INSTRUMENT_STRINGS = 8;
export const MIN_INSTRUMENT_STRINGS = 1;

export const BUILDER_INSTRUMENT_TYPES = [
  { id: "guitar", label: "Guitar", image: "guitar" },
  { id: "bass", label: "Bass", image: "bass" },
  { id: "mandolin", label: "Mandolin", image: "mandolin" },
  { id: "ukulele", label: "Ukulele", image: "ukulele" },
  { id: "banjo", label: "Banjo", image: "banjo" },
];

const makeStrings = (pitches, type) => pitches.map((midi, index) => ({
  id: `string-${index + 1}`,
  midi,
  winding: { mode: "auto", value: suggestWinding(type, midi) },
}));

export function suggestWinding(type, midi) {
  if (!Number.isInteger(midi)) return false;
  switch (type) {
    case "bass":
      return midi <= 40;
    case "guitar":
      return midi <= 50;
    case "mandolin":
      return midi <= 55;
    case "banjo":
      return midi <= 50;
    case "ukulele":
    default:
      return false;
  }
}

export const BUILT_IN_INSTRUMENT_PRESETS = [
  { id: "builtin-guitar-standard", name: "6 String Guitar Standard", type: "guitar", isBuiltIn: true, strings: makeStrings([64, 59, 55, 50, 45, 40], "guitar") },
  { id: "builtin-guitar-eb", name: "6 String Guitar Eb", type: "guitar", isBuiltIn: true, strings: makeStrings([63, 58, 54, 49, 44, 39], "guitar") },
  { id: "builtin-guitar-open-d", name: "6 String Guitar Open D", type: "guitar", isBuiltIn: true, strings: makeStrings([62, 57, 54, 50, 45, 38], "guitar") },
  { id: "builtin-bass-standard", name: "4 String Bass Standard", type: "bass", isBuiltIn: true, strings: makeStrings([43, 38, 33, 28], "bass") },
  { id: "builtin-bass-eb", name: "4 String Bass Eb", type: "bass", isBuiltIn: true, strings: makeStrings([42, 37, 32, 27], "bass") },
  { id: "builtin-ukulele-standard", name: "4 String Ukulele Standard", type: "ukulele", isBuiltIn: true, strings: makeStrings([67, 60, 64, 69], "ukulele") },
  { id: "builtin-banjo-standard", name: "5 String Banjo Standard", type: "banjo", isBuiltIn: true, strings: makeStrings([67, 50, 55, 59, 62], "banjo") },
  { id: "builtin-mandolin-standard", name: "4 String Mandolin Standard", type: "mandolin", isBuiltIn: true, strings: makeStrings([55, 62, 69, 76], "mandolin") },
];

export const DEFAULT_BUILDER_PRESET_ID = "builtin-guitar-standard";

export function getDefaultPresetForType(type) {
  return BUILT_IN_INSTRUMENT_PRESETS.find((preset) => preset.type === type);
}

export function generatePresetName(type, strings) {
  const instrument = BUILDER_INSTRUMENT_TYPES.find(({ id }) => id === type)?.label || "Instrument";
  const tuning = strings.map(({ midi }) => midiToNoteName(midi)).join(" ");
  return `${strings.length}-String ${instrument} (${tuning})`;
}
export const MIN_MIDI_PITCH = 24;
export const MAX_MIDI_PITCH = 96;

const MIDI_NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function midiToNoteName(midi) {
  if (!Number.isInteger(midi)) return "";
  return `${MIDI_NOTE_NAMES[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
}

export function noteNameToMidi(value) {
  const match = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(String(value).trim());
  if (!match) return null;
  const semitones = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let pitchClass = semitones[match[1].toUpperCase()];
  if (match[2] === "#") pitchClass += 1;
  if (match[2] === "b") pitchClass -= 1;
  const midi = (Number(match[3]) + 1) * 12 + pitchClass;
  return Number.isInteger(midi) && midi >= MIN_MIDI_PITCH && midi <= MAX_MIDI_PITCH ? midi : null;
}

export function createInstrumentDraft(preset) {
  return {
    id: preset.id,
    name: preset.name,
    type: preset.type,
    isBuiltIn: Boolean(preset.isBuiltIn),
    strings: preset.strings.map((string, index) => ({
      id: string.id || `string-${index + 1}`,
      midi: string.midi,
      winding: {
        mode: string.winding?.mode === "manual" ? "manual" : "auto",
        value: string.winding?.mode === "manual"
          ? Boolean(string.winding.value)
          : suggestWinding(preset.type, string.midi),
      },
    })),
  };
}

export function changeStringPitch(instrument, stringId, midi) {
  return {
    ...instrument,
    strings: instrument.strings.map((string) => string.id !== stringId ? string : ({
      ...string,
      midi,
      winding: string.winding?.mode === "manual"
        ? string.winding
        : { mode: "auto", value: suggestWinding(instrument.type, midi) },
    })),
  };
}

export function changeInstrumentType(instrument, type) {
  return {
    ...instrument,
    type,
    strings: instrument.strings.map((string) => ({
      ...string,
      winding: string.winding?.mode === "manual"
        ? string.winding
        : { mode: "auto", value: suggestWinding(type, string.midi) },
    })),
  };
}

export function setStringWinding(instrument, stringId, selection) {
  return {
    ...instrument,
    strings: instrument.strings.map((string) => string.id !== stringId ? string : ({
      ...string,
      winding: selection === "auto"
        ? { mode: "auto", value: suggestWinding(instrument.type, string.midi) }
        : { mode: "manual", value: selection === "wound" },
    })),
  };
}

export function resizeInstrumentStrings(instrument, count) {
  const nextCount = Math.max(MIN_INSTRUMENT_STRINGS, Math.min(MAX_INSTRUMENT_STRINGS, Math.trunc(Number(count) || MIN_INSTRUMENT_STRINGS)));
  let strings = instrument.strings.slice(0, nextCount);
  while (strings.length < nextCount) {
    const index = strings.length;
    const midi = strings.length ? instrument.strings[strings.length - 1].midi : 60;
    strings = [...strings, {
      id: `string-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${index}`,
      midi,
      winding: { mode: "auto", value: suggestWinding(instrument.type, midi) },
    }];
  }
  return { ...instrument, strings };
}

export function validateInstrumentPreset(preset) {
  const errors = [];
  if (!preset || typeof preset !== "object") return ["Preset must be an object."];
  if (typeof preset.name !== "string" || !preset.name.trim()) errors.push("Enter a preset name.");
  if (!BUILDER_INSTRUMENT_TYPES.some(({ id }) => id === preset.type)) errors.push("Choose a supported instrument type.");
  if (!Array.isArray(preset.strings) || preset.strings.length < MIN_INSTRUMENT_STRINGS || preset.strings.length > MAX_INSTRUMENT_STRINGS) {
    errors.push(`An instrument must have between ${MIN_INSTRUMENT_STRINGS} and ${MAX_INSTRUMENT_STRINGS} strings.`);
  } else {
    preset.strings.forEach((string, index) => {
      if (!Number.isInteger(string.midi) || string.midi < MIN_MIDI_PITCH || string.midi > MAX_MIDI_PITCH) {
        errors.push(`String ${index + 1} must have a MIDI pitch between ${MIN_MIDI_PITCH} and ${MAX_MIDI_PITCH}.`);
      }
      if (!["auto", "manual"].includes(string.winding?.mode)) errors.push(`String ${index + 1} has an invalid winding setting.`);
      if (string.winding?.mode === "manual" && typeof string.winding.value !== "boolean") errors.push(`String ${index + 1} has an invalid manual winding value.`);
    });
  }
  return errors;
}

export function normalizeSavedPreset(preset) {
  const normalized = createInstrumentDraft({ ...preset, isBuiltIn: false });
  normalized.id = typeof preset.id === "string" && preset.id.startsWith("user-")
    ? preset.id
    : `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  normalized.name = String(preset.name || "").trim();
  normalized.isBuiltIn = false;
  return normalized;
}

export function toFretboardInstrument(preset) {
  if (!preset || !Array.isArray(preset.strings)) return null;
  const stringDefinitions = preset.strings.map((string, index) => ({
    id: string.id || `string-${index + 1}`,
    midi: string.midi,
    winding: {
      mode: string.winding?.mode === "manual" ? "manual" : "auto",
      value: string.winding?.mode === "manual"
        ? Boolean(string.winding.value)
        : suggestWinding(preset.type, string.midi),
    },
  }));
  return {
    id: preset.id,
    name: preset.name,
    type: preset.type,
    strings: stringDefinitions.map(({ midi }) => ((midi % 12) + 3) % 12),
    openStringMidi: stringDefinitions.map(({ midi }) => midi),
    stringDefinitions,
  };
}
