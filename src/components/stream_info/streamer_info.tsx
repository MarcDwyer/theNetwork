import React from 'react'
import ReactDOM from 'react-dom'
import { LiveStreams } from '../main/main'
import './streamer_info.scss'
interface Props {
    details: LiveStreams | null;
    setDetails: Function;
}
const Info = (props: Props) => {
    if (!props.details) return null
    const { description, title, viewers, isPlaying } = props.details
    return ReactDOM.createPortal(
        <div className="parent-modal"
            onClick={(e: any) => {
                if (e.target.classList.value !== 'parent-modal') return
                props.setDetails(null)
            }}
        >
            <div className="child-modal">
                <div className="content">
                    <h3>{title}</h3>
                    {isPlaying && (
                        <h5>is playing {isPlaying}</h5>
                    )}
                    <span><small>{viewers} viewers</small></span>
                    <p>
                        {description && description.length > 0 ? description : "No description was given"}
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