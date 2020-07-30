import React, { Component } from 'react'
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";

class AdvancedSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            recipeSearch: "",
            ingredientsList: [], //Array of object: Id, Ingredient
            recipeResults: [], //Results from search stored in array
            ingredient: "",
            ingredientId: 1,
            displayAddIngredients: false,
            displayRecipeSearch: true,
            loading: false,
            errMsg: ""
        }
    }

    //Results are sent to parent component
    handleSubmit = event => {
        event.preventDefault();
        this.props.setRecipesLoaded(false);
        this.setState({loading: true}) //Display loading spinner

        var searchDetails = {
            params:{
                userId: this.props.userId,
                recipeName: this.state.recipeSearch,
                ingredientsList: this.state.ingredientsList.map((data)=>{return data.Ingredient})  //Only need ingredient name
            }
        }

      /*  if(this.state.ingredientsList.length === 0 && this.state.recipeSearch.length === 0){
            this.setState({errMsg: "Please add Ingredients or Recipe Name"})
        } else { */
            if(this.state.ingredientsList.length > 0 && this.state.recipeSearch != ""){
                //Search by ingredients and recipe name
                axios.get('/searchForRecipebyNameAndIngredients', searchDetails).then((results)=>{
                    this.props.setRecipes(results.data)
                })
            } else if(this.state.ingredientsList.length > 0) {
                //Search by ingredients
                axios.get('/searchForRecipebyIngredients', searchDetails).then((results)=>{
                    this.props.setRecipes(results.data)
                })
            } else if (this.state.ingredientsList.length === 0 && this.state.recipeSearch === ""){
                //Search all recipes
                axios.get('/searchAllRecipes').then((results)=>{
                    this.props.setRecipes(results.data)
                })
            } else {
                //Search by recipe name
                axios.get('/searchForRecipeByName', searchDetails).then((results)=>{
                    this.props.setRecipes(results.data)
                })
            }
            this.setState({errMsg:""})
      //  }
        this.setState({loading: false})
    }

    handleAddIngredientSubmit = event => {
        event.preventDefault();
        var ingredient = {Id: this.state.ingredientId, Ingredient: this.state.ingredient}
        let ingredients = [...this.state.ingredientsList, ingredient];
        this.setState({ingredientsList: ingredients, ingredient: "", ingredientId: this.state.ingredientId + 1});
    }

    handleRecipeSearchChange = event => {
        event.preventDefault();
        this.setState({recipeSearch: event.target.value});
    }

    handleIngredientsChange = event => {
        event.preventDefault();
        this.setState({ingredient: event.target.value});
    }

    handleDisplayIngredient = event => {
        event.preventDefault();
        this.setState({displayAddIngredients: true, displayRecipeSearch: false})
    }

    handleDisplaySearch = event => {
        event.preventDefault();
        this.setState({displayAddIngredients: false, displayRecipeSearch: true})
    }

    //Never Mutate state directly
    handleRemoveIngredient = (ingredient) => {    
        var filteredList = this.state.ingredientsList.filter(function(item) { 
            return item.Id !== ingredient.Id
        })
        this.setState({ingredientsList: filteredList})      
    }


    displaySearch(){
        if(this.state.displayRecipeSearch === true){
            return(
                <form onSubmit={this.handleSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3">
                                <p style={{fontSize: "18px", marginTop: "5px", textAlign:"center"}}>Ingredients: {this.state.ingredientsList.length}</p>
                            </div>
                            <div className="form-group col-lg-4 col-md-12">
                                <input type="text" className="form-control" onChange={this.handleRecipeSearchChange} value={this.state.recipeSearch} placeholder="Recipe Name" maxLength="40"/> 
                            </div>
                            <div className="form-group col-lg-2 ">
                                <input type="submit" className="form-control btn btn-success" value="Search" width="10px"/>
                            </div>
                             {/* Button to switch between adding ingredients & recipe name */}
                             <div className="form-group col-lg-2 col-sm-12">
                                <button className="form-control btn btn-primary" onClick={this.handleDisplayIngredient}>Add Ingredients</button>
                            </div>
                        </div>
                    </div>
                </form>
            )
        }
    }

    //Allows user to add ingredients into the search
    displayAddIngredients(){
        const ingredientList = this.state.ingredientsList.map(ingredient => {
            return(
                    <div className="ingredientsList" key={ingredient.Id} style={{fontSize: "18px", marginBottom:"5px", textAlign:"center"}} >
                        <a style={{fontSize: "18px", textAlign:"center"}} href="#" className="ingredientListItem2" onClick={() => { this.handleRemoveIngredient(ingredient)}}>- {ingredient.Ingredient}</a>
                    </div>
            )
        })
        
        var emptyList;
        if(this.state.ingredientsList.length === 0){
            emptyList = <p style={{marginTop: "5px", textAlign:"center"}}><i>Empty...</i></p>
        }

        if(this.state.displayAddIngredients === true){
            return(
                <form onSubmit={this.handleAddIngredientSubmit}>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-sm-12" style={{marginBottom:"15px"}}>
                                {ingredientList}
                                {emptyList}
                            </div>
                            <div className="form-group col-lg-4 col-md-12">
                                <input type="text" className="form-control" onChange={this.handleIngredientsChange} placeholder="Ingredient" value={this.state.ingredient} maxLength="25" required/> 
                            </div>
                            <div className="form-group col-lg-2 col-sm-12">
                                <input type="submit" className="form-control btn btn-success" value="Add" width="10px"/>
                            </div>
                            <div className="form-group col-lg-2 col-sm-12">
                                <button className="form-control btn btn-primary" onClick={this.handleDisplaySearch}>Back to Search</button>
                            </div>
                        </div>
                    </div>
                </form>
            )
        }
    }

    render() {
        var displaySearch = this.displaySearch();
        var displayAddIngredients = this.displayAddIngredients();
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            {displaySearch}
                            {displayAddIngredients}
                            <p style={{color:"red", textAlign:"center"}}>{this.state.errMsg}</p>
                        </div>
                        <div className="sweet-loading col-12" style={{textAlign:"center", margin:"0 auto"}}>
                            <BeatLoader
                            size={15}
                            margin={2}
                            color={"#123abc"}
                            loading={this.state.loading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdvancedSearch
