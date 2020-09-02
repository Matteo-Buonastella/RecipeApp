//Parent Page for users when logged in. Redux Store is initalized here and all child components have access to redux store
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getUserById} from '../../../actions/userActions';
import {getAllUserRecipes, resetRecipes} from '../../../actions/recipeActions';

import Navbar from '../../navbar/navbar'
import MyRecipes from './myRecipes'
import Search from '../../utils/search'
import Notification from '../../notification/index'
import '../../../styles/recipe/main/myRecipes.css'

class Index extends Component {
    
    //function returns a notification to user for various reasons 
    Notification(){
         try{
             if(this.props.location.state.notification === true){
                return <Notification message={this.props.location.state.message} color={this.props.location.state.color}/>
             }
         } catch(e){}
     }

    render() {
        var notification = this.Notification();

        return (
            <div>
                <Navbar />
                <div className="myRecipeIndexNotification">
                    {notification}
                </div>
                {/*Display all of my recipes and saved recipes*/}
                <div className="main myRecipeMain"> 
                    <MyRecipes />
                </div>
            </div>
        )
    }
}

//map state to props to get state from redux and use in this component
const mapStateToProps = state => ({
    user: state.user.user,
    recipes: state.recipe.recipes
})


export default connect(mapStateToProps, {getUserById, getAllUserRecipes, resetRecipes})(Index);