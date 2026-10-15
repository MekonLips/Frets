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
    const instrument = getSelectedInstrument(selectedId);
    const hasOnePassPerNote = [4, 5].includes(Number(exercise));
    const notesPerStage = instrument.strings.length * (hasOnePassPerNote ? 1 : 2);
    // Exercises 4/5 show the current and following note. Other exercises
    // show the current note's ascending/descending pair.
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

    const createLine = (line, string, fret, isActive) => {
        const position = (string - 1) * 3 + 1;
        const width = fret < 10 ? 1 : 2;
        const template = new Array(20).fill('-');
        template.splice(position, width, fret);
        const key = `Tab/Line/${line}/String/${string}/Fret/${fret}`;

        if (!isActive)
            return <pre key={key}>{template.join('')}</pre>;

        return <pre key={key}>
            {template.slice(0, position).join('')}
            <span style={{ color: 'rgba(32,128,32,1)', fontWeight: 'bold' }}>{fret}</span>
            {template.slice(position + width).join('')}
        </pre>;
    };

    const createTab = (valuePattern, valueInstrument, patternOffset) => {
        const sections = [];

        for (let i = 0; i < valuePattern.length; i += valueInstrument.strings.length) {
            const entries = valuePattern
                .slice(i, i + valueInstrument.strings.length)
                .map((note, offset) => ({ note, index: i + offset }))
                .filter(({ note }) => Boolean(note));

            // Pattern order determines playback timing, not visual row order.
            // Render tablature in its conventional layout: string 1 at the top,
            // then string 2, etc. Keep each entry's original pattern index so
            // the active fret follows playback even though rows are reordered.
            const strings = valueInstrument.strings
                .map((_, stringIndex) => {
                    const string = stringIndex + 1;
                    const entry = entries.find(({ note }) => note.string === string);

                    if (!entry) return null;

                    return createLine(
                        entry.index,
                        entry.note.string,
                        entry.note.fret,
                        patternOffset + entry.index === activeIndex
                    );
                })
                .filter(Boolean);

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
