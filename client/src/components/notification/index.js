//Universal Notification component for app
import React, { Component } from 'react'
import '../../styles/notification/notification.css'

class Notification extends Component {
    constructor(props){
        super(props);
        this.state = {
            message: this.props.message,
            color: this.props.color,
        }
    }

    render() {
        return (
            <div>
                <p className="Notification-notificationMessage" style={{color:this.state.color}}>
                    {this.state.message}
                </p>
            </div>
        )
    }
}


export default Notification;
