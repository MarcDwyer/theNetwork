import React, { useState, useRef, useEffect } from 'react'
import './video_styles.scss'
import { LSObj, LiveStreams } from '../main/main'
import { Exit, Button } from '../styled_comp/styles'

interface Props {
    selected: string | null;
    live: LSObj | null;
    setSelected: Function;
}
// https://player.twitch.tv/
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
    useEffect(() => {
        if (props.selected && !minimize) {
            document.body.style.overflow = "hidden"
        } else if (minimize && props.selected || !props.selected) {
            document.body.style.overflow = "auto"
        }
    }, [minimize, props.selected])

    const theme = {
        borderColor: "#7FBF7F",
        color: "#7FBF7F",
        zIndex: '4000',
        padding: '10px 10px'
    }
    return (
        <div className={`parent-video ${props.selected ? "video-trigger" : ""}`}
            style={minimize ? { bottom: "calc(95px - 100vh)" } : {}}
        >
            {props.selected && props.live && (() => {
                const { live, selected } = props
                const stream: LiveStreams = live[selected]
                if (!stream) {
                    props.setSelected(null)
                    return null
                }
                console.log(stream.type)
                const vidUrl: string = stream.type === "youtube" ? `https://www.youtube.com/embed/${stream.videoId}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp` : `https://player.twitch.tv/?channel=${stream.name}&muted=false`;
                const chatUrl: string = stream.type === "youtube" ? `https://www.youtube.com/live_chat?v=${stream.videoId}&embed_domain=${window.location.hostname}` : `https://www.twitch.tv/embed/${stream.name}/chat?darkpopout`;
                return (
                    <div>
                        <div className="video">
                            <Button
                                theme={theme}
                                style={{ position: "absolute", top: "5px", right: "5px" }}
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
                            <iframe src={vidUrl} frameBorder="0" allowFullScreen={true} />
                        </div>
                        <div className="chat">
                            <iframe src={chatUrl} frameBorder="0" />
                        </div>
                        {stream.likes && (
                            <div className="the-likes">
                                <span><i style={{ color: 'green' }} className="fas fa-thumbs-up" />{stream.likes}</span>
                                <span> <i style={{ color: 'red' }} className="fas fa-thumbs-down" /> {stream.dislikes}</span>
                            </div>
                        )}
                    </div>
                )
            })()}
        </div>
    )
}

export default VideoPlayer
