import styled from 'styled-components'


export const ChatDiv = styled.div`
    position: fixed;
    bottom: 0;
    right: 5%;
    width: 425px;
    height: ${props => props.theme.height};
    display: flex;
    flex-direction: column;
    background-color: #D6D6D6;
    color: black;
    z-index: 1004;
`

export const ChatNav = styled.div`
    display: flex;
    cursor: pointer;
    height: 35px;
    width: 100%;
    position: relative;
    text-align: center;
`