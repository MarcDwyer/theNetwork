import React, { useState, useEffect } from 'react'
import './catalog_styles.scss'

interface Stream {
    name: string;
    channelId: string;
    imageId: string;
    type: string;
}


const Catalog = React.memo(() => {
    const [catalog, setCatalog] = useState<Stream[] | null>(null)
    const [fail, setFail] = useState<string | null>(null)
    const getCatalog = async () => {
        try {
            const fetchCata = await fetch('/streamers/all')
            const data: Stream[] | null = await fetchCata.json()
            if (!data) throw "Catalog Fetching failed"
            setCatalog(data)
        } catch (err) {
            setFail(err)
        }
    }

    useEffect(() => {
        getCatalog()
    }, [])
    return (
        <div className="parent">
            <div className="container cata-container" style={!catalog ? { borderTop: 'none' } : {}}>
                {catalog && (
                    <div>
                        <div className="header" style={{ display: 'flex' }}>
                            <h2>Catalog</h2>
                            <div className="stream-count" style={{ margin: 'auto auto auto 10px', backgroundColor: '#BE8AC7', borderRadius: '50%', width: '30px', height: '30px', display: 'flex' }}>
                                <span style={{ margin: 'auto' }}>{catalog.length}</span>
                            </div>
                        </div>
                        <div className="cata-grid">
                            {catalog.map(({ name, imageId, channelId, type }, index) => {
                                const image: string = `https://s3.us-east-2.amazonaws.com/xhnetwork/${imageId}`

                                return (
                                    <div className="cata-card" key={index}>
                                        <h4>{name}</h4>
                                        <img src={image} alt="streamer" />
                                        <div className="social-buttons">
                                            <a target="_blank" className="fab fa-youtube" href={type === "youtube" ? `https://www.youtube.com/channel/${channelId}` : `https://twitch.tv/${name}`} />
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
})

export default Catalog