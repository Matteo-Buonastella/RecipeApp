import React, { Component } from 'react'
import {connect} from 'react-redux'
import '../../../styles/recipe/main/myRecipes.css'
import {Link} from 'react-router-dom'
import Search from '../../utils/search'
import { getAllUserRecipes } from '../../../actions/recipeActions'


class MyRecipes extends Component {
    constructor(){
        super();
        this.state = {
            recipes: '',
            recipesLoaded: false,
            searching: false,
        }
    }


    static getDerivedStateFromProps(nextProps, prevState) { 
        //Only set local state recipes to recipes stored in redux on intial load. Disable when searching
        if(prevState.searching === false){
            return{
                recipes: nextProps.recipe,
                recipesLoaded: true,
            }
        }
    } 

    handleRecipeSearch = (filteredRecipes) => {
        this.setState({recipes: filteredRecipes, searching: true})
    }

    
    render() {
        var emptyList = null   //Display message if no recipes found
        var recipes = null;   //Maps recipe from redux store
        if(this.state.recipesLoaded === true){
            recipes = this.state.recipes.map((recipe) => {
                return <div className="recipeCard card col-md-4 col-sm-6" key={recipe.Recipe_Id}> 
                           {/* <img className="card-img-top " src="..." alt="Image of Food"></img> */}
                            <div className="card-body recipeCardBody">
                                <h5 className="card-title">{recipe.Name} </h5>
                                <p className="card-text">Servings: {recipe.Servings}</p>
                                {/*<p className="card-text"> {recipe.Description}</p> */}
                                <p className="card-text">Time: {recipe.Cooking_Time} Minutes</p>
                                <Link className="btn btn-success viewButton" to={"ViewRecipe/"+(recipe.Recipe_Id)}>View</Link>
                                {/*  <button className="btn btn-warning editButton">Edit</button> */}
                            </div>
                            <input type="hidden" id="recipeId" name="recipeId" value={recipe.Recipe_Id} />
                       </div>
            })

            if(this.state.recipes.length === 0){
                emptyList = <p style={{textAlign: "center"}}>No Recipe Found...</p>
            }
        }
        

        return (
           //Display 3 Recipes on the same line and then collapse
            <div>
                <div className="container">

                    {/* Search Recipe Functionality*/}
                    <div className="row">
                        <Search recipes={this.props.recipe} handleRecipeSearch={this.handleRecipeSearch}/>
                    </div>
                    
                    {/* No Recipes Found */}
                    <div style={{textAlign: "center"}}>
                        {emptyList}
                    </div>

                    {/* All Recipes displayed*/}
                    <div className="row">
                        {recipes}
                    </div>
                    
                </div>
            </div>
        )
    }
}

//map state to props to get state from redux and use in this component
const mapStateToProps = state => ({
    recipe: state.recipe.recipes
})

export default connect(mapStateToProps)(MyRecipes);