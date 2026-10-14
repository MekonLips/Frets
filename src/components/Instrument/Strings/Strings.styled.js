import styled from 'styled-components';

import { minmax } from '../../../utils/math.utils';
import { Z_INDEX, GRID_ROW_HEIGHT, GRID_ROW_HEIGHT_MIN, COLORS } from '../../../config/frets.config';

export const Strings = styled.div`
position: absolute;
top: 0;
left: 0;

width: 200vw;
height: ${props => GRID_ROW_HEIGHT * props.strings}vh;
min-height: ${props => GRID_ROW_HEIGHT_MIN * props.strings}px;

display: grid;
grid-template-columns: 1fr;
grid-template-rows: repeat(${props => props.strings}, 1fr);

// outline: 1px solid blue;
`;

export const String = styled.div`
z-index: ${Z_INDEX.String};

display: grid;

align-items: center;

&:after {
    content: "";
    width: 100%;
    height: ${props => `${minmax(props.string, 2, 5)}px`};
    background: ${COLORS.String.gradientColor1};
    background: linear-gradient(0deg, 
        ${COLORS.String.gradientColor1} 0%, 
        ${COLORS.String.gradientColor2} 50%, 
        ${COLORS.String.gradientColor3} 80%);
    box-shadow: 0 3px 3px 0 rgba(0,0,0,0.6), 
                0 -3px 3px 0 rgba(0,0,0,0.6);
    display: block;
}

// outline: 1px solid blue;
`;
