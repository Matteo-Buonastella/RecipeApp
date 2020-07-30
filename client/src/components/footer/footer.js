import React from 'react'
import '../../styles/landingPage.css'

function Footer() {
    return (
        <div className="main-footer">
            <div className="container">
                <div className="row footerRow">
                    <p className="col">
                        &copy;{new Date().getFullYear()} All rights reserved
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer;