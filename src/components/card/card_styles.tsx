import styled from 'styled-components'


export const Visit = styled.a`
    position: absolute;
    top: 5px;
    left: 5px;
    width: 85px;
    background-color: ${props => !props.theme.isYoutube ? "#4B367C" : "rgba(255,76,76, .85)"};
    border: none;
    cursor: pointer;
    padding: 5px 5px;
    text-align: center;
    text-decoration: none;

    &:focus {
        outline: 0;
    }
`

export const VisitSpan = styled.span`
    color: rgba(238,238,238, 1) !important;
`