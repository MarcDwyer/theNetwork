import React, { Component } from 'react'
import VideoPlayer from '../videoplayer/video'
import Featured from '../featured/featured'
import Footer from '../footer/footer'
import Notifications from '../notifications/notif'
import Catalog from '../catalog/catalog'
import Info from '../stream_info/streamer_info'
import Card from '../card/card'
import { PacmanLoader } from 'react-spinners';
import './main_styles.scss'

export interface LiveStreams {
    title: string;
    name: string;
    channelId: string;
    description: string;
    imageId: string;
    likes: string | null;
    dislikes: string | null;
    viewers: number;
    videoId: string | null;
    thumbnails: Thumbnail;
    displayName: string | null;
    isPlaying: string | null;
    Mature: boolean | null;
    type: string;
}
export interface LSObj {
    [key: string]: LiveStreams;
}

interface Thumbnail {
    high: string;
    low: string;
}
interface State {
    ws: WebSocket;
    live: LSObj | null;
    catalog: Stream[] | null;
    details: LiveStreams | null;
    selected: string;
}
export interface Stream {
    name: string;
    channelId: string;
    imageId: string;
    type: string;
}
class Main extends Component<{}, State> {
    state = {
        ws: new WebSocket(`wss://${document.location.host}/sockets/`),
        selected: null,
        catalog: null,
        details: null,
        live: null
    }
    componentDidMount() {
        const { ws } = this.state

        ws.addEventListener('message', (msg) => {
            const payload = JSON.parse(msg.data)
            console.log(payload)
            if (payload.length === 0) return
            console.log("server sent data")
            if (payload[0].videoId) {
                const newobj = payload.reduce((obj, item: LiveStreams) => {
                    obj[item.channelId] = item
                    return obj
                }, {})
                this.setState({live: newobj})
            } else {
                this.setState({catalog: payload})
            }

        })
    }
    setSelected = (str: string) => {
        this.setState({selected: str})
    }
    setDetails = (stream: LiveStreams) => {
        this.setState({details: stream})
    }
    render() {
        const { live, ws, selected } = this.state
        return (
            <div className="parent main-parent">
                <div className="container main-container">
                    {!live && (
                        <div className="offlineCard">
                            <h2>No Streamers online... I'm searching!</h2>
                            <div className="loader">
                                <PacmanLoader
                                    sizeUnit={"px"}
                                    size={25}
                                    color={'#123abc'}

                                />
                            </div>
                        </div>
                    )}
                    {live && (
                        <div>
                            <Featured live={live} selected={selected} setSelect={this.setSelected} />
                            <div className="header" style={{ display: 'flex' }}>
                                <h2>Active Streams </h2>
                                <div className="stream-count" style={{ margin: 'auto auto auto 10px', backgroundColor: '#BE8AC7', borderRadius: '50%', width: '30px', height: '30px', display: 'flex' }}>
                                    <span style={{ margin: 'auto' }}>{Object.values(live).length}</span>
                                </div>
                            </div>
                            <div className="active-cards">
                                {Object.values(live).map((item: LiveStreams) => {
                                    return (
                                        <Card
                                        key={item.videoId} 
                                        streamerData={item}
                                        setDetails={this.setDetails}
                                        setSelected={this.setSelected}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
                <Catalog catalog={this.state.catalog} />
                <VideoPlayer selected={selected} live={live} setSelected={this.setSelected} />
                <Notifications live={live} setSelected={this.setSelected} />
                <Info 
                details={this.state.details}
                setDetails={this.setDetails}
                />
                <Footer />
            </div>
        )
    }
}

export default Main