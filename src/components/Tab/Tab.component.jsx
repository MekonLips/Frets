import React from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { exerciseStageAtom, exercisePatternAtom, startFretAtom, endFretAtom, selectedInstrumentIdAtom, getInstrumentSelector } from '../../recoil/frets.recoil';

import { getNoteByIdx } from '../../utils/note.utils';
import { pad } from '../../utils/string.utils';
import { EXERCISES_NUM, Z_INDEX } from '../../config/frets.config';

const TabComponent = () => {
    const { exercise } = useParams();
    const isExercise = exercise ? true : false;
    const start = useRecoilValue(startFretAtom);
    const end = useRecoilValue(endFretAtom);
    const selectedId = useRecoilValue(selectedInstrumentIdAtom);
    const instrument = useRecoilValue(getInstrumentSelector(selectedId));
    const stage = useRecoilValue(exerciseStageAtom(exercise));
    const pattern = useRecoilValue(exercisePatternAtom(exercise));
    const slice = pattern.slice((stage - 1) * (instrument.strings.length * 2), ((stage - 1) * (instrument.strings.length * 2)) + (instrument.strings.length * 2));
    const createHeader = instrument => instrument.strings.map((noteIdx, idx) => <pre key={`Tab/Header/${idx}`}>{pad(getNoteByIdx(noteIdx), ' ', 3)}</pre>);
    const createBreak = (selectedNote, instrument) => instrument.strings.reduce((arr, val, idx) => {
            arr.push(<pre key={`Tab/Break/${idx + 1}`}>|-</pre>);
            return arr;
        }, [<pre key={`Tab/Break/${0}`}>{pad(selectedNote, ' ', 2)}</pre>]);
    const createLine = (line, string, fret) => {
        const template = new Array(20).fill('-');
        template.splice((string - 1) * 3 + 1, fret < 10 ? 1 : 2, fret);
        return <pre key={`Tab/Line/${line}/String/${string}/Fret/${fret}`}>{template.join('')}</pre>
    };
    const createTab = (pattern, instrument) => {
        const sections = [];
        for (let i = 0; i < pattern.length; i += instrument.strings.length) {
            const strings = [];
            for (let j = i; j < i + instrument.strings.length; j++) {
                strings.push(createLine(j, pattern[j].string, pattern[j].fret));
            }
            sections.push(<div className="legacy-tab-break" key={`Tab/Breaks/${i}`}>{createBreak(getNoteByIdx(pattern[i].noteIdx), instrument)}</div>);
            sections.push(<div className="legacy-tab-strings" key={`Tab/Strings/${i}`}>{strings}</div>);
        }
        return sections;
    };
    if (isExercise && parseInt(exercise) !== EXERCISES_NUM)
        return <Container>
            <Content start={start} end={end}>
                <Tab>
                    <Header>{createHeader(instrument)}</Header>
                    {createTab(slice, instrument)}
                </Tab>
            </Content>
        </Container>
    else
        return null;
};

export default TabComponent;