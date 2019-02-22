import React from 'react'
import './video_styles.scss'
import { LSObj, LiveStreams } from '../main/main'
import { Exit } from '../styled_comp/styles'

interface Props {
    selected: string | null;
    live: LSObj | null;
    setSelected: Function;
}

const VideoPlayer = (props: Props) => {
    return (
        <div className={`parent-video ${props.selected ? "video-trigger" : ""}`}>
            {props.selected && props.live && (() => {
                const { live, selected } = props
                const stream: LiveStreams = live[selected]
                if (!stream) props.setSelected(null)
                const vidUrl: string = `https://www.youtube.com/embed/${stream.videoId}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp`;
                const chatUrl: string = `https://www.youtube.com/live_chat?v=${stream.videoId}&embed_domain=${window.location.hostname}`;
                return (
                    <div>
                        <div className="video">
                            <Exit
                                onClick={() => props.setSelected(null)}
                            >Exit</Exit>
                            <div className="video-settings">
                                <span>{stream.title}</span>
                                <span>{stream.viewers + " viewers"}</span>
                            </div>
                            <iframe src={vidUrl} frameBorder="0" />
                        </div>
                        <div className="chat">
                            <iframe src={chatUrl} frameBorder="0" />
                        </div>
                    </div>
                )
            })()}
        </div>
    )
}

export default VideoPlayer
