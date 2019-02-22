import styled from 'styled-components'

export const Button = styled.button`
    width: 85px;
    background-color: #BE8AC7;
    cursor: pointer;
    padding: 15px 15px;
    text-align: center;
    border: none;
    color: #eee;
    margin-left: ${props => props.theme.marginLeft}
`
