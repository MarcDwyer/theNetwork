import React from 'react'
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
    const { live, selected, setSelect } = props
    const one: LiveStreams = (Object as any).values(live)[0]
    const vidUrl: string = one.type =="youtube" ? `https://www.youtube.com/embed/${one.videoId}?autoplay=1&amp;controls=0&amp;showinfo=0&amp;modestbranding=1&amp;autohide=1&amp&mute=1&rel=0` : `https://player.twitch.tv/?channel=${one.name}`;

    
    return (
        <div className="parent parent-featured">
        <h1 style={{margin: "0px"}}>Featured</h1>
            <div className="container container-featured">
                <div className="featured-div">
                    <iframe src={selected ? "" : vidUrl} frameBorder="0" />
                    <div className="intro">
                        <div className="flexer">
                            <h2>{one.displayName || one.name}</h2>
                            <span>{one.title}</span>
                            <span><i style={{ color: 'red' }} className="fas fa-dot-circle" /> {one.viewers} viewers</span>
                        </div>
                        <Button
                            onClick={() => setSelect(one.channelId)}
                        >Watch</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Featured