import React from 'react';
import { useParams } from 'react-router';

import { useFretsStore, getSelectedInstrument } from '../../store/useFretsStore';
import { getNoteByIdx, getTabPatternWindow } from '../../utils/note.utils';
import { pad } from '../../utils/string.utils';
import { getTabFretPosition, getTabLineWidth } from '../../utils/tab.utils';
import { Z_INDEX } from '../../config/frets.config';

const TabComponent = () => {
    const { exercise } = useParams();
    const isExercise = Boolean(exercise);
    const exerciseState = useFretsStore(state => state.exercises[String(exercise ?? '')]);
    const stage = exerciseState?.stage ?? 1;
    const pattern = exerciseState?.pattern ?? [];
    const beat = exerciseState?.beat ?? 0;
    const running = useFretsStore(state => state.sequencePlaying);
    const activeIndex = running && beat > 0 && pattern.length
        ? (beat - 1) % pattern.length
        : -1;
    const selectedId = useFretsStore(state => state.selectedInstrumentId);
    const activeInstrumentDefinition = useFretsStore(state => state.activeInstrumentDefinition);
    const instrument = getSelectedInstrument(activeInstrumentDefinition || selectedId);
    const { start: sliceStart, pattern: slice } = getTabPatternWindow({
        pattern,
        stage,
        stringCount: instrument.strings.length,
        exercise,
    });

    const createHeader = value => value.strings.map((noteIdx, idx) =>
        <pre key={`Tab/Header/${idx}`}>{pad(getNoteByIdx(noteIdx), ' ', 3)}</pre>
    );

    const createBreak = (selectedNote, value) => value.strings.reduce((arr, val, idx) => {
        arr.push(<pre key={`Tab/Break/${idx + 1}`}>|-</pre>);
        return arr;
    }, [<pre key="Tab/Break/0">{pad(selectedNote, ' ', 2)}</pre>]);

    // Keep each fret in the slot assigned to its physical string and pass
    // direction. The layout helper owns the ascending/descending placement rule.
    const createLine = (line, note, isActive, stringCount) => {
        const { string, fret } = note;
        const position = getTabFretPosition(note, stringCount);
        const width = String(fret).length;
        const template = new Array(getTabLineWidth(stringCount)).fill('-');
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
                .map((note, offset) => ({ note, index: i + offset }))
                .filter(({ note }) => Boolean(note));

            // Keep standard tablature row order (string 1 at the top).
            // Horizontal placement is derived from direction and physical
            // string index, not the entry's array offset.
            const strings = entries
                .sort((a, b) => a.note.string - b.note.string)
                .map(({ note, index }) => createLine(
                    index,
                    note,
                    patternOffset + index === activeIndex,
                    valueInstrument.strings.length
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

    if (isExercise)
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
