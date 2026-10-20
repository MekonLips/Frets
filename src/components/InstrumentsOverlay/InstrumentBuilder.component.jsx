import React, { useEffect, useMemo, useState } from "react";
import { useFretsStore } from "../../store/useFretsStore.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import guitarIcon from "../../assets/instruments/guitar.png";
import bassIcon from "../../assets/instruments/bass.png";
import mandolinIcon from "../../assets/instruments/mandolin.png";
import ukuleleIcon from "../../assets/instruments/ukulele.png";
import banjoIcon from "../../assets/instruments/banjo.png";
import {
  BUILT_IN_INSTRUMENT_PRESETS,
  BUILDER_INSTRUMENT_TYPES,
  DEFAULT_BUILDER_PRESET_ID,
  getDefaultPresetForType,
  generatePresetName,
  MAX_INSTRUMENT_STRINGS,
  MIN_INSTRUMENT_STRINGS,
  MAX_MIDI_PITCH,
  MIN_MIDI_PITCH,
  changeStringPitch,
  createInstrumentDraft,
  midiToNoteName,
  resizeInstrumentStrings,
  setStringWinding,
  validateInstrumentPreset,
  toFretboardInstrument,
} from "../../instruments/instrumentBuilder.utils.js";
import {
  loadSavedInstrumentPresets,
  saveInstrumentPresets,
} from "../../instruments/instrumentBuilder.storage.js";

const TYPE_IMAGES = {
  guitar: guitarIcon,
  bass: bassIcon,
  mandolin: mandolinIcon,
  ukulele: ukuleleIcon,
  banjo: banjoIcon,
};

