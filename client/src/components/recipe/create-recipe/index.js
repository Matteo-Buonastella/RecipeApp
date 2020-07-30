import React, { Component } from 'react'
import {connect} from 'react-redux'

import Navbar from '../../navbar/navbar'
import CreateRecipeForm from './createRecipeForm'

class CreateRecipe extends Component {
    constructor(){
        super();
        this.state = {
            userId: "" //Set this to "" when deployed
        }
    }

    componentDidMount(){
        this.props.user.map((user)=>{
           this.setState({userId: user.User_Id})
        })
    } 

    render() {    
        if (!this.state.userId){
            return <div>Loading...</div>
        }
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="row">
                        <div className="col-12 justify-content-center">
                            <CreateRecipeForm userId={this.state.userId}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//map state to props to get state from redux and use in this component
const mapStateToProps = state => ({
    user: state.user.user,
})


export default connect(mapStateToProps)(CreateRecipe);