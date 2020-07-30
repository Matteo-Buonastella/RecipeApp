import React, { Component } from 'react'
import {connect} from 'react-redux'
import Navbar from '../../navbar/navbar'
import axios from 'axios';

class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId: null,
            title: "",
            description: "",
            errMsg: ""
        }
    }

    componentDidMount(){
        this.props.user.map((user)=>{
           this.setState({userId: user.User_Id})
        })
    } 

    handleSubmit = (event) => {
        event.preventDefault();
        var bugDetail = {
            userId: this.state.userId,
            title: this.state.title,
            description: this.state.description,
        }
        axios.post('/createBugReport', bugDetail).then((response)=>{
            this.setState({errMsg: ""})
            this.props.history.push({pathname: "/Home", state:{bugSubmited: true}})
        }).catch((error)=>{
            this.setState({errMsg: "Error 500, can't submit bug report"})
        })
    }

    handleTitleChange = (event) => {
        this.setState({title: event.target.value})
    }

    handleDescriptionChange = (event) => {
        this.setState({description: event.target.value})
    }

    render() {
        if (!this.state.userId){
            return <div>Loading...</div>
        }
        return (
            <div>
                <Navbar />
                <div className="container">
                    <h3 style={{textAlign:"center"}}>Report a Bug</h3>
                    <p style={{textAlign:"center", color:"red"}}>{this.state.errMsg}</p>
                    <form style={{marginTop:"20px"}} onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="form-group col-lg-12">
                                <label>Title<span className="formRequired">*</span></label>
                                <input style={{width : "100%"}} type="text" className="form-control" onChange={this.handleTitleChange} value={this.state.title} placeholder="Title of Bug" required /> 
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-12">
                                <label>Description<span className="formRequired">*</span></label>
                                <textarea rows="6" style={{width : "100%"}} type="text" className="form-control" onChange={this.handleDescriptionChange} value={this.state.description} placeholder="Description of Bug&#13;Please be as descriptive as possible&#13;What did you do => what did you expect to happen => what actually happened" required /> 
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-lg-2 col-sm-12">
                                <input type="submit" className="btn btn-warning form-control" value="Report" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

//map state to props to get state from redux and use in this component
const mapStateToProps = state => ({
    user: state.user.user,
})


export default connect(mapStateToProps)(Index)