const InstrumentBuilder = () => {
  const [savedPresets, setSavedPresets] = useState(() => loadSavedInstrumentPresets());
  const [selectedPresetId, setSelectedPresetId] = useState(DEFAULT_BUILDER_PRESET_ID);
  const [draft, setDraft] = useState(() => createInstrumentDraft(BUILT_IN_INSTRUMENT_PRESETS[0]));
  const [error, setError] = useState("");
  const setInstrumentDefinition = useFretsStore(state => state.setInstrumentDefinition);
  const presets = useMemo(() => [...BUILT_IN_INSTRUMENT_PRESETS, ...savedPresets], [savedPresets]);

  useEffect(() => {
    const preset = presets.find(({ id }) => id === selectedPresetId);
    if (preset) setDraft(createInstrumentDraft(preset));
  }, [selectedPresetId, presets]);

  const updateDraft = (nextDraft) => {
    setDraft(nextDraft);
    setInstrumentDefinition(toFretboardInstrument(nextDraft));
    setError("");
  };

  const selectPreset = (id) => {
    const preset = presets.find(({ id: presetId }) => presetId === id);
    if (!preset) return;
    setSelectedPresetId(id);
    setDraft(createInstrumentDraft(preset));
    setInstrumentDefinition(toFretboardInstrument(preset));
    setError("");
  };

  const selectInstrumentType = (type) => {
    const preset = getDefaultPresetForType(type);
    if (!preset) return;
    setSelectedPresetId(preset.id);
    setDraft(createInstrumentDraft(preset));
    setInstrumentDefinition(toFretboardInstrument(preset));
    setError("");
  };

  const savePreset = () => {
    const candidate = { ...draft, name: draft.name.trim() || generatePresetName(draft.type, draft.strings) };
    const errors = validateInstrumentPreset(candidate);
    if (errors.length) {
      setError(errors[0]);
      return;
    }
    const existing = savedPresets.find((preset) => preset.id === selectedPresetId);
    const next = existing
      ? savedPresets.map((preset) => preset.id === existing.id ? { ...candidate, id: existing.id, isBuiltIn: false } : preset)
      : [...savedPresets, { ...candidate, id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, isBuiltIn: false }];
    if (!saveInstrumentPresets(next)) {
      setError("Could not save presets in this browser.");
      return;
    }
    const saved = existing ? next.find(({ id }) => id === existing.id) : next[next.length - 1];
    setSavedPresets(next);
    setSelectedPresetId(existing ? existing.id : saved.id);
    setDraft({ ...candidate, id: existing ? existing.id : saved.id, isBuiltIn: false });
    setInstrumentDefinition(toFretboardInstrument(saved));
    setError("");
  };

  const deletePreset = () => {
    const selected = savedPresets.find(({ id }) => id === selectedPresetId);
    if (!selected) return;
    if (typeof window !== "undefined" && !window.confirm(`Delete the preset "${selected.name}"?`)) return;
    const next = savedPresets.filter(({ id }) => id !== selected.id);
    if (!saveInstrumentPresets(next)) {
      setError("Could not update presets in this browser.");
      return;
    }
    setSavedPresets(next);
    setSelectedPresetId(DEFAULT_BUILDER_PRESET_ID);
    const defaultPreset = BUILT_IN_INSTRUMENT_PRESETS.find(({ id }) => id === DEFAULT_BUILDER_PRESET_ID);
    if (defaultPreset) setInstrumentDefinition(toFretboardInstrument(defaultPreset));
    setError("");
  };

  const selectedIsSaved = savedPresets.some(({ id }) => id === selectedPresetId);

  return (
    <div className="instrument-builder">
      <div className="instrument-builder-type-row" role="group" aria-label="Instrument type">
        {BUILDER_INSTRUMENT_TYPES.map(({ id, label }) => (
          <button
            type="button"
            key={id}
            className={`instrument-builder-type ${draft.type === id ? "is-selected" : ""}`}
            aria-label={label}
            aria-pressed={draft.type === id}
            onClick={() => selectInstrumentType(id)}
          >
            <img src={TYPE_IMAGES[id]} alt="" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <label className="instrument-builder-field">
        <span>Choose an instrument preset</span>
        <select className="legacy-form-select" value={selectedPresetId} onChange={(event) => selectPreset(event.target.value)}>
          <optgroup label="Built-in presets">
            {BUILT_IN_INSTRUMENT_PRESETS.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </optgroup>
          {savedPresets.length > 0 && (
            <optgroup label="My presets">
              {savedPresets.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
            </optgroup>
          )}
        </select>
      </label>

      <div className="instrument-builder-name-row">
        <label className="instrument-builder-field">
          <span>Enter a preset name to save this configuration</span>
          <input
            className="instrument-builder-input"
            value={draft.name}
            maxLength={80}
            placeholder={generatePresetName(draft.type, draft.strings)}
            onChange={(event) => updateDraft({ ...draft, name: event.target.value })}
          />
        </label>
        <button type="button" className="legacy-form-button instrument-builder-save" onClick={savePreset}><FontAwesomeIcon icon={faFloppyDisk} /> Save preset</button>
        <button type="button" className={`legacy-form-button instrument-builder-delete ${selectedIsSaved ? "is-enabled" : "is-disabled"}`} onClick={deletePreset} disabled={!selectedIsSaved} aria-disabled={!selectedIsSaved}><FontAwesomeIcon icon={faTrash} /> Delete</button>
      </div>

      <div className="instrument-builder-string-heading">
        <h2>Strings</h2>
        <div className="instrument-builder-count">
          <button type="button" className="control-button control-button-icon" aria-label="Remove string" disabled={draft.strings.length <= MIN_INSTRUMENT_STRINGS} onClick={() => updateDraft(resizeInstrumentStrings(draft, draft.strings.length - 1))}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span>{draft.strings.length}</span>
          <button type="button" className="control-button control-button-icon" aria-label="Add string" disabled={draft.strings.length >= MAX_INSTRUMENT_STRINGS} onClick={() => updateDraft(resizeInstrumentStrings(draft, draft.strings.length + 1))}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      <p className="instrument-builder-hint">Top string to bottom string. Pitches are shown with octave numbers.</p>
      <div className="instrument-builder-strings">
        {draft.strings.map((string, index) => (
          <div className="instrument-builder-string" key={string.id}>
            <span className="instrument-builder-string-number">{index + 1}</span>
            <label>
              <span className="instrument-builder-sr-only">String {index + 1} pitch</span>
              <select
                className="instrument-builder-input"
                aria-label={`String ${index + 1} pitch`}
                value={string.midi}
                onChange={(event) => updateDraft(changeStringPitch(draft, string.id, Number(event.target.value)))}
              >
                {Array.from({ length: MAX_MIDI_PITCH - MIN_MIDI_PITCH + 1 }, (_, offset) => MIN_MIDI_PITCH + offset).map((midi) => (
                  <option key={midi} value={midi}>{midiToNoteName(midi)}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="instrument-builder-sr-only">String {index + 1} winding</span>
              <select
                className="instrument-builder-input"
                aria-label={`String ${index + 1} winding`}
                value={string.winding.mode === "manual" ? (string.winding.value ? "wound" : "unwound") : "auto"}
                onChange={(event) => updateDraft(setStringWinding(draft, string.id, event.target.value))}
              >
                <option value="auto">Auto ({string.winding.value ? "wound" : "unwound"})</option>
                <option value="wound">Wound</option>
                <option value="unwound">Unwound</option>
              </select>
            </label>
          </div>
        ))}
      </div>

      {error && <p className="instrument-builder-error" role="alert">{error}</p>}
      <p className="instrument-builder-hint">Presets are saved in this browser. Tuning and winding changes apply to the fretboard immediately.</p>
    </div>
  );
};

export default InstrumentBuilder;
