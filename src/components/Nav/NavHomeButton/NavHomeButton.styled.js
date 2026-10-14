import styled from 'styled-components';

export const Button = styled.div`
> button {
    margin: 0;
    padding: 0;
    border: 0;
    color: gray;
    background-color: transparent;
    font-size: 2rem;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: color 0.2s;
    &:hover,
    &:focus,
    &:active {
        color: white;
        background-color: rgb(8,8,8);
    }
    &:active {
        outline: 0;
    }

    // outline: 1px solid green;
}

// outline: 1px solid red;
`;