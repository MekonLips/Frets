import { NOTES_NUM, FRETS_NUM, ACTIONS } from '../config/frets.config';
import { isNatural, isAccidental, getNoteByIdx } from '../utils/note.utils';

const { NOTE, NATURALS, ACCIDENTALS } = ACTIONS.NOTES;

onmessage = async e => {
    const type = e.data.type;
    switch (type) {
        case NOTE:
        case NATURALS:
        case ACCIDENTALS:
            const { instrument, selectedNote } = e.data.payload;
            const fretNotes = [];
            instrument.strings.map((noteIdx, idx) => 
                fretNotes.push({ string: idx + 1, fret: 0, note: getNoteByIdx(noteIdx) }));
            for (let string = 1; string <= instrument.strings.length; string++) {
                for (let fret = 1; fret <= FRETS_NUM; fret++) {
                    const idx = (instrument.strings[string - 1] + fret) % NOTES_NUM;
                    if (type === NOTE && idx === selectedNote)
                        fretNotes.push({ string, fret, note: getNoteByIdx(idx) });
                    else if ((type === NATURALS && isNatural(idx)) || (type === ACCIDENTALS && isAccidental(idx)))
                        fretNotes.push({ string, fret, note: getNoteByIdx(idx) });
                }
            }
            postMessage({ type, payload: { success: true, fretNotes } });
            break;
        default:
            postMessage({ type, payload: { error: true, message: `type ${type} not recognised` } });
    }
};