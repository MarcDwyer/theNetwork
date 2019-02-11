import React, { useState, useEffect } from 'react'
import './catalog_styles.scss'

interface Stream {
    name: string;
    channelId: string;
    imageId: string;
}


const Catalog = () => {
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
            <div className="container cata-container">
                {catalog && (
                    <div>
                        <h2>Catalog</h2>
                        <div className="cata-grid">
                            {catalog.map(({ name, imageId, channelId }, index) => {
                                const image: string = `https://s3.us-east-2.amazonaws.com/xhnetwork/${imageId}.jpg`

                                return (
                                    <div className="cata-card" key={index}>
                                        <h4>{name}</h4>
                                        <img src={image} alt="streamer" />
                                        <div className="social-buttons">
                                            <a target="_blank" className="fab fa-youtube" href={`https://www.youtube.com/channel/${channelId}`} />
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
}

export default Catalog