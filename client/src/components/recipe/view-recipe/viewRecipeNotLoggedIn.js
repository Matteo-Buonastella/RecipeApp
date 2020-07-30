import React, { Component } from 'react'
import Navbar from '../../navbar/navbar'
import  { Redirect } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {connect} from 'react-redux'
import {getAllUserRecipes} from '../../../actions/recipeActions';
import {Link} from 'react-router-dom'
import axios from 'axios';
import {getIngredientsByRecepieId,getProcedureByRecipeId, getSavedRecipe} from '../../utils/functions'
import DisplayIngredients from './displayIngredients'
import CookingProcedure from './displayProcedure'
import '../../../styles/recipe/view-recipe/viewRecipe.css'

import {getRecipeById, deleteRecipe} from '../../utils/functions';
import Axios from 'axios';

class ViewRecipe extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId: 1,
            doesRecipeBelongToUser: false,
            recipeId: this.props.match.params.recipeId,
            recipe: {},
            ingredients: [],
            procedure: [],
            savedRecipe: [],
            savedRecipeLoaded: false,
            errors: false,
            errorMessage: "",
            disableInput: false,
        }
    }

    componentDidMount(){
        getRecipeById(this.state.recipeId).then((response)=>{
            this.setState({recipe: response.data[0]})
        }).catch((exception) => {
            this.setState({errors: true, errorMessage: "ERROR: Recipe Does Not Exist"})
            this.props.history.push('/Home')
        });
        getIngredientsByRecepieId(this.state.recipeId).then((response)=>{
            this.setState({ingredient: response.data})
        }).catch((exception)=>{
            this.setState({errors: true, errorMessage: "ERROR: Ingredients Not Found"})
            this.props.history.push('/Home')
        });
        getProcedureByRecipeId(this.state.recipeId).then((response)=>{
            this.setState({procedure: response.data})
        });
    }
    

    render() {
        return (
            <div>
                <Navbar />
                <div className="container viewRecipeTopDiv">
                    <h1 className="recipeTitle">{this.state.recipe.Name} </h1>
                    <h5 className="recipeTitle">{this.state.recipe.Cooking_Time} Minutes</h5>
                    <h5 className="recipeTitle">Servings: {this.state.recipe.Servings}</h5>
                    <Link className="btn btn-success viewButton" to={"/"}>Save Recipe</Link> {/*Redirect to Home, not logged in*/}
                </div>
                <div className="container" >
                    <div className="row" style={{textAlign: "center"}}>
                        <div className="col-md-6 col-sm-12">
                            <DisplayIngredients recipeId={this.state.recipeId}/> 
                        </div>
                        <div className="col-md-6 col-sm-12">
                            <CookingProcedure recipeId={this.state.recipeId}/>
                        </div>
                    </div>
                    <div className="row descriptionDiv" style={{textAlign: "center", marginTop: "50px"}}>
                        <h4 className="col-md-12 col-sm-12">Desciption</h4>
                        <p className="recipeTitle col-md-12 col-sm-12" style={{fontSize:"18px"}}>{this.state.recipe.Description}</p>
                    </div>
                </div>               
            </div>
        )
    }
}



export default (ViewRecipe);
