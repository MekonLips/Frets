import styled from 'styled-components';
import { Z_INDEX } from '../../config/frets.config';

export const Overlay = styled.div`
position: fixed;
z-index: ${Z_INDEX.Overlay};
top: 0;
right: 0;
bottom: 0;
left: 0;

backdrop-filter: blur(12px);
transition: opacity 0.3s;

cursor: pointer;

opacity: 0;
pointer-events: none;

${props => props.visible ? `
opacity: 1;
pointer-events: auto;
` : ``}
`;
