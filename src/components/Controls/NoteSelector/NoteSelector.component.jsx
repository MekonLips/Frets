import React from 'react';
import { useFretsStore } from '../../../store/useFretsStore';
import { NOTES, ACTIONS } from '../../../config/frets.config';

const NoteSelector = ({ show = false }) => {
    const selectedNotes = useFretsStore(state => state.selectedNotesMode);
    const selected = useFretsStore(state => state.selectedNoteIdx ?? 0);
    const setSelected = useFretsStore(state => state.setSelectedNote);
    const changeHandler = e => setSelected(parseInt(e.target.value));
    if (show || selectedNotes === ACTIONS.NOTES.NOTE)
        return <label>
            <select className="legacy-form-select" onChange={changeHandler} value={selected}>
                {NOTES.map((note, idx) => <option key={`NoteSelector/Option/${idx}`} value={idx}>{note}</option>)}
            </select>
        </label>;
    return null;
};

export default NoteSelector;