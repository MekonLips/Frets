import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedNotesAtom, selectedNoteIdxAtom } from '../../../recoil/frets.recoil';
import { Select } from '../../../styles/form.styles';
import { NOTES, ACTIONS } from '../../../config/frets.config';

const NoteSelector = ({ show = false }) => {
    const selectedNotes = useRecoilValue(selectedNotesAtom);
    const [ selected, setSelected ] = useRecoilState(selectedNoteIdxAtom);
    const changeHandler = e => setSelected(parseInt(e.target.value));
    if (show || selectedNotes === ACTIONS.NOTES.NOTE)
        return <label>
            <select className="legacy-form-select" onChange={changeHandler} value={selected}>
                {NOTES.map((note, idx) =>
                    <option key={`NoteSelector/Option/${idx}`} value={idx}>{note}</option>)}
            </select>
        </label>
    else
        return null;
};

export default NoteSelector;