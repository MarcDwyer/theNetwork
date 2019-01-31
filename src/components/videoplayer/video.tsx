import React, { Component } from 'react'
import './video_styles.scss'
import { LSObj, LiveStreams } from '../main/main'

interface Props {
    selected: string | null;
    live: LSObj | null;
    removeStream: Function;
}
export default class VideoPlayer extends Component <Props, {}> {
    private getOut: any
    constructor(props: any) {
        super(props)
        this.getOut = document.addEventListener(('keydown'), (e) => {
            this.props.removeStream()
        })
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.getOut);
    }
    render() {
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
                <button className="video-button"
                onClick={() => removeStream()}
                >Exit</button>
                <span>{stream.viewers + " viewers"}</span>
                <iframe src={vidUrl} frameBorder="0" />
                </div>
                <div className="chat">
                    <iframe src={chatUrl} frameBorder="0" />
                </div>
            </div>
        )
    }
}