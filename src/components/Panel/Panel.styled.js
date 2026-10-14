import styled from 'styled-components';
import { Z_INDEX } from '../../config/frets.config';

export const Panel = styled.div`
position: fixed;
z-index: ${Z_INDEX.Panel};
top: 0;
right: 25%;
bottom: 0;
left: 0;

background-color: rgba(16,16,16);
transition: transform 0.3s;

${props => props.show ? `
transform: translateX(0);
` : `
transform: translateX(-100%);
`}
`;
