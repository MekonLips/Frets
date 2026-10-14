import React from 'react';
import { useRecoilState } from 'recoil';
import { selectedNotesAtom } from '../../../recoil/frets.recoil';
import { Select } from '../../../styles/form.styles';
import { ACTIONS } from '../../../config/frets.config';

const { NOTE, NATURALS, ACCIDENTALS } = ACTIONS.NOTES;

const NotesSelector = () => {
    const [ selected, setSelected ] = useRecoilState(selectedNotesAtom);
    const changeHandler = e => setSelected(parseInt(e.target.value));
    return <label>
        <Select onChange={changeHandler} value={selected}>
            <option key={`NotesSelector/Option/${NOTE}`} value={NOTE}>Single note</option>
            <option key={`NotesSelector/Option/${NATURALS}`} value={NATURALS}>Whole notes</option>
            <option key={`NotesSelector/Option/${ACCIDENTALS}`} value={ACCIDENTALS}>Accidentals</option>
        </Select>
    </label>
};

export default NotesSelector;