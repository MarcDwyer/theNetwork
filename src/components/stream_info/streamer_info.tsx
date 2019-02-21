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
    const { description, title, viewers } = props.details
    return ReactDOM.createPortal(
        <div className="parent-modal"
            onClick={(e: any) => {
                if (e.target.classList.value !== 'parent-modal') return
                props.setDetails(null)
            }}
        >
            <div className="child-modal">
                <div className="content">
                    <h4>{title}</h4>
                    <span><small>{viewers} viewers</small></span>
                    <p>
                        {description.length > 0 ? description : "No description was given"}
                    </p>
                    <div className="close-div"
                        onClick={() => props.setDetails(null)}
                    >
                        <span
                            className="close"
                        >
                            Ok
                </span>

                    </div>
                </div>
            </div>
        </div>,
        // @ts-ignoreq
        document.getElementById('modal')
    )
}

export default Info