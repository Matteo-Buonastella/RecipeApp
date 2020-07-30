import React, { Component } from 'react'
import '../../../styles/recipe/create-recipe/createRecipeForm.css'
import axios from 'axios';
import {connect} from 'react-redux'
import {getAllUserRecipes} from '../../../actions/recipeActions';
import { withRouter } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {insertIngredient, insertSteps, deleteAllIngredientsFromRecipe, deleteAllStepsFromRecipe} from '../../utils/functions'

class CreateRecipeForm extends Component {
    constructor(){
        super();
        this.state = {
            step1Display: true,  //Recipe details
            step2Display: false, //Add ingredients
            step3Display: false, //Add steps
            step4Display: false, //Final Review Submit
            pageTitle: "Create Recipe",
            errorMsg: "",
            inEditMode: false,
            recipeId: null,  //Only used when editing a recipe
            recipeName: "",
            description: "",
            cookingTime: "",
            servings: 1,
            secretRecipe: false, //Used for db interaction
            secretRecipeDisplay: "False", //Recipes are not secret by default. Only used for display purposes
            ingredients: [],  //Array of objects :> name: amount: measurement:
            ingredientId: 1,
            measurementOptions: [],
            ingredientName: "",
            ingredientAmount: "",
            ingredientMeasurement: "",
            ingredientMeasurementId: 1,  //Default Id is empty
            stepsList: [],
            cookingStep: "",
            cookingStepId: 1, 
        }
        this.handleRecipeChange = this.handleRecipeChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleCookingTimeChange = this.handleCookingTimeChange.bind(this);
        this.addIngredientToList = this.addIngredientToList.bind(this);
        this.handleIngredientChange = this.handleIngredientChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleMeasurementChange = this.handleMeasurementChange.bind(this);
        this.removeIngredientFromList = this.removeIngredientFromList.bind(this);
        this.handleDCookingStepsChange = this.handleDCookingStepsChange.bind(this);
        this.addStepsToList = this.addStepsToList.bind(this);
        this.removeStepFromList = this.removeStepFromList.bind(this);
        this.createRecipe = this.createRecipe.bind(this);
        this.updateRecipe = this.updateRecipe.bind(this)
        this.handleExitEditing = this.handleExitEditing.bind(this)
    }

    componentDidMount(){
        this.setStateInEditMode();
        axios.get('/getMeasurementOptions').then((response)=>{
            this.setState({measurementOptions: response.data})
        })
    }

    //Function sets state using redux props if we are editing an existing recipe
    setStateInEditMode(){
        try{
            if(this.props.location.state.editRecipe === true){
                var ingredientArray = [];
                var stepsArray = [];
                //Add Ingredients to array
                this.props.location.state.ingredients.map(data => {
                    var ingredient = {Ingredient: data.Ingredient, Amount: data.Amount, Measurement: data.Measurement_Name, MeasurementId: data.Measurement_Id, id: ingredientArray.length + 1};
                    ingredientArray.push(ingredient)
                })
                //Add Cooking Steps to array
                this.props.location.state.procedure.map(data => {
                    var step = {id: stepsArray.length + 1, description: data.Name}
                    stepsArray.push(step)
                })
                //Set Recipe details, ingredients, cooking steps to state
                this.setState({
                    pageTitle: "Edit Recipe",
                    inEditMode: true,
                    recipeId: this.props.location.state.recipe.Recipe_Id,
                    recipeName: this.props.location.state.recipe.Name,
                    description: this.props.location.state.recipe.Description,
                    cookingTime: this.props.location.state.recipe.Cooking_Time,
                    servings: this.props.location.state.recipe.Servings,
                    ingredients: ingredientArray,
                    stepsList: stepsArray,
                    cookingStepId: stepsArray.length + 1,
                    ingredientId: ingredientArray.length + 1
                })
                //Check if recipe is a secret or not and set to state
                if(this.props.location.state.recipe.Secret_Recipe === 1){
                    this.setState({secretRecipe: true, secretRecipeDisplay: "True"})
                } else {
                    this.setState({secretRecipe: false, secretRecipeDisplay: "False"})
                }
            }
        } catch(e){}
    }

    handleRecipeChange(event){
        event.preventDefault();
        this.setState({recipeName: event.target.value});
    }

    handleDescriptionChange(event){
        event.preventDefault();
        this.setState({description: event.target.value});
    }

