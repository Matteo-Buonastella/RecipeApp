//Parent Page for users when logged in. Redux Store is initalized here and all child components have access to redux store
import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getUserById} from '../../../actions/userActions';
import {getAllUserRecipes, resetRecipes} from '../../../actions/recipeActions';

import Navbar from '../../navbar/navbar'
import MyRecipes from './myRecipes'
import Search from '../../utils/search'
import '../../../styles/recipe/main/myRecipes.css'

class Index extends Component {
    
    //function returns a notification to user for various reasons 
    Notification(){
         try{
             if(this.props.location.state.deletedRecipe === true){
                 return <p className="recipeMessage">Recipe Successfully Deleted!</p>
             } else if (this.props.location.state.bugSubmited === true){
                return <p className="recipeMessage">Thank you, your bug has been reported!</p>
             } else if (this.props.location.state.featureRequestSubmited === true){
                 return <p className="recipeMessage">Thank you, your feature request has been submited!</p>
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