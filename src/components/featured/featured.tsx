import React from 'react'
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
const vidUrl: string = `https://www.youtube.com/embed/${one.videoId}?autoplay=1&amp;controls=0&amp;showinfo=0&amp;modestbranding=1&amp;autohide=1&amp&mute=1&rel=0`;
return (
    <div className="parent parent-featured">
        <div className="container">
        <div className="featured-div">
        <iframe src={selected ? "" : vidUrl} frameBorder="0" />
        <div className="intro">
        <div className="flexer">
        <h2>{one.name}</h2>
        <span><i style={{color: 'red'}} className="fas fa-dot-circle" /> {one.viewers} viewers</span>
        </div>
        <button className="thebutton"
        onClick={() => setSelect(one.channelId)}
        >Watch</button>
        </div>
        </div>
        </div>
    </div>
)
}

export default Featured