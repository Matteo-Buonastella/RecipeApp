import React, { Component } from 'react'
import '../../styles/recipe/main/myRecipes.css'

class Search extends Component {
    constructor(props){
        super(props);
        this.state = {
            search: "",
        }
        
        this.updateSearch = this.updateSearch.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    updateSearch(event){
        event.preventDefault();
        this.setState({search: event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
        var filteredRecipes = []

        const request = this.props.recipes.map(recipe => {
            if(recipe.Name.toLowerCase().includes(this.state.search.toLowerCase())){
                filteredRecipes.push(recipe)
            } 
        })
        Promise.all(request).then(()=>{
            this.props.handleRecipeSearch(filteredRecipes)
        })
    }


    render() {
        return (
            <div className="searchRecipeDiv col-12">
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col-4"></div>

                        <div className="form-group col-lg-4  col-sm-10">
                            <input type="text" className="form-control" onChange={this.updateSearch} value={this.state.search} placeholder="Recipe Name" maxLength="40"/>
                        </div>

                        <div className="form-group col-lg-1 col-sm-2">
                            <input type="submit" className="btn btn-primary searchMyRecipeBtn" value="Search" width="10px"/>
                        </div>
                    </div>
                    
                </form>
            </div>
        )
    }
}

export default Search;