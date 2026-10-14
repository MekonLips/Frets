import styled from 'styled-components';

import { calcWidth } from '../../utils/grid.utils';
import { Z_INDEX, NOTES_NUM, GRID_MARGIN } from '../../config/frets.config';

export const Range = styled.div`
position: absolute;
z-index: ${Z_INDEX.Range};
top: 0;
left: 0;
width: 100vw;
height: 100vh;

pointer-events: none;
`;

export const Focus = styled.div`
position: absolute;
z-index: ${Z_INDEX.Focus};
top: 0;
right: ${props => GRID_MARGIN + (calcWidth(props.start - 1 + NOTES_NUM) - calcWidth(NOTES_NUM)) * calcWidth(NOTES_NUM + 2) / 100 / 2}vw;
left: ${props => GRID_MARGIN + (calcWidth(props.start - 1 + NOTES_NUM) - calcWidth(NOTES_NUM)) * calcWidth(NOTES_NUM + 2) / 100 / 2}vw;
height: 100vh;

background-color: rgba(255,255,255,0.05);

transition: all 0.3s ease-out;
opacity: 0;
${props => props.show ? `
opacity: 1;
` : ``}

// outline: 1px solid white;
// background-color: rgba(255,255,255,0.1);
// display: none;
`;

export const Blur = styled.div`
position: absolute;
z-index: ${Z_INDEX.Blur};
top: 0;
height: 100vh;

backdrop-filter: blur(12px);

transition: all 0.3s ease-out;
opacity: 0;
${props => props.show ? `
opacity: 1;
` : ``}

&:first-child {
  left: 0;
  width: ${props => GRID_MARGIN + (calcWidth(props.start - 1 + NOTES_NUM) - calcWidth(NOTES_NUM)) * calcWidth(NOTES_NUM + 2) / 100 / 2}vw;
}
&:last-child {
  right: 0;
  width: ${props => GRID_MARGIN + (calcWidth(props.start - 1 + NOTES_NUM) - calcWidth(NOTES_NUM)) * calcWidth(NOTES_NUM + 2) / 100 / 2}vw;
}

// outline: 1px solid purple;
// background-color: rgba(255,0,255,0.1);
// display: none;
`;
