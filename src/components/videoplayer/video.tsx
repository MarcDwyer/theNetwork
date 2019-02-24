import React, { useState, useRef, useEffect } from 'react'
import './video_styles.scss'
import { LSObj, LiveStreams } from '../main/main'
import { Exit, Button } from '../styled_comp/styles'

interface Props {
    selected: string | null;
    live: LSObj | null;
    setSelected: Function;
}

const VideoPlayer = (props: Props) => {
    const [minimize, setMinimize] = useState<boolean>(false)

    const oldProps = useRef(props.selected)

    useEffect(() => {   
        if (oldProps.current && props.selected) {
            if (oldProps.current !== props.selected) {
                setMinimize(false)
            }
        } else if (!props.selected && minimize) {
            setMinimize(false)
        }
        oldProps.current = props.selected
    }, [props.selected])

    const theme = {
        borderColor: "#7FBF7F",
        color: "#7FBF7F",
        zIndex: '4000'
    }
    return (
        <div className={`parent-video ${props.selected ? "video-trigger" : ""}`}
        style={minimize ? {bottom: "calc(95px - 100vh)"} : {}}
        >
            {props.selected && props.live && (() => {
                const { live, selected } = props
                const stream: LiveStreams = live[selected]
                if (!stream) {
                    props.setSelected(null)
                    return null
                }
                const vidUrl: string = `https://www.youtube.com/embed/${stream.videoId}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp`;
                const chatUrl: string = `https://www.youtube.com/live_chat?v=${stream.videoId}&embed_domain=${window.location.hostname}`;
                return (
                    <div>
                        <div className="video">
                            <Button
                                theme={theme}
                                style={{ position: "absolute", top: "5px", right: "5px"}}
                                onClick={() => {
                                    setMinimize(!minimize)
                                }}
                            >
                                {!minimize ? "Minimize" : "Maximize"}
                        </Button>
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