    handleCookingTimeChange(event){
        event.preventDefault();
        this.setState({cookingTime: event.target.value});
    }

    handleServingsChange = event => {
        event.preventDefault();
        this.setState({servings: event.target.value});
    }

    handleSecretRecipeChange = event => {
        //Manually set because dropdown converts True/False to string
        if(event.target.value === "True"){
            this.setState({secretRecipe: true, secretRecipeDisplay: event.target.value})
        } else {
            this.setState({secretRecipe: false, secretRecipeDisplay: event.target.value})
        }
    }

    handleIngredientChange(event){
        event.preventDefault();
        this.setState({ingredientName: event.target.value});
    }

    handleAmountChange(event){
        event.preventDefault();
        this.setState({ingredientAmount: event.target.value});
    }

    handleMeasurementChange(event){
        event.preventDefault();
        //Set meaurement id
        this.setState({ingredientMeasurementId: event.target.value});
        //Set measurement name
        this.state.measurementOptions.map(ingredient => {
            if(ingredient.Measurement_Id == event.target.value){
                this.setState({ingredientMeasurement: ingredient.Name})
            }
        })
    }

    handleDCookingStepsChange(event){
        event.preventDefault();
        this.setState({cookingStep: event.target.value});
    }

    handleExitEditing(){
        this.props.history.push({pathname: "/ViewRecipe/"+(this.state.recipeId)}) 
    }

    //Insert recipe detail, then ingredients, then steps
    createRecipe(event){
        event.preventDefault();
        var recipeId;

        var recipeDetail = {
            userId: this.props.userId,
            recipeName: this.state.recipeName,
            description: this.state.description,
            cookingTime: this.state.cookingTime,
            servings: this.state.servings,
            secretRecipe: this.state.secretRecipe
        }
        axios.post('/createRecipe', recipeDetail).then((response)=>{   //response.data.insertId holds id of inserted recipe
            recipeId = response.data.insertId;
            insertIngredient(recipeId, this.state.ingredients).then(()=>{
                insertSteps(recipeId, this.state.stepsList).then(()=>{
                    this.props.getAllUserRecipes(this.props.userId);
                    this.props.history.push({pathname: "/ViewRecipe/"+(recipeId)}) 
                })
            })  
        }).catch((err)=>{
            this.setState({errorMsg: "There was an error creating your Recipe"})
        })
    }

    updateRecipe(event){
        event.preventDefault();
        var recipeId = this.state.recipeId;
        var recipeDetail = {
            userId: this.props.userId,
            recipeId: recipeId,
            recipeName: this.state.recipeName,
            description: this.state.description,
            cookingTime: this.state.cookingTime,
            servings: this.state.servings,
            secretRecipe: this.state.secretRecipe
        }

        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure you want to update this recipe?',
            buttons: [
                {
                label: 'Yes',
                onClick: () => 
                axios.post('/updateRecipe', recipeDetail).then((response)=>{
                    deleteAllIngredientsFromRecipe(recipeId).then(()=>{
                        deleteAllStepsFromRecipe(recipeId).then(()=>{
                            insertIngredient(recipeId, this.state.ingredients).then(()=>{
                                insertSteps(recipeId, this.state.stepsList).then(()=>{
                                    this.props.getAllUserRecipes(this.props.userId);
                                    this.props.history.push({pathname: "/ViewRecipe/"+(recipeId), state:{editedRecipe: true, notification:"Successfully Updated Recipe"}}) 
                                })
                            })
                        })
                    })
                }).catch((err)=>{
                    this.setState({errorMsg: "There was an error updating your Recipe"})
                })
                },
                {
                label: 'No',
                }
            ]
        });
    }

    addIngredientToList(event){
        event.preventDefault();
        var name = this.state.ingredientName;
        var amount = this.state.ingredientAmount;
        var measurement = this.state.ingredientMeasurement;
        var measurementId = this.state.ingredientMeasurementId;
        var id = this.state.ingredientId + 1;

        var ingredient = {Ingredient: name, Amount: amount, Measurement: measurement, MeasurementId: measurementId, id: id};
        let ingredients = [...this.state.ingredients, ingredient];

        this.setState({ingredients: ingredients, ingredientName:"", ingredientAmount: "", ingredientId: this.state.ingredientId + 1})
    }

    removeIngredientFromList(ingredientId){
        this.setState({ingredients: this.state.ingredients.filter(function(item) { 
            return item.id !== ingredientId
        })})
    }

    //Function displays the ingredients the user has added to the recipe and can delete them
    displayIngredients(){
        if(this.state.ingredients.length > 0){
            const list = this.state.ingredients.map(ingredient => {
                return(
                    <div key={ingredient.id}>
                        <div className="ingredientsList">
                            <button onClick={this.removeIngredientFromList.bind(this, ingredient.id)} className="btn-xs btn-danger removeItemButton">X</button>
                            &nbsp;&nbsp;<p className="ingredientListItem" ><strong>{ingredient.Ingredient}:</strong> {ingredient.Amount} {ingredient.Measurement}</p>
                        </div>
                    </div>
                )
            })
            return list
        }  else {
            return <p style={{textAlign:"center"}}>Empty...</p>
        }
    }

    addStepsToList(event){
        event.preventDefault();
        var step = {id: this.state.cookingStepId + 1, description: this.state.cookingStep}
        let cookingStep = [...this.state.stepsList, step];
        this.setState({stepsList: cookingStep, cookingStep: "", cookingStepId: this.state.cookingStepId + 1})
    }

    removeStepFromList(stepId){
        this.setState({stepsList: this.state.stepsList.filter(function(item) { 
            return item.id !== stepId
        })})
    }

    displaySteps(){
        if(this.state.stepsList.length > 0){
            const list = this.state.stepsList.map(step => {
                return(
                    <div key={step.order}>
                        <div className="row justify-content-center">
                            <div className="col-lg-8">
                                <div className="stepListItem">
                                    <button onClick={this.removeStepFromList.bind(this, step.id)} className="btn-xs btn-danger removeItemButton">X</button>
                                    &nbsp;	&nbsp;<p className="createRecipeForm-displayCookingSteps">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
            return list
        } else {
            return <p>Empty...</p>
        }
    }

    //Handles which part of form to display (4 parts)
    changeFormStep(step){
        if(this.isFormStageComplete(step - 1)){
            if(step === 1){
                this.setState({step1Display: true, step2Display: false, step3Display: false, step4Display: false, errorMsg:""})
            } else if(step === 2){
                this.setState({step1Display: false, step2Display: true, step3Display: false, step4Display: false, errorMsg:""}) 
            } else if(step === 3){
                this.setState({step1Display: false, step2Display: false, step3Display: true, step4Display: false, errorMsg:""})
            } else if (step === 4){
                this.setState({step1Display: false, step2Display: false, step3Display: false, step4Display: true, errorMsg:""})
            }
        }
    }

    //Function makes sure required fields have data before progressing to next stage of form
    isFormStageComplete(step){
        if(step === 1){
            if(this.state.recipeName.length === 0){
                this.setState({errorMsg: "Add Recipe Name"})
                return false;
            } else if(this.state.cookingTime.length === 0 || this.state.cookingTime < 1 || this.state.cookingTime > 9999){
                this.setState({errorMsg: "Add Cooking Time (1-9999)"})
                return false;
            } else if (this.state.servings < 1 || this.state.servings > 9999){
                this.setState({errorMsg: "Add Servings (1-9999)"})
            } else {
                return true;
            }
        }
        else if(step === 2){
            if(this.state.ingredients.length === 0){
                this.setState({errorMsg: "Add at least 1 Ingredient"});
                return false;
            } else {
                return true;
            }
        }
        else{
            return true;
        }
    }

    //Recipe Details
    renderStep1(){
        if(this.state.step1Display == true){
            return(
                <div className="formStep1">
                    <h5 style={{textAlign:"center"}}>Step 1/4: Recipe Details</h5>
                    <div className="form-group">
                        <input type="hidden" className="form-control" value={this.props.userId}/> 
                    </div>
                    <div className="createRecipeDiv">
                        <button className="btn btn-success" onClick={ () => this.changeFormStep(2) }>Add Ingredients</button> 
                    </div> <br />

                    <p className="errMsg">{this.state.errorMsg}</p>

                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="form-group col-lg-5 col-md-8 col-sm-12">
                                <label>Recipe Name<span className="formRequired">*</span></label>
                                    <input type="text" className="form-control" onChange={this.handleRecipeChange} value={this.state.recipeName} placeholder="Recipe" maxLength="30" required /> 
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="form-group col-lg-5 col-md-8  col-sm-12">
                            <label>Cooking Time (In Minutes)<span className="formRequired">*</span></label>
                                <input type="number" className="form-control" pattern="[0-9]" onChange={this.handleCookingTimeChange} value={this.state.cookingTime} placeholder="60" min="1" max="9999" required /> 
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="form-group col-lg-5 col-md-8  col-sm-12">
                            <label>Servings<span className="formRequired">*</span></label>
                                <input type="number" className="form-control" pattern="[0-9]" onChange={this.handleServingsChange} value={this.state.servings} placeholder="1" min="1" max="9999" required /> 
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="form-group col-lg-5 col-md-8  col-sm-12">
                            <label>Secret Recipe<span className="formRequired">*</span></label> <br />
                                <select className="form-control" value={this.state.secretRecipeDisplay} onChange={this.handleSecretRecipeChange}>
                                    <option>False</option>
                                    <option>True</option>
                                </select>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="form-group col-lg-5 col-md-8  col-sm-12">
                            <label>Description</label>
                                <textarea rows="4" type="text" className="form-control" onChange={this.handleDescriptionChange} value={this.state.description} placeholder="200 Characters or less" maxLength="200"></textarea>
                            </div> 
                        </div>
                    </div>
                </div>
            )
        }
    }

    //Recipe Ingredients
    renderStep2(){
        var ingredientsAdded = this.displayIngredients();

        if(this.state.step2Display == true){
            return(
                <div>
                    <h5 style={{textAlign:"center", marginBottom:"20px"}}>Step 2/4: Add Ingredients</h5>

                    <div className="createRecipeIngredientsDiv">
                        <button className="btn btn-warning formBackButton" onClick={ () => this.changeFormStep(1) }>Back</button> 
                        <button className="btn btn-success" onClick={ () => this.changeFormStep(3) }>Add Steps</button> 
                    </div>

                    <p className="errMsg">{this.state.errorMsg}</p>

                    <form className="formStep2" onSubmit={this.addIngredientToList}>
                        <div className="container">
                            <div className="row">
                                <div className="form-group col-lg-4 col-md-4 col-sm-12">
                                    <label>Ingredient</label>
                                    <input type="text" className="form-control" onChange={this.handleIngredientChange} value={this.state.ingredientName} maxLength="30" required /> 
                                </div>
                                <div className="form-group col-lg-3 col-md-2 col-sm-12">
                                    <label>Amount</label>
                                    <input type="number" className="form-control" onChange={this.handleAmountChange} placeholder="0" value={this.state.ingredientAmount}  min="1" max="9999" required /> 
                                </div>
                                <div className="form-group col-lg-3 col-md-3 col-sm-12">
                                    <label>Measurement</label>
                                    <select className="form-control" onChange={this.handleMeasurementChange}>
                                        {this.state.measurementOptions.map((measurement) => 
                                            <option value={measurement.Measurement_Id} key={measurement.Measurement_Id}>
                                                {measurement.Name}
                                            </option>
                                        )}
                                    </select>
                                </div>
                                <div className="form-group col-lg-1 col-md-2 col-sm-12">
                                    <label>Add</label> <br />
                                    <input type="submit" style={{minWidth: "100%"}} className="btn btn-success form-control" value="+"/>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/*Display ingredients added so far */}
                    <div className="ingredientsAddedDiv">
                        <h4 className="createRecipeForm-ingredientsAddedTitle">Ingredients List for {this.state.recipeName}</h4>
                        <div className="subIngredientsAddedDiv">
                            {ingredientsAdded}
                        </div>
                    </div>

                </div>
            )
        }
    }

    //Recipe Steps
    renderStep3(){
        var stepsList = this.displaySteps();

        if(this.state.step3Display == true){
            return(
                <div>
                    <h5 style={{textAlign:"center", marginBottom:"20px"}}>Step 3/4: Add Steps (optional)</h5>
                    <div className="createRecipeIngredientsDiv">
                        <button className="btn btn-warning formBackButton" onClick={ () => this.changeFormStep(2) }>Back</button> 
                        <button className="btn btn-success" onClick={ () => this.changeFormStep(4) }>Finalize</button> 
                    </div>

                    <form onSubmit={this.addStepsToList}>
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="form-group col-lg-5 col-sm-12">
                                    <label>Step</label>
                                    <textarea className="form-control" onChange={this.handleDCookingStepsChange} rows="3" value={this.state.cookingStep} placeholder="Ex: Dice Onions thinly..." maxLength="500" required></textarea>                                
                                </div>
                                <div className="form-group col-lg-1 col-sm-12">
                                    <label>Add</label> <br />
                                    <input type="submit" className="btn btn-success form-control" value="+"/>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/*Display ingredients added so far */}
                    <div className="container stepsAddedDiv">
                        <div className="row justify-content-center">
                            <h4>Steps List</h4>
                        </div>
                            {stepsList}
                    </div>

                </div>
            )
        }
    }

    //Displays either create recipe or update recipe
    renderCompletionForm(){
        if(this.state.inEditMode === true){
            return(
                <form onSubmit={this.updateRecipe}>
                    <button className="btn btn-warning formBackButton" onClick={ () => this.changeFormStep(3) }>Back</button> 
                    <input type="submit" className="btn btn-success createRecipeButton" value="Update" />
                </form>
            )
        } else{
            return(
                <form onSubmit={this.createRecipe}>
                    <button className="btn btn-warning formBackButton" onClick={ () => this.changeFormStep(3) }>Back</button> 
                    <input type="submit" className="btn btn-success createRecipeButton" value="Create" />
                </form>
            )
        }
    }

    //DIsplay all recipe details and submit
    renderStep4(){
        var renderCompletionForm = this.renderCompletionForm();

        const ingredientList = this.state.ingredients.map(ingredient => {
            return(
                <div key={ingredient.id}>
                    <div className="ingredientsList">
                        <p className="ingredientListItem2" >- {ingredient.Ingredient}: {ingredient.Amount} {ingredient.Measurement}</p>
                    </div>
                </div>
            )
        })

        const stepList = this.state.stepsList.map(step => {
            return(
                <div key={step.order}>
                    <div className="stepListItem">
                        <p className="">- {step.description}</p>
                    </div>
                </div>
            )
        })

        if(this.state.step4Display == true){
            return(
                <div>
                    <h5 style={{textAlign:"center", marginBottom:"20px"}}>Step 4/4: Review</h5>
                    <div className="createRecipeIngredientsDiv">
                        {renderCompletionForm} 
                    </div>

                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-12 createRecipeForm-review">
                                <h5 className="inline-block">Recipe Name:</h5> &nbsp; <h5 className="notBold inline-block"> {this.state.recipeName}</h5>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 createRecipeForm-review">
                                <h5 className="inline-block">Description:</h5> &nbsp; <h5 className="notBold inline-block"> {this.state.description}</h5>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 createRecipeForm-review">
                                <h5 className="inline-block">Cooking Time: </h5> &nbsp; <h5 className="notBold inline-block"> {this.state.cookingTime} Minute(s)</h5>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 createRecipeForm-review">
                                <h5 className="inline-block">Servings: </h5> &nbsp; <h5 className=" notBold inline-block"> {this.state.servings} </h5>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 createRecipeForm-review">
                                <h5 className="inline-block">Secret Recipe: </h5> &nbsp; <h5 className="notBold inline-block"> {this.state.secretRecipeDisplay}</h5>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 createRecipeForm-review">
                                <h5>Ingredients ({this.state.ingredients.length}):</h5><h5 className="notBold"> {ingredientList}</h5>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-lg-12 createRecipeForm-review">
                                <h5>Steps ({this.state.stepsList.length}):</h5><h5 className="notBold createRecipeForm-displayCookingSteps"> {stepList}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    renderExitButon(){
        if(this.state.inEditMode === true){
            return <button class="btn btn-danger" onClick={ () => this.handleExitEditing() }>Exit</button>
        } else {
            return <span></span>
        }
    }

    render() {
        const step1 = this.renderStep1(); //Recipe Details
        const step2 = this.renderStep2(); //Add Ingredients
        const step3 = this.renderStep3(); //Add Steps
        const step4 = this.renderStep4(); //Final Review Submit
        var exitEditingButton = this.renderExitButon();

        return (
            <div>
                <h1 style={{textAlign:"center"}}>{this.state.pageTitle} {exitEditingButton} </h1>
                {step1}
                {step2}
                {step3}
                {step4}
            </div>
        )
    }
}

//map state to props to get state from redux and use in this component
const mapStateToProps = state => ({
    recipe: state.recipe.recipes
})


export default connect(mapStateToProps, {getAllUserRecipes})(withRouter(CreateRecipeForm));