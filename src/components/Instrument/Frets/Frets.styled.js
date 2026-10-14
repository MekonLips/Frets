import styled from 'styled-components';

import { gridColumns } from '../../../utils/grid.utils';
import { Z_INDEX, NOTES_NUM, COLORS, GRID_MARGIN, GRID_ROW_HEIGHT, GRID_ROW_HEIGHT_MIN } from '../../../config/frets.config';

export const Frets = styled.div`
position: absolute;
z-index: ${Z_INDEX.Fretboard};
top: 0;
left: 0;

width: 100vw;
height: ${props => GRID_ROW_HEIGHT * props.strings}vh;
min-height: ${props => GRID_ROW_HEIGHT_MIN * props.strings}px;

display: grid;
grid-template-columns: ${GRID_MARGIN}vw ${gridColumns(24)} ${GRID_MARGIN}vw;
grid-template-rows: 1fr;

// outline: 1px solid rgba(0,0,255,0.1);
// background-color: rgba(0,255,0,0.1);
`;

export const Fret = styled.div`
height: 100%;

display: grid;
grid-column-start: ${props => props.fret + 1};

justify-content: center;
align-items: center;

box-shadow: inset 5px 0 5px 0 rgba(0,0,0,0.3);
&:nth-child(2) {
    box-shadow: inset 10px 0 10px 0 rgba(0,0,0,0.6);
}

border-right: 3px solid ${COLORS.Fret.gradientColor1};
border-left: 3px solid ${COLORS.Fret.gradientColor2};
${props => props.fret === 1 ? `
padding-left: 3px;
border-left: 0;
` : ``}

background-color: ${COLORS.Fretboard.backgroundColorDark};
&:first-child {
  border: 0;
  border-right: 2rem solid white;
  background-color: ${COLORS.Nut.backgroundColor};
}
&:last-child {
  padding-right: 3px;
  border-right: 0;
  // border-left: 2vw solid ${COLORS.Fretboard.backgroundColorDark};
  background-color: transparent;
  justify-content: start;
  &:after {
    content: "";
    width: 2vw;
    height: 100%;
    border-right: 2vw solid ${COLORS.Fretboard.backgroundColor};
    display: block;
    background-color: ${COLORS.Fretboard.backgroundColorDark};
  }
}

&:nth-child(4),
&:nth-child(6),
&:nth-child(8),
&:nth-child(10),
&:nth-child(13),
&:nth-child(16),
&:nth-child(18),
&:nth-child(20),
&:nth-child(22),
&:nth-child(25) {
    position: relative;
    &:before,
    &:after {
        content: '';
        position: absolute;
        top: calc(50% - 0.5rem);
        left: calc(50% - 0.5rem);
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background-color: ${COLORS.Dot.backgroundColor};
        display: block;
    }
    &:before {
        display: none;
    }
    ${props => props.fret % NOTES_NUM === 0 ? `
    &:before {
        top: calc(33.3333333333% - 0.5rem);
        display: block;
    }
    &:after {
        top: calc(66.6666666666% - 0.5rem);
    }
    ` : ``};
}

// outline: 1px solid rgba(0,255,255,0.1);
// background-color: rgba(0,255,255,0.1);
`;
