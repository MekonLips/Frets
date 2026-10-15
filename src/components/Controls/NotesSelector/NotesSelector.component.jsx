import React from 'react';
import { useRecoilState } from 'recoil';
import { selectedNotesAtom } from '../../../recoil/frets.recoil';
import { ACTIONS } from '../../../config/frets.config';

const { NOTE, NATURALS, ACCIDENTALS } = ACTIONS.NOTES;

const NotesSelector = () => {
    const [ selected, setSelected ] = useRecoilState(selectedNotesAtom);
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