import styled from 'styled-components';

import { gridColumns, gridHeight, gridMinHeight } from '../../../utils/grid.utils';
import { Z_INDEX, GRID_MARGIN } from '../../../config/frets.config';

export const Numbers = styled.div`
position: absolute;
z-index: ${Z_INDEX.Fretboard};
top: -${gridHeight(1)};
left: 0;

width: 100vw;
height: ${gridHeight(1)};
min-height: ${gridMinHeight(1)};

display: grid;
grid-template-columns: ${GRID_MARGIN}vw ${gridColumns(24)} ${GRID_MARGIN}vw;
grid-template-rows: 1fr;

// outline: 1px solid teal;
`;

export const Number = styled.div`
height: ${gridHeight(1)};
min-height: ${gridMinHeight(1)};

font-weight: bold;

display: grid;

grid-column-start: ${props => props.fret + 1};
grid-column-end: ${props => props.fret + 1};

justify-content: center;
align-items: center;

// outline: 1px solid teal;
// background-color: teal;
`;
