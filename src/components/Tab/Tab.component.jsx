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
    const beat = exerciseState?.beat ?? 0;
    const running = useFretsStore(state => state.timerRunning);
    const activeIndex = running && beat > 0 && pattern.length
        ? (beat - 1) % pattern.length
        : -1;
    const selectedId = useFretsStore(state => state.selectedInstrumentId);
    const activeInstrumentDefinition = useFretsStore(state => state.activeInstrumentDefinition);
    const instrument = getSelectedInstrument(activeInstrumentDefinition || selectedId);
    const hasOnePassPerNote = [4, 5].includes(Number(exercise));
    const notesPerStage = instrument.strings.length * (hasOnePassPerNote ? 1 : 2);
    const visibleStages = hasOnePassPerNote ? 2 : 1;
    const sliceStart = (stage - 1) * notesPerStage;
    const slice = pattern.slice(
        sliceStart,
        (stage - 1 + visibleStages) * notesPerStage
    );

    const createHeader = value => value.strings.map((noteIdx, idx) =>
        <pre key={`Tab/Header/${idx}`}>{pad(getNoteByIdx(noteIdx), ' ', 3)}</pre>
    );

    const createBreak = (selectedNote, value) => value.strings.reduce((arr, val, idx) => {
        arr.push(<pre key={`Tab/Break/${idx + 1}`}>|-</pre>);
        return arr;
    }, [<pre key="Tab/Break/0">{pad(selectedNote, ' ', 2)}</pre>]);

    // The left-to-right position follows playback order within each string
    // group, while the row itself stays on its physical guitar string.
    const createLine = (line, string, fret, isActive, sequenceOffset) => {
        const position = sequenceOffset * 3 + 1;
        const width = fret < 10 ? 1 : 2;
        const template = new Array(20).fill('-');
        template.splice(position, width, ...String(fret).split(''));
        const key = `Tab/Line/${line}/String/${string}/Fret/${fret}`;

        if (!isActive)
            return <pre key={key}>{template.join('')}</pre>;

        return <pre key={key}>{template.slice(0, position).join('')}<span style={{ display: 'inline-block', position: 'relative', width: `${width}ch`, height: '1em', verticalAlign: 'middle', textAlign: 'center' }}><span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: `${width === 1 ? 1.35 : 1.8}em`, height: `${width === 1 ? 1.35 : 1.8}em`, borderRadius: '50%', backgroundColor: 'rgba(32,128,32,1)', color: '#fff', fontWeight: 'bold', lineHeight: 1, boxSizing: 'border-box' }}>{fret}</span></span>{template.slice(position + width).join('')}</pre>;
    };

    const createTab = (valuePattern, valueInstrument, patternOffset) => {
        const sections = [];

        for (let i = 0; i < valuePattern.length; i += valueInstrument.strings.length) {
            const entries = valuePattern
                .slice(i, i + valueInstrument.strings.length)
                .map((note, offset) => ({ note, index: i + offset, sequenceOffset: offset }))
                .filter(({ note }) => Boolean(note));

            // Keep standard tablature row order (string 1 at the top), but
            // place each fret according to its original sequence position.
            // Thus ascending starts bottom-left and descending starts top-left.
            const strings = entries
                .sort((a, b) => a.note.string - b.note.string)
                .map(({ note, index, sequenceOffset }) => createLine(
                    index,
                    note.string,
                    note.fret,
                    patternOffset + index === activeIndex,
                    sequenceOffset
                ));

            if (valuePattern[i]) {
                sections.push(
                    <div className="legacy-tab-break" key={`Tab/Breaks/${i}`}>
                        {createBreak(getNoteByIdx(valuePattern[i].noteIdx), valueInstrument)}
                    </div>
                );
                sections.push(
                    <div className="legacy-tab-strings" key={`Tab/Strings/${i}`}>
                        {strings}
                    </div>
                );
            }
        }

        return sections;
    };

    if (isExercise && parseInt(exercise) !== EXERCISES_NUM)
        return <div className="legacy-tab-container" style={{ zIndex: Z_INDEX.Tab }}>
            <div className="legacy-tab-content">
                <div className="legacy-tab">
                    <div className="legacy-tab-header">{createHeader(instrument)}</div>
                    {createTab(slice, instrument, sliceStart)}
                </div>
            </div>
        </div>;

    return null;
};

export default TabComponent;
