import React from 'react';
import { useParams } from 'react-router';

import { useFretsStore, getSelectedInstrument } from '../../store/useFretsStore';
import { getNoteByIdx } from '../../utils/note.utils';
import { pad } from '../../utils/string.utils';
import { EXERCISES_NUM, Z_INDEX } from '../../config/frets.config';

const TabComponent = () => {
    const { exercise } = useParams();
    const isExercise = Boolean(exercise);
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const stage = exerciseState?.stage ?? 1;
    const pattern = exerciseState?.pattern ?? [];
    const start = useFretsStore(state => state.startFret);
    const selectedId = useFretsStore(state => state.selectedInstrumentId);
    const instrument = getSelectedInstrument(selectedId);
    const hasOnePassPerNote = [4, 5].includes(Number(exercise));
    const notesPerStage = instrument.strings.length * (hasOnePassPerNote ? 1 : 2);
    // Exercises 1-3 (and 6) show the current note's up/down pair. Exercises
    // 4/5 show the current and following note, with one string pass per note.
    const visibleStages = hasOnePassPerNote ? 2 : 1;
    const slice = pattern.slice(
        (stage - 1) * notesPerStage,
        (stage - 1 + visibleStages) * notesPerStage
    );
    const createHeader = value => value.strings.map((noteIdx, idx) => <pre key={`Tab/Header/${idx}`}>{pad(getNoteByIdx(noteIdx), ' ', 3)}</pre>);
    const createBreak = (selectedNote, value) => value.strings.reduce((arr, val, idx) => {
        arr.push(<pre key={`Tab/Break/${idx + 1}`}>|-</pre>);
        return arr;
    }, [<pre key="Tab/Break/0">{pad(selectedNote, ' ', 2)}</pre>]);
    const createLine = (line, string, fret) => {
        const template = new Array(20).fill('-');
        template.splice((string - 1) * 3 + 1, fret < 10 ? 1 : 2, fret);
        return <pre key={`Tab/Line/${line}/String/${string}/Fret/${fret}`}>{template.join('')}</pre>;
    };
    const createTab = (valuePattern, valueInstrument) => {
        const sections = [];
        for (let i = 0; i < valuePattern.length; i += valueInstrument.strings.length) {
            const strings = [];
            for (let j = i; j < i + valueInstrument.strings.length; j++) {
                if (valuePattern[j]) strings.push(createLine(j, valuePattern[j].string, valuePattern[j].fret));
            }
            if (valuePattern[i]) {
                sections.push(<div className="legacy-tab-break" key={`Tab/Breaks/${i}`}>{createBreak(getNoteByIdx(valuePattern[i].noteIdx), valueInstrument)}</div>);
                sections.push(<div className="legacy-tab-strings" key={`Tab/Strings/${i}`}>{strings}</div>);
            }
        }
        return sections;
    };
    if (isExercise && parseInt(exercise) !== EXERCISES_NUM)
        return <div className="legacy-tab-container" style={{ zIndex: Z_INDEX.Tab }}>
            <div className="legacy-tab-content">
                <div className="legacy-tab">
                    <div className="legacy-tab-header">{createHeader(instrument)}</div>
                    {createTab(slice, instrument)}
                </div>
            </div>
        </div>;
    return null;
};

export default TabComponent;
