import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue, useRecoilState } from 'recoil';

import { selectedInstrumentIdAtom, getInstrumentSelector, startFretAtom, exerciseSequenceAtom, exerciseNotesAtom, exercisePatternAtom } from '../recoil/frets.recoil';
import { ACTIONS } from '../config/frets.config';

const { SEQUENCE, NOTES, PATTERN } = ACTIONS.PATTERNS;

const worker = new Worker(new URL('../workers/exercise.worker.js', import.meta.url), { type: 'module' });

export const useExercise = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const [ sequence, setSequence ] = useRecoilState(exerciseSequenceAtom(exercise));
    const [ notes, setNotes ] = useRecoilState(exerciseNotesAtom(exercise));
    const [ pattern, setPattern ] = useRecoilState(exercisePatternAtom(exercise));
    const selectedInstrumentId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedInstrumentId));
    const start = useRecoilValue(startFretAtom);

    const createSequence = () => 
        worker.postMessage({
            type: SEQUENCE, 
            payload: { 
                exercise, 
                strings: instrument.strings, 
                start, 
                accidentals: parseInt(exercise) === 3 ? true : false,
            },
        });
    
    const createNotes = () => 
        worker.postMessage({
            type: NOTES,
            payload: {
                exercise, 
                strings: instrument.strings, 
                start, 
                sequence,
            },
        });

    const createPattern = () => 
        worker.postMessage({
            type: PATTERN,
            payload: {
                exercise, 
                strings: instrument.strings, 
                start, 
                sequence,
            },
        });

    useEffect(() => {
        worker.onerror = async e => console.log('%cworker.onerror', 'color: red;', e);
    }, []);

    useEffect(() => {
        worker.onmessage = async e => {
            const type = e.data.type;
            const payload = e.data.payload;
            switch (type) {
                case SEQUENCE:
                case NOTES:
                case PATTERN:
                    if (payload.sequence)
                        setSequence(payload.sequence);
                    if (payload.notes)
                        setNotes(payload.notes);
                    if (payload.pattern)
                        setPattern(payload.pattern);
                    break;
                default:
                    console.log(`%ctype ${type} not recognised`, 'color: red;');
            }
        };
    }, [setSequence, setNotes, setPattern]);

    return { worker, isExercise, exercise, sequence, notes, pattern, instrument, start, createSequence, createNotes, createPattern }
};

export default useExercise;