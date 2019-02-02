import React, { Component } from 'react'
import Navbar from '../nav/navbar'
import VideoPlayer from '../videoplayer/video'
import Featured from '../featured/featured'
import Catalog from '../catalog/catalog'
import Notifications from '../notifications/notif'
import './main_styles.scss'

interface State {
    live: null | LSObj;
    error: string | null;
    selected: string | null;
}

export interface LiveStreams {
    title: string;
    name: string;
    channelId: string;
    description: string;
    imageId: string;
    likes: string;
    dislikes: string;
    viewers: number;
    videoId: string;
    thumbnails: Thumbnail;
}
export interface LSObj {
    [key:string]: LiveStreams;
}

export interface Thumbnail {
    default: ThumbnailDescr;
    high: ThumbnailDescr;
    maxres: ThumbnailDescr;
    medium: ThumbnailDescr;
    standard: ThumbnailDescr;
}
export interface ThumbnailDescr {
    height: number;
    url: string;
    width: number;
}

export default class Main extends Component <any, State> {

    state: State = {
        live: null,
        error: null,
        selected: null
    }
     componentDidMount() {
        this.getStreams()

        setInterval(this.getStreams, 25000)
    }
    render() {
        const { live, selected } = this.state
        if (!live) {
            return (
                <div className="parent">
                    <div className="container">
                        <div className="offlineCard">
                            <h4>No streamers online...</h4>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <Navbar />
                <div className="topdiv">
                <Featured live={live} selected={selected} setSelect={this.setSelect} />
            <div className="parent">
            <div className="container main-cont">
                <h2>Active Streams</h2>
                <div className="active-cards">
                {this.renderStreams()}
                </div>
            </div>
            </div>
        </div>
        <Catalog />
        <VideoPlayer selected={selected} live={live} removeStream={this.removeStream} />
        <Notifications live={live} select={this.setSelect} />
        </div>
        )
    }
    getStreams = async () => {
        try {
            const fetchLive: any = await fetch('/streamers/live')
            const data: LiveStreams[] = await fetchLive.json()
            if (!data) throw "No streamers live!"
            const streamerObj: LSObj = data.reduce((obj: any, item: LiveStreams) => {
                obj[item.channelId] = item
                return obj
            },{})
            this.setState({live: streamerObj})
        } catch(err) {
            console.log(err)
            this.setState({error: err})
        }
    }
    renderStreams(): any {
        const { live } = this.state
        return (Object as any).values(live).map(({ title, thumbnails, description, channelId, viewers, imageId }: LiveStreams, index: number) => {
            const newthumb: string = thumbnails.maxres.url.length > 0 ? thumbnails.maxres.url : thumbnails.high.url
            const newTitle = title.slice(0, 44)
            const image: string = `https://s3.us-east-2.amazonaws.com/xhnetwork/${imageId}.jpg`
            return (
                <div className="card" key={index}>
                    <div className="image">
                        <img src={newthumb} alt="thumbnail"/>
                    </div>
                    <div className="details">
                    <div className="content">
                    <img src={image} alt="streamer"/>
                        <h3>{newTitle}</h3>
                        <span><i style={{color: "red"}} className="fas fa-dot-circle" /> {viewers + " viewers"}</span>
                        <p className="description">
                        {description}
                        </p>
                        </div>
                        <div className="buttons">
                        <button
                        className="thebutton"
                        onClick={() => this.setState({selected: channelId})}
                        >Watch</button>
                        </div>
                    </div>
                </div>
            )
        })
    }
    removeStream = () => {
        this.setState({selected: null})
    }
    setSelect = (id: string) => {
        this.setState({selected: id})
    }
}