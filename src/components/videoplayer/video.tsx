import React, { Component } from 'react'
import './video_styles.scss'
import { LSObj, LiveStreams } from '../main/main'

interface Props {
    selected: string | null;
    live: LSObj | null;
    removeStream: Function;
}

export default class VideoPlayer extends Component <Props, {}> {
    render() {
        console.log(this.props)
        const { removeStream, live, selected } = this.props
        if (!selected || !live) {
            return (
                <div className="parent-video" style={{bottom: "calc(-75px - 100vh)"}}>
                <div className="video">
                </div>
                <div className="chat">  
                </div>
            </div>
            )
        }
        const stream: LiveStreams = live[selected]
       const vidUrl: string = `https://www.youtube.com/embed/${stream.videoId}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp`;
       const chatUrl: string = `https://www.youtube.com/live_chat?v=${stream.videoId}&embed_domain=${window.location.hostname}`;
        return (
            <div className="parent-video" style={{width: "100%", height: "100%", bottom: '0'}}>
                <div className="video">
                <button className="thebutton"
                onClick={() => removeStream()}
                >Exit</button>
                <iframe src={vidUrl} frameBorder="0" />
                </div>
                <div className="chat">
                    <iframe src={chatUrl} frameBorder="0" />
                </div>
            </div>
        )
    }
}