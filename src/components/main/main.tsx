import React, { useState, useEffect, useRef } from 'react'
import VideoPlayer from '../videoplayer/video'
import Featured from '../featured/featured'
import Notifications from '../notifications/notif'
import { PacmanLoader } from 'react-spinners';
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
    const [fail, setFail] = useState<string | null>(null)
    const [selected, setSelected] = useState<string | null>(null)

    const fetchStreams = async () => {
        try {
            const fetcher = await fetch('/streamers/live')
            const data = await fetcher.json()
            if (!data) throw "No streamers online"
            const newData: LSObj = data.reduce((obj: LSObj, item: LiveStreams) => {
                obj[item.channelId] = item
                return obj
            }, {})
            setLive(newData)
        } catch (err) {
            setFail(err)
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
                        <h2>Looking for streams...</h2>
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
                        <h2>Active Streams</h2>
                        <div className="active-cards">
                            {Object.values(live).map(({ title, thumbnails, description, channelId, viewers, imageId, videoId }, index: number) => {
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
        </div>
    )
}

export default Main