import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button as FormButton } from '../../styles/form.styles';

export const Container = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
align-items: center;

// outline: 1px solid teal;
`;

export const Sequence = styled.h1`
width: 100%;
display: flex;
justify-content: space-between;
align-items: center;

// outline: 1px solid teal;
`;

export const Note = styled(Link).withConfig({
    shouldForwardProp: prop => prop !== 'current',
})`
padding: 0 1rem;

display: flex;
justify-content: center;
align-items: center;

color: white;
text-decoration: none;

transition: color 0.3s;

&:before {
    content: "";
    position: absolute;
    z-index: -1;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: rgba(255,255,255,0.1);
    transition: background-color 0.3s;
    display: none;
}

&:hover,
&:focus,
&:active {
    &:before {
        display: block;
    }
}

${props => props.current ? `
position: relative;
color: white;
&:before {
    background-color: orange;
    display: block;
    cursor: default;
}
` : ``}

// outline: 1px solid teal;
`;

export const Button = styled(FormButton)`
width: 4rem;
height: 3rem;
margin: 0;
padding: 0;
border: 0;
border-radius: 50%;
display: flex;
justify-content: center;
align-items: center;

font-size: 2rem;

${props => props.disabled ? `
color: rgba(255,255,255,0.1);
background-color: transparent;
` : ``}

&:hover,
&:focus,
&:active {
    background-color: rgba(255,255,255,0.1);
    ${props => props.disabled ? `
    background-color: transparent;
    cursor: default;
    ` : ``}
}

&:first-child {
    margin-right: 2vw;
    > svg {
        transform: translateX(-0.2rem);
    }
}
&:last-child {
    margin-left: 2vw;
    > svg {
        transform: translateX(0.2rem);
    }
}

// outline: 1px solid teal;
`;