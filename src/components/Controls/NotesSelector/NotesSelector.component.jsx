import React from 'react';
import { useFretsStore } from '../../../store/useFretsStore';
import { ACTIONS } from '../../../config/frets.config';

const { NOTE, NATURALS, ACCIDENTALS } = ACTIONS.NOTES;

const NotesSelector = () => {
    const selected = useFretsStore(state => state.selectedNotesModeIndex ?? 0);
    const setSelected = useFretsStore(state => state.setSelectedNotesMode);
    const changeHandler = e => setSelected(parseInt(e.target.value));
    return <label>
        <select className="legacy-form-select" onChange={changeHandler} value={selected}>
            <option key={`NotesSelector/Option/${NOTE}`} value={NOTE}>Single note</option>
            <option key={`NotesSelector/Option/${NATURALS}`} value={NATURALS}>Whole notes</option>
            <option key={`NotesSelector/Option/${ACCIDENTALS}`} value={ACCIDENTALS}>Accidentals</option>
        </select>
    </label>
};

export default NotesSelector;