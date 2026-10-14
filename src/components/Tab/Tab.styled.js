import styled from 'styled-components';
import { Z_INDEX } from '../../config/frets.config';

export const Container = styled.div`
z-index: ${Z_INDEX.Tab};
width: 100%;
height: 100%;

// outline: 1px solid red;
`;

export const Content = styled.div`
display: flex;
justify-content: center;
align-items: center;

// outline: 1px solid red;
`;

export const Tab = styled.div`
display: flex;
align-items: flex-end;

pre {
    margin: 0;
    padding: 0;
}

// outline: 1px solid red;
`;

export const Header = styled.div``;

export const Break = styled.div``;

export const Strings = styled.div``;