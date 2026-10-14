import styled from 'styled-components';

export const Content = styled.div`
height: 100%;
display: flex;
h1 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
}
p {
    margin: 0.4rem 0;
    font-size: 0.9rem;
}
ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
}
li {
    width: 50%;
}
a {
    height: 100%;
    padding: 5vh;
    color: white;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    transition: background-color 0.2s;
    &:hover,
    &:focus,
    &:active {
        background-color: rgb(32,32,32);
    }
}
`;