import React, { Component } from 'react'
import './catalog_styles.scss'
interface State {
    cata: Stream[] | null;
}
interface Stream {
    name: string;
    channelId: string;
    imageId: string;
}
export default class Catalog extends Component <{}, State> {
    state: State = {
        cata: null
    }
    async componentDidMount() {
        try {
            const fetcher = await fetch('/streamers/all')
            const data: Stream[] = await fetcher.json()
            this.setState({cata: data})
        } catch(err) {
            console.log(err)
        }
    }
    render() {
        if (!this.state.cata) return null
        return (
            <div className="parent">
                <div className="container cata-container">
                    <h2>Catalog</h2>
                    <div className="cata-grid">
                        {this.renderCatalog()}
                    </div>
                </div>
            </div>
        )
    }
    renderCatalog() {
        const { cata } = this.state
        if (!cata) return null
        return cata.map(({name, imageId, channelId}, index) => {
            const image: string = `https://s3.us-east-2.amazonaws.com/xhnetwork/${imageId}.jpg`
            return (
                <div className="cata-card" key={index}>
                <h4>{name}</h4>
                    <img src={image} alt="streamer"/>
                    <div className="social-buttons">
                        <a target="_blank" className="fab fa-youtube" href={`https://www.youtube.com/channel/${channelId}`}></a>
                    </div>
                </div>
            )
        })
    }
}