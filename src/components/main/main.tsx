import React, { useState, useEffect } from 'react'
import VideoPlayer from '../videoplayer/video'
import Featured from '../featured/featured'
import Footer from '../footer/footer'
import Notifications from '../notifications/notif'
import Catalog from '../catalog/catalog'
import { PacmanLoader } from 'react-spinners';
import './main_styles.scss'

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
    [key: string]: LiveStreams;
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

const Main = () => {
    const [live, setLive] = useState<LSObj | null>(null)
    const [selected, setSelected] = useState<string | null>(null)

    const fetchStreams = async () => {
        try {
            const fetcher = await fetch('/streamers/live')
            const data = await fetcher.json()
            if (!data || data.length === 0) throw "No streamers online... I'm searching!"
            console.log(data)
            const newData: LSObj = data.reduce((obj: LSObj, item: LiveStreams) => {
                obj[item.channelId] = item
                return obj
            }, {})
            setLive(newData)
        } catch (er) {
            console.log(er)
            if (live) setLive(null)
        }
    }
    useEffect(() => {
        fetchStreams()
        setInterval(fetchStreams, 25000)
    }, [])
    
    return (
        <div className="parent main-parent">
            <div className="container main-container">
                {!live && (
                    <div className="offlineCard">
                        <h2 style={{marginLeft: '-15px'}}>No Streamers online... I'm searching!</h2>
                        <PacmanLoader
                            sizeUnit={"px"}
                            size={25}
                            color={'#123abc'}

                        />
                    </div>
                )}
                {live && (
                    <div>
                        <Featured live={live} selected={selected} setSelect={setSelected} />
                        <div className="header" style={{display: 'flex'}}>
                        <h2>Active Streams </h2>
                        <div className="stream-count" style={{margin: 'auto auto auto 10px', backgroundColor: '#BE8AC7', borderRadius: '50%', width: '30px', height: '30px', display: 'flex'}}>
                                <span style={{margin: 'auto'}}>{Object.values(live).length}</span>
                            </div>
                        </div>
                        <div className="active-cards">
                            {Object.values(live).map(({ title, thumbnails, description, channelId, viewers, imageId, videoId, name }, index: number) => {
                                const newthumb: string = thumbnails.maxres.url.length > 0 ? thumbnails.maxres.url : thumbnails.high.url
                                const newTitle = title.slice(0, 44)
                                const image: string = `https://s3.us-east-2.amazonaws.com/xhnetwork/${imageId}.jpg`
                                return (
                                    <div className="card" key={index}>
                                        <div className="image">
                                            <img src={newthumb} alt="thumbnail" />
                                        </div>
                                        <div className="details">
                                            <div className="content">
                                                <img src={image} alt="streamer" />
                                                <h3>{newTitle}</h3>
                                                <small style={{margin: '-15px auto 0 auto'}}>{name}</small>
                                                <span><i style={{ color: "red" }} className="fas fa-dot-circle" /> {viewers + " viewers"}</span>
                                                <p className="description">
                                                    {description}
                                                </p>
                                            </div>
                                            <div className="buttons">
                                                <button
                                                    className="thebutton"
                                                    onClick={() => {
                                                        if (window.innerWidth <= 900) {
                                                            const youtubeLink: string = `https://www.youtube.com/watch?v=${videoId}`;
                                                            const win: any = window.open(youtubeLink, '_blank');
                                                            win.focus();
                                                            return;
                                                        }
                                                        setSelected(channelId)
                                                    }}
                                                >Watch</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
            <VideoPlayer selected={selected} live={live} setSelected={setSelected} />
            <Notifications live={live} setSelected={setSelected} />
            <Catalog />
            <Footer />
        </div>
    )
}

export default Main