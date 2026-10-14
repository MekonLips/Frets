import styled from 'styled-components';

import { gridColumns } from '../../../utils/grid.utils';
import { Z_INDEX, GRID_MARGIN, COLORS } from '../../../config/frets.config';

export const Notes = styled.div`
position: absolute;
top: 0;
left: 0;

width: 100vw;
height: 100%;
min-height: ${props => props.strings}px;

display: grid;
grid-template-columns: ${GRID_MARGIN}vw ${gridColumns(24)} ${GRID_MARGIN}vw;
grid-template-rows: repeat(${props => props.strings}, 1fr);

// outline: 1px solid orange;
`;

export const Note = styled.div`
z-index: ${Z_INDEX.Note};

display: grid;

grid-column-start: ${props => props.fret + 1};
grid-row-start: ${props => props.string};

justify-content: center;
align-items: center;

color: ${COLORS.Note.color};

span {
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
    border: 2px solid ${COLORS.Note.borderColor};

    background-color: ${COLORS.Note.backgroundColor};
    box-shadow: 0 0 3px 3px rgba(0,0,0,0.6);
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;

    display: grid;

    justify-content: center;
    align-items: center;

}

${props => props.string === props.activeString && props.fret === props.activeFret ? `
color: ${COLORS.Note.colorAlt};
span {
    border-color: ${COLORS.Note.borderColorAlt};
    background-color: ${COLORS.Note.backgroundColorAlt};
    transform: scaleX(1.2) scaleY(1.2);
}
` : ``}
// outline: 1px solid orange;
`;
