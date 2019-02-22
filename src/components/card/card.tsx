import React from 'react'
import { LiveStreams } from '../main/main'
import { Button } from '../styled_comp/styles'

interface Props {
    data: LiveStreams;
    setSelected: Function;
    setDetails: Function;

}
const Card = (props: Props) => {
    const { thumbnails, likes, dislikes, viewers, title, channelId, description, imageId, videoId } = props.data
    const newthumb = thumbnails.maxres.url.length > 0 ? thumbnails.maxres.url : thumbnails.high.url
    const newTitle = title.slice(0, 34)
    const image: string = `https://s3.us-east-2.amazonaws.com/xhnetwork/${imageId}.jpg`

    const theme = {
        marginLeft: "15px",
    }
    return (
        <div className="card">
            <div className="likes">
                <span>
                    <i className="fas fa-thumbs-up" /> {likes}
                </span>
                <span>
                    <i className="fas fa-thumbs-down" /> {dislikes}
                </span>
            </div>
            <div className="image">
                <img src={newthumb} alt="thumbnail" />
            </div>
            <div className="details">
                <div className="content">
                    <img src={image} alt="streamer" />
                    <div className="content-details">
                        <h3>{newTitle}</h3>
                        <small style={{ margin: '-15px auto 0 auto' }}>{name}</small>
                        <span><i style={{ color: "red" }} className="fas fa-dot-circle" /> {viewers + " viewers"}</span>
                    </div>
                </div>
                <div className="buttons">
                    <Button
                        theme={theme}
                        onClick={() => {
                            if (window.innerWidth <= 900) {
                                const youtubeLink: string = `https://www.youtube.com/watch?v=${videoId}`;
                                const win: any = window.open(youtubeLink, '_blank');
                                win.focus();
                                return;
                            }
                            props.setSelected(channelId)
                        }}
                    >Watch</Button>
                    <span className="details"
                        onClick={() => {
                            const info = {
                                title,
                                description,
                                viewers,
                                name
                            }
                            props.setDetails(info)
                        }}
                    >
                        Show description
                </span>
                </div>
            </div>
        </div>
    )
}

export default Card