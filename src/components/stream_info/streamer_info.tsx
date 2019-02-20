import React from 'react'
import ReactDOM from 'react-dom'
import { Details } from '../main/main'
import './streamer_info.scss'
interface Props {
    details: Details | null;
    setDetails: Function;
}
const Info = (props: Props) => {
    if (!props.details) return null
    console.log(props)
     return ReactDOM.createPortal(
        <div className="parent-modal"
        onClick={(e) => {
            //@ts-ignore
            if (e.target.classList.value !== 'parent-modal') return
            props.setDetails(null)
        }}
        >
            <div className="child-modal">
                {props.details.description}
            </div>
        </div>,
        // @ts-ignoreq
        document.getElementById('modal')
    )
     }

export default Info