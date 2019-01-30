import React, { Component } from 'react'
import Navbar from '../nav/navbar'
import VideoPlayer from '../videoplayer/video'
import Featured from '../featured/featured'
import './main_styles.scss'

interface State {
    live: null | LSObj;
    error: string | null;
    expand: string;
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
        expand: "",
        selected: null
    }
     componentDidMount() {
        this.getStreams()

        setInterval(this.getStreams, 45000)
    }
    render() {
        const { live, selected, expand } = this.state
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
                <Featured live={live} selected={selected} />
            <div className="parent">
            <div className="container">
                <div className="active-cards">
                {this.renderStreams()}
                </div>
            </div>
            </div>
        </div>
        <VideoPlayer selected={selected} live={live} removeStream={this.removeStream} />
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
        const { live, expand } = this.state
        return (Object as any).values(live).map(({ title, thumbnails, description, channelId }: LiveStreams, index: number) => {
            const newthumb: string = thumbnails.maxres.url.length > 0 ? thumbnails.maxres.url : thumbnails.high.url
            return (
                <div className="card" key={index} style={expand === channelId ? {height: "calc(100%)"} : {}}>
                    <div className="image">
                        <img src={newthumb} alt="thumbnail"/>
                    </div>
                    <div className="details">
                        <h3>{title}</h3>
                        <p className="description" style={expand === channelId ? {height: "100%", overflow: "hidden"} : {height: "100px", overflow: "hidden"}}>
                        {description}
                        </p>
                        <div className="buttons">
                        <button
                        className="thebutton"
                        onClick={() => this.setState({selected: channelId})}
                        >Watch</button>
                        <span style={{margin: "10px 10px 10px auto"}}
                        onClick={(e) => {
                            if (expand !== channelId) {
                                this.setState({expand: channelId})
                            } else {
                                this.setState({expand: ""})
                            }
                        }}
                        >{expand === channelId ? "Show Less" : "Show More"}</span>
                        </div>
                    </div>
                </div>
            )
        })
    }
    removeStream = () => {
        console.log('baller')
        this.setState({selected: null})
    }
}