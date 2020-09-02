import React, { Component } from 'react'
import Navbar from '../../navbar/navbar'
import  { Redirect } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {connect} from 'react-redux'
import {getAllUserRecipes} from '../../../actions/recipeActions';
import {Link} from 'react-router-dom'
import axios from 'axios';
import {getIngredientsByRecepieId,getProcedureByRecipeId, getSavedRecipe, getUserNameAndSavesByRecipeId} from '../../utils/functions'
import DisplayIngredients from './displayIngredients'
import CookingProcedure from './displayProcedure'
import Notification from '../../notification/index'
import imageKey from '../../../assets/images/secret_recipe_key.png'
import '../../../styles/recipe/view-recipe/viewRecipe.css'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, DropdownButton,  } from 'react-bootstrap';

import {getRecipeById, deleteRecipe} from '../../utils/functions';

class ViewRecipe extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId: 0,
            username: "", //Stores username of the user who owns recipe
            doesRecipeBelongToUser: false,
            recipeId: this.props.match.params.recipeId,
            recipe: {},
            ingredients: [],
            procedure: [],
            savedRecipe: [],
            savedRecipeLoaded: false,
            saves: 0,  //Stores how many people have saved the recipe
            errors: false,
            errorMessage: "",
            disableInput: false,
            loaded: false,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) { 
        return{
            userId: nextProps.userId,
        }
    } 

    componentDidMount(){
        getRecipeById(this.state.recipeId).then((response)=>{
            this.setState({recipe: response.data[0]})
            this.doesRecipeBelongToUser();
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
        getUserNameAndSavesByRecipeId(this.state.recipeId).then((response)=>{
            this.setState({username: response.data[0].Username, saves: response.data[0].Saves})
        });
        getSavedRecipe(this.state.userId, this.state.recipeId).then((response)=>{
            this.setState({savedRecipe: response.data, savedRecipeLoaded: true})
        })
    }
    

    doesRecipeBelongToUser(){
        if(this.props.userId === this.state.recipe.User_Id_FK){
            this.setState({doesRecipeBelongToUser: true})
        } else {
            this.setState({doesRecipeBelongToUser: false})
        }
    }

    handleDeleteRecipe(){
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure you want to delete this recipe?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => deleteRecipe(this.state.recipeId).then((response)=>{
                    this.props.getAllUserRecipes(this.props.userId);
                    this.props.history.push({pathname: "/Home", state:{notification: true, message: "Recipe Successfully Deleted!", color: "green"}}) 
                }).catch((e)=>{
                    this.props.history.push({pathname: "/Home", state:{notification: true, message: "Error, unable to delete recipe", color: "red"}}) 
                })
              },
              {
                label: 'No',
                //onClick: () => alert('Click No')
              }
            ]
          });
    }

    handleSaveRecipe = (event) => {
        event.preventDefault();
        this.setState({ disableInput: true})
        var data = {
            recipeId: this.state.recipeId,
            userId: this.state.userId
        }
        axios.post('/saveRecipe', data).then((response)=>{
            getSavedRecipe(this.state.userId, this.state.recipeId).then((response)=>{
                this.props.getAllUserRecipes(this.props.userId);
                this.setState({savedRecipe: response.data, savedRecipeLoaded: true, disableInput:false})
            })
        })
    }

    handleUnsaveRecipe = (event) => {
        event.preventDefault();
        var data = {
            savedRecipeId: this.state.savedRecipe[0].Saved_Recipe_Id
        }
        axios.post('/unsaveRecipe', data).then((response)=>{
            this.props.getAllUserRecipes(this.props.userId);
            this.setState({savedRecipe: [], savedRecipeLoaded: true})
        })
    }

    //Redirects user to report recipe page where they can confirm the report
    redirectToReportRecipe = (event) =>{
        event.preventDefault();
        this.props.history.push({pathname: '/ReportRecipe', state:{
            userId: this.state.userId, 
            recipeId: this.state.recipeId,
            username: this.state.username, 
            recipe: this.state.recipe
        }}) 
    }

    //Only display edit button if recipe is yours
    displayEditButton(){
        if(this.state.doesRecipeBelongToUser === true){
            return <Link to={{pathname:"/EditRecipe", 
                                state:{
                                    editRecipe: true, 
                                    recipe: this.state.recipe, 
                                    ingredients: this.state.ingredient, 
                                    procedure: this.state.procedure,
                                } 
                            }} 
                            className="btn btn-warning editRecipeButton">Edit</Link>
        }
    }

    displayDeleteButton(){
        if(this.state.doesRecipeBelongToUser === true){
            return <button className="btn btn-danger" onClick={ () => this.handleDeleteRecipe() } >Delete</button>
        }
    }

    displaySaveButton(){
        if(this.state.doesRecipeBelongToUser === false && this.state.savedRecipeLoaded === true){
                if(this.state.savedRecipe.length === 0){
                    //Recipe is not saved
                    return <button className="btn btn-success" onClick={this.handleSaveRecipe} disabled={this.state.disableInput}>Save Recipe</button>
                } else {
                    //Recipe is saved
                    return <button className="btn btn-primary unsaveRecipeBtn" onClick={this.handleUnsaveRecipe}><span>&#10003; Saved</span></button>
                }
        }
    }

    displaySecretRecipeKey(){
        if(this.state.recipe.Secret_Recipe === 1){
            return <img width="35px" src={imageKey} title="Secret Recipe"/>
        }
    }

    setNotification(message, color){
        this.setState({notificationMessage: message, notificationColor: color})
    }

    recipeEditedNotification(){
        try{
            if(this.props.location.state.notification === true){
                return <Notification message={this.props.location.state.message} color={this.props.location.state.color} />
            }
        } catch(e){
        }
    }

    render() {
        var editButton = this.displayEditButton();
        var deleteButton = this.displayDeleteButton();
        var saveButton = this.displaySaveButton();
        var Notification = this.recipeEditedNotification();
        var keySymbol = this.displaySecretRecipeKey();
        return (
            <div>
                <Navbar />
                {Notification}
                <div className="container viewRecipeTopDiv">
                    <h1 className="recipeTitle">{this.state.recipe.Name} {keySymbol}</h1>
                    <h5 className="recipeTitle">{this.state.recipe.Cooking_Time} Minutes</h5>
                    <h5 className="recipeTitle">Servings: {this.state.recipe.Servings}</h5>
                    {editButton}
                    {deleteButton}
                    {saveButton}
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
                    <div className="row justify-content-center descriptionDiv" style={{marginTop: "50px", marginBottom: "50px"}}>
                        <h4 className="col-md-12 col-sm-12" style={{textAlign: "center"}}>Desciption</h4>
                        <p className="recipeTitle col-12" style={{fontSize:"18px"}}>{this.state.recipe.Description}</p>
                    </div>
                    <hr />
                    <div className="row">
                        <p className="col-lg-12">Created by: {this.state.username}</p>
                        <p className="col-lg-12">Saves: {this.state.saves}</p>
                    </div>
                    <div className="row">
                        <div className="col-lg-12" style={{marginBottom:"150px"}}>
                        <DropdownButton id="dropdown-variants-success" variant="secondary" title="Actions">
                            <Dropdown.Item onClick={this.redirectToReportRecipe}>Report</Dropdown.Item>
                        </DropdownButton>
                        </div>
                    </div>
                </div>               
            </div>
        )
    }
}

//map state to props to get state from redux and use in this component
const mapStateToProps = state => ({
    userId: state.user.user[0].User_Id, // Enable when deployed
  //  userId: 1  //disable when deployed
})

export default connect(mapStateToProps, {getAllUserRecipes})(ViewRecipe);
