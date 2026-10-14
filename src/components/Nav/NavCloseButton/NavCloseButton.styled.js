import styled from 'styled-components';

export const Button = styled.span`
> button {
    position: absolute;
    top: 0;
    right: calc(-3rem + 1px);
    width: 3rem;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;

    color: gray;
    background-color: rgb(0,0,0);
    box-shadow: -3px 0 6px 0 rgba(0,0,0,0.4),
                 6px 0 12px 0 rgba(0,0,0,0.4);
    font-size: 1.2rem;
    cursor: pointer;

    transition: background-color 0.2s;
    &:hover,
    &:focus,
    &:active {
        color: white;
        background-color: rgb(8,8,8);
    }
    &:active {
        outline: 0;
    }

    display: none;
    ${props => props.show ? `
    display: block;
    ` : ``}
}
`;