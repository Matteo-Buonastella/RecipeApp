import React, { Component } from 'react'
import {connect} from 'react-redux'
import {getUserById} from '../../../actions/userActions';
import Navbar from '../../navbar/navbar'
import AdvancedSearch from '../../utils/advancedSearch'
import RecipeSearchResults from './recipeSearchResults'
import '../../../styles/recipe/discover/discover.css'

class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId: 0,
            recipes: [],
            recipesLoaded: false
        }
    }

    componentDidMount(){
        this.props.user.map((user)=>{
            this.setState({userId: user.User_Id})
         })
    }

    setRecipesLoaded = (isLoaded) => {
        this.setState({recipesLoaded: isLoaded})
    } 

    setRecipes = (recipes) => {
        this.setState({recipes: recipes, recipesLoaded: true})
    }

    render() {

       
        const recipesLoaded = this.state.recipesLoaded
        
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="row">
                        <div className="col-12 advancedRecipeSearch">
                            <AdvancedSearch 
                                userId={this.state.userId} 
                                setRecipes={this.setRecipes}
                                setRecipesLoaded={this.setRecipesLoaded}
                            />
                        </div>

                        <div className="col-12">
                            {recipesLoaded ? <RecipeSearchResults recipes={this.state.recipes} userId={this.state.userId} /> : <div></div>}
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

export default connect(mapStateToProps)(Index);