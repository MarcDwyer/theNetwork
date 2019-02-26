import styled from 'styled-components'

export const Button = styled.button`
    width: 85px;
    background-color: transparent;
    border: solid 1px ${props => props.theme.borderColor ? props.theme.borderColor : "#BE8AC7"};
    cursor: pointer;
    padding: ${props => props.theme.padding ? props.theme.padding : '15px 15px'};
    text-align: center;
    color: ${props => props.theme.color ? props.theme.color : "#BE8AC7"};
    margin-left: ${props => props.theme.marginLeft};
    z-index: ${props => props.theme.zIndex};

    &:hover {
        border: solid 1px #E3CDE7;
        color: #E3CDE7;
    }
    &:focus {
        outline: 0;
    }
`

export const Exit = styled.button`
    position: absolute;
    top: 5px;
    left: 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    border: 1px solid #FF6666;
    margin: 0 auto 15px 15px;
    padding: 10px 10px;
    cursor: pointer;
    background-color: transparent;
    color: #FF6666;
    width: 85px;
    z-index: 1003;
    
    &:hover {
        border: solid 1px #FFB2B2;
        color: #FFB2B2;
    }
    &:focus {
        outline: 0;
    }
`