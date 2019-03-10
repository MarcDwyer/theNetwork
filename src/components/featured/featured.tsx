import React, { useState, useEffect } from 'react'
import { Button } from '../styled_comp/styles'
import { LSObj, LiveStreams } from '../main/main'
import './featured_styles.scss'

interface Props {
    live: LSObj;
    selected: string | null;
    setSelect: Function;
}
const Featured = (props: Props) => {
    if (!props.live || window.innerWidth <= 1000) return null

    const [autoplay, setAutoplay] = useState<boolean>(false)

    useEffect(() => {
        // @ts-ignore
        const isAuto = JSON.parse(localStorage.getItem('autoplay'))
        if (isAuto) setAutoplay(true)
    }, [])

    const { live, selected, setSelect } = props
    const one: LiveStreams = (Object as any).values(live)[0]
    const vidUrl: string = one.type == "youtube" ? `https://www.youtube.com/embed/${one.videoId}?autoplay=${!autoplay ? "1" : "0"}&amp;controls=1&amp;showinfo=0&amp;modestbranding=1&amp;autohide=1&amp&mute=1&rel=0` : `https://player.twitch.tv/?channel=${one.name}&autoplay=${!autoplay}`;
    return (
        <div className="parent parent-featured">
            <div className="container container-featured">
                <h2 style={{ margin: "0px" }}>Featured Streamer</h2>
                <div className="featured-div">
                    {!selected && (
                        <iframe src={selected ? "" : vidUrl} frameBorder="0" />
                    )}
                    {selected && (
                        <img src={one.thumbnails.high || one.thumbnails.low} alt="thumbnail"/>
                    )}
                    <div className="intro">
                        <div className="flexer">
                            <h2>{one.displayName || one.name}</h2>
                            <span>{one.title}</span>
                            <span><i style={{ color: 'red' }} className="fas fa-dot-circle" /> {one.viewers} viewers</span>
                        </div>
                        {!autoplay && (
                            <button
                                className="disableAuto"
                                onClick={(e) => {
                                    localStorage.setItem("autoplay", JSON.stringify(true))
                                    setAutoplay(true)
                                }}
                            >
                                Disable Autoplay
                            </button>
                        )}
                        <Button
                            onClick={() => {
                                setSelect(one.channelId)
                            }}
                        >Watch</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Featured