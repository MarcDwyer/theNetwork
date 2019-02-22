import React, { useState, useEffect } from 'react'
import VideoPlayer from '../videoplayer/video'
import Featured from '../featured/featured'
import Footer from '../footer/footer'
import Notifications from '../notifications/notif'
import Catalog from '../catalog/catalog'
import Info from '../stream_info/streamer_info'
import Card from '../card/card'
import uuid from 'uuid'
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

interface Thumbnail {
    default: ThumbnailDescr;
    high: ThumbnailDescr;
    maxres: ThumbnailDescr;
    medium: ThumbnailDescr;
    standard: ThumbnailDescr;
}
interface ThumbnailDescr {
    height: number;
    url: string;
    width: number;
}
export interface Details {
    title: string;
    name: string;
    description: string;
    viewers: number;
}
const Main = () => {
    const [live, setLive] = useState<LSObj | null>(null)
    const [details, setDetails] = useState<Details | null>(null)
    const [selected, setSelected] = useState<string | null>(null)

    const fetchStreams = async () => {
        try {
            const fetcher = await fetch('/streamers/live')
            const data: LiveStreams[] = await fetcher.json()
            if (!data || data.length === 0) throw "No streamers online... I'm searching!"
            const newdata = data.reduce((obj: LSObj, item) => {
                obj[item.channelId] = item
                return obj
            }, {})
            setLive(newdata)
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
                        <Featured live={live} selected={selected} setSelect={setSelected} />
                        <div className="header" style={{ display: 'flex' }}>
                            <h2>Active Streams </h2>
                            <div className="stream-count" style={{ margin: 'auto auto auto 10px', backgroundColor: '#BE8AC7', borderRadius: '50%', width: '30px', height: '30px', display: 'flex' }}>
                                <span style={{ margin: 'auto' }}>{Object.values(live).length}</span>
                            </div>
                        </div>
                        <div className="active-cards">
                            {Object.values(live).map((item) => {
                                return (
                                    <Card
                                        key={uuid()}
                                        data={item}
                                        setDetails={setDetails}
                                        setSelected={setSelected}
                                    />
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
            <VideoPlayer selected={selected} live={live} setSelected={setSelected} />
            <Info details={details} setDetails={setDetails} />
            <Notifications live={live} setSelected={setSelected} />
            <Catalog />
            <Footer />
        </div>
    )
}

export default Main