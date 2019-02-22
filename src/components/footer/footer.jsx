import React from 'react'
import './footer_styles.scss'

const Footer = () => {
    return (
        <div className="parent footer-parent">
            <div className="container footer-cont">
            <div className="footer-details">
            <span>Created by Marc Dwyer</span>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/MarcDwyer/theNetwork">
            <i className="fab fa-github" />
            </a>
            </div>
            </div>
        </div>
    )
}

export default Footer