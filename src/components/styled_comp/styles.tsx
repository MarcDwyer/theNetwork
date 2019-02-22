import styled from 'styled-components'

export const Button = styled.button`
    width: 85px;
    background-color: transparent;
    border: solid 1px #BE8AC7;
    cursor: pointer;
    padding: 15px 15px;
    text-align: center;
    color: #BE8AC7;
    margin-left: ${props => props.theme.marginLeft};
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
    
`