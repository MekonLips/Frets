import { validateInstrumentPreset, normalizeSavedPreset } from "./instrumentBuilder.utils.js";

export const INSTRUMENT_BUILDER_STORAGE_KEY = "frets-instrument-builder-v1";

function getStorage(storage) {
  if (storage) return storage;
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

export function loadSavedInstrumentPresets(storage) {
  const target = getStorage(storage);
  if (!target) return [];
  try {
    const raw = target.getItem(INSTRUMENT_BUILDER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((preset) => validateInstrumentPreset(preset).length === 0)
      .map((preset) => ({ ...normalizeSavedPreset(preset), id: preset.id, isBuiltIn: false }));
  } catch {
    return [];
  }
}

export function saveInstrumentPresets(presets, storage) {
  const target = getStorage(storage);
  if (!target) return false;
  try {
    const safePresets = presets
      .filter((preset) => !preset.isBuiltIn && validateInstrumentPreset(preset).length === 0)
      .map((preset) => ({ ...preset, isBuiltIn: false }));
    target.setItem(INSTRUMENT_BUILDER_STORAGE_KEY, JSON.stringify(safePresets));
    return true;
  } catch {
    return false;
  }
}
