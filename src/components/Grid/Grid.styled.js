import styled from 'styled-components';
import { gridHeight } from '../../utils/grid.utils';
import { Z_INDEX } from '../../config/frets.config';

export const Grid = styled.div`
width: 100%;
height: 100%;

background: transparent;
background: linear-gradient(180deg, 
    rgba(0,0,0,0.6) 0%, 
    rgb(0,0,0,0) 20%, 
    rgb(0,0,0,0) 80%, 
    rgb(0,0,0,0.6) 100%);


display: grid;

grid-template-columns: 1fr 2fr 1fr;
grid-template-rows: repeat(3, 1fr);

> div {
    padding: 1rem;
    display: flex;
    &:nth-child(1) {
        z-index: ${Z_INDEX.Grid};
        flex-direction: column;
        button {
            width: 3.4rem;
            height: 3.4rem;
            border-radius: 50%;
        }
    }
    &:nth-child(2) {
        z-index: ${Z_INDEX.Grid};
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        > label {
            width: 100%;
            margin: 0 0 0.5rem 0;

            display: flex;
            justify-content: center;
            align-items: center;

            // outline: 1px solid red;
        }
        > div {
            &:first-child {
                flex-grow: 1;
            }
            &:last-child {
                white-space: nowrap
            }

            // outline: 1px solid red;
        }

        // outline: 1px solid red;
    }
    &:nth-child(3) {
        z-index: ${Z_INDEX.Grid};
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        > p,
        > label {
            width: 100%;
            margin: 0 0 0.5rem 0;

            display: flex;
            justify-content: flex-end;
            align-items: center;

            // outline: 1px solid red;
        }
    }
    &:nth-child(4) {
        height: calc(${props => `${gridHeight(props.strings)} + ${gridHeight(1)} * 2`});
        
        padding: 0;

        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 2;
        grid-row-end: 3;

        justify-content: center;
        align-items: center;
    }
    &:nth-child(5) {
        z-index: ${Z_INDEX.Grid};
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-end;
    }
    &:nth-child(6) {
        z-index: ${Z_INDEX.Grid};
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }
    &:nth-child(7) {
        z-index: ${Z_INDEX.Grid};
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
    }
    
    // outline: 1px solid green;
}

// outline: 1px solid red;
`;
