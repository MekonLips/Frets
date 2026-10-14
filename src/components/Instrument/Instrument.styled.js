import styled from 'styled-components';
import { calcWidth } from '../../utils/grid.utils';
import { Z_INDEX, NOTES_NUM, COLORS, GRID_ROW_HEIGHT, GRID_ROW_HEIGHT_MIN } from '../../config/frets.config';

export const Instrument = styled.div`
position: relative;
z-index: ${Z_INDEX.Guitar};
width: 200vw;
height: ${props => GRID_ROW_HEIGHT * props.strings}vh;
min-height: ${props => GRID_ROW_HEIGHT_MIN * props.strings}px;
background-color: ${COLORS.Neck.backgroundColor};
box-shadow: 0 -20px 20px 0 rgba(0,0,0,0.5), 
            0 20px 20px 0 rgba(0,0,0,0.5);
`;

export const FretGrid = styled.div`
position: relative;
width: 100vw;
height: 100%;

transition: transform 0.3s;
transform: translateX(${props => 
  `calc(
    -${calcWidth(props.start - 1) * calcWidth(NOTES_NUM + 2) / 100}vw + 
    ${(calcWidth(props.start - 1 + NOTES_NUM) - calcWidth(NOTES_NUM)) * calcWidth(NOTES_NUM + 2) / 100 / 2}vw
  )`});

// outline: 1px solid rgba(0,0,255,0.1);
// background-color: rgba(255,0,0,0.1);
`;
