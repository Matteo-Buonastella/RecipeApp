import React, { Component } from 'react'
import {getIngredientsByRecepieId} from '../../utils/functions';
import '../../../styles/recipe/view-recipe/displayIngredients.css'


class DisplayIngredients extends Component {
    constructor(props){
        super(props);
        this.state = {
            recipeId: this.props.recipeId,
            ingredients: [],
            errors: false,
            errorMessage: ""
        }
    }

    componentDidMount(){
        getIngredientsByRecepieId(this.state.recipeId).then((response)=>{
            this.setState({ingredients: response.data})
        }).catch((exception) => {
            this.setState({errors: true, errorMessage: exception})
        });
    }

    render() {
        var ingredients = this.state.ingredients.map((ingredient)=>{
            return(
                <div className="col-md-12 col-sm-12" key={ingredient.Ingredient_Id}>
                    <div className="ingredientListDiv card-text">
                        <p className="ingredientItemName"><strong>{ingredient.Ingredient}:</strong></p> 
                        <p className="ingredientItemName">&nbsp;{ingredient.Amount}</p>
                        <p className="ingredientItemName">&nbsp;{ingredient.Measurement_Name}</p>
                    </div>
                </div>
            )
        })

        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="card" style={{width: "100%"}}>
                            <div className="card-body">
                                <h3 className="card-title">Ingredients&nbsp;({this.state.ingredients.length})</h3>
                                {ingredients}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DisplayIngredients;
