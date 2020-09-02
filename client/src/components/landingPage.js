import React, { Component } from 'react'
import '../styles/landingPage.css'
import Login from './login/login'
import {Link} from 'react-router-dom'
import Footer from './footer/footer'
import Notification from './notification/index'

class LandingPage extends Component {

    //function returns a notification to the user for various reasons. Message and color are recieved as props
    Notification(){
        try{
            if(this.props.location.state.notification === true){
                return <Notification message={this.props.location.state.message} color={this.props.location.state.color}/>
            } 
        } catch(e){}
    }

    render() {
        var Notification = this.Notification();

        return (
                <div className="landingPage-div">
                    <div className="landingPage-main">
                        <h1 className="landingPageTitle header"> Store your Recipe's Online </h1>
                        {Notification}
                            <div className="container landingPage-Container">
                                <div className="row">
                                    <div className="leftContainer col-lg-5 col-sm-12">
                                        <h2 className="leftContainerMessage">Store all your recipes online for free.</h2>
                                        <br />
                                        <ul>
                                            <li>Create and store your own recipes</li> <br />
                                            <li>Discover thousands of recipes with just a few clicks</li>
                                        </ul>
                                        <div className="d-flex justify-content-center">
                                                <Link to="/Register" className="btn-lg btn-primary">Register</Link>
                                            </div>
                                    </div>
                                    <div className="rightContainer col-lg-7">
                                        <div className="col-lg-8 col-md-10 col-sm-12 landingPage-Login">
                                            <Login/>
                                        </div>
                                        <br />
                                        <div className="row">
                                            <div className="col-12 text-center">
                                                <Link to="/ResetPassword">Reset Password</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="landingPage-discoverNow text-center col-lg-12">
                                        <p>Discover recipes NOW</p>
                                        <Link to="/Discover" className="btn-lg btn-info">Discover Recipes</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="footer" className="footer footer-left">
                            < Footer/>
                        </div>
                </div>
                
        )
    }
}

export default LandingPage;
