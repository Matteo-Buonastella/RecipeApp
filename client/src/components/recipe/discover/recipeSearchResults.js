import React, { Component } from 'react'
import { confirmAlert } from 'react-confirm-alert'; // Import
import {Link} from 'react-router-dom'
import FilterResult from './filterResult';
import '../../../styles/recipe/discover/recipeSearchResults.css'

class RecipeSearchResults extends Component {
    constructor(props){
        super(props)
        this.state = {
            recipes: this.props.recipes
        }
    }

    displaySearchHelp = event => {
        confirmAlert({
            customUI: ({ onClose }) => {
            return (
                <div className='custom-ui'>
                  <h1>3 ways to Search For Recipes</h1>
                  <p><i>1. Search By Recipe Name</i></p>
                  <p> This will find recipes that contain the name you entered. For example if you entered Pie, it will display recipes such as Apple Pie, Pumpkin Pie etc</p>
                  <p><i>2. Search By Ingredients</i></p>
                  <p> This will find recipes that contain ALL the ingredients you entered. For example if a recipe contains only 2 of the 3 ingredients you entered, it will NOT display.</p>
                  <p><i>3. Search By Recipe Name and Ingredients</i></p>
                  <p> This combines the first 2 options. The recipe must contain all the ingredients you entered and must contain the Recipe name you entered</p>
                  <p>*Secret recipes will not be displayd</p>
                  <button onClick={onClose}>OK</button>
                </div>
              );
            }
        });
    }

    didFindRecipes(){
        var emptyList = null   //Display message if no recipes found
        if(this.state.recipes.length == 0){
            return <div style={{textAlign: "center"}}>
                        <p> No Recipe Found... </p>
                        <a  href="#" onClick={this.displaySearchHelp}>Click for Help</a>
                    </div>
        } 
    }

    filterRecipes = (filterType) => {
        if(filterType === "Newest"){
            this.setState({recipes: this.state.recipes.sort((a, b) => new Date(a.Created_Date) - new Date(b.Created_Date))})
        } else if (filterType === "Oldest") {
            this.setState({recipes: this.state.recipes.sort((a, b) => new Date(b.Created_Date) - new Date(a.Created_Date))})
        } else if (filterType === "Most Saved"){
            console.log(this.state.recipes)
            this.setState({recipes: this.state.recipes.sort((a, b) => parseFloat(b.Saves) - parseFloat(a.Saves))})
            console.log(this.state.recipes)
        }
    }

    //Uncomment lines when deployed
    renderViewButton(recipeId){
      //  if(this.props.userId > 0){
            return (<Link className="btn btn-success viewButton" to={"ViewRecipe/"+(recipeId)}>View</Link>)
      //  } else {
            //User is not logged in, redirect to minified view recipe version
       //     return (<Link className="btn btn-success viewButton" to={"NoAccount_ViewRecipe/"+(recipeId)}>View</Link>)
      //  }
    }


    render() {
        var emptyList = this.didFindRecipes(); //

        var recipes = this.state.recipes.map((recipe)=>{
            return <div className="recipeCard card col-lg-4 col-md-6 col-sm-12" key={recipe.Recipe_Id}> 
                        <div className="card-body recipeCardBody" >
                            <h5  style={{display: "inline-block"}} className="card-title float-center">{recipe.Name} </h5>
                            {/*<p  style={{display: "inline-block"}}className="card-text float-right numberCircle">{recipe.Saves}&#10084;</p> */}
                            <p className="card-text">Servings: {recipe.Servings}</p>
                            <p className="card-text">{recipe.Cooking_Time} Minutes</p>
                            <hr />
                            <p className="card-text float-center" style={{display: "inline-block"}}>{recipe.Saves}&hearts;</p> 
                            <p className="card-text float-center" style={{display: "inline-block"}}>&nbsp;{recipe.Username}</p>
                            <br />
                            {this.renderViewButton(recipe.Recipe_Id)}
                        </div>
                    </div>
        })


        return (
            <div className="container">
                    <h4 style={{textAlign: "center"}}> {this.state.recipes.length} Recipe(s) </h4>
                <div className="row">
                    <div className="col-12" style={{marginBottom:"10px"}}>
                        <FilterResult filterRecipes={this.filterRecipes}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {emptyList}
                    </div>
                    {recipes}
                </div>
            </div>
        )
    }
}

export default RecipeSearchResults