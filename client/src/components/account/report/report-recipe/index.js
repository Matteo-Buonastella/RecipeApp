import React, { Component } from 'react'
import Navbar from '../../../navbar/navbar'
import '../../../../styles/account/report/report-recipe/reportRecipe.css'
import axios from 'axios';

class ReportRecipe extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId: this.props.location.state.userId,
            recipeId: this.props.location.state.recipeId,
            reportOptions: [],
            reportOptionsId: 1,
            description: "",
            hasUserAlreadyReported: false,
            loaded: false
        }
    }

    componentDidMount(){
        try{
            if(this.props.location.state.recipeId > 0){
                //Get the report options for dropdown
                axios.get('/getAllReportRecipeOption').then((response)=>{
                    this.setState({reportOptions: response.data});
                })

                var data = {
                    params: {
                        userId: this.state.userId,
                        recipeId: this.state.recipeId
                    }
                }
                //Set flag if user has already reported the recipe
                axios.get('/getDidUserAlreadyReportRecipe', data).then((response)=>{
                    if(response.data.length > 0){
                        this.setState({hasUserAlreadyReported: true})
                    }
                    this.setState({loaded:true})
                })
                
            } 
        } catch(e){
            //Data is not defined. User probably went to report page using URL and not from button. Redirect to home
            this.props.history.push("/Home")
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        var data = {
            recipeId: this.state.recipeId,
            reportOptionsId: this.state.reportOptionsId,
            userId: this.state.userId,
            description: this.state.description
        }
        axios.post('/insertReportRecipe', data).then((response)=>{
            this.props.history.push("/Home")
        }).catch((err)=>{
            //Error
            this.props.history.push("/Home")
        })
    }

    handleReportOptionsChange = event => {
        this.setState({reportOptionsId: parseInt(event.target.value)});
    }

    handleDescriptionChange = event => {
        this.setState({description: event.target.value});
    }

    //Only render the description textbox if Other is chosen (has id of 999)
    renderDescriptionTextbox(){
        if(this.state.reportOptionsId === 999){
            return (
                <div className="row justify-content-center">
                    <div className="form-group col-lg-5 col-md-8 col-sm-12">
                        <input type="text" className="form-control" placeholder="Description" onChange={this.handleDescriptionChange} maxLength="200" required />
                    </div>
                </div>
            )
        }
    }

    renderReportRecipeProcedure(){
        console.log(this.state.hasUserAlreadyReported)
        //User has not reported recipe before  
        if(this.state.hasUserAlreadyReported == false){   
            var descriptionTextbox = this.renderDescriptionTextbox(); 
            return(
                <div className="container">
                    <h3 style={{textAlign:"center", marginBottom:"30px"}}>Report the following Recipe</h3>
                    <div className="row justify-content-center">
                        <p className="ReportRecipe-title">Recipe Name: <strong> {this.props.location.state.recipe.Name} </strong></p>
                    </div>
                    <div className="row justify-content-center">
                        <p className="ReportRecipe-title">From: <strong> {this.props.location.state.username} </strong></p>
                    </div>

                    < br />

                    <form onSubmit={this.handleSubmit}>
                        <div className="row justify-content-center">
                            <div className="form-group col-lg-5 col-md-8 col-sm-12">
                                <label>Reason for Reporting</label>
                                <select className="form-control" onChange={this.handleReportOptionsChange}>
                                    {this.state.reportOptions.map((reason) => 
                                        <option value={reason.Report_Recipe_Option_Id} key={reason.Report_Recipe_Option_Id}>
                                            {reason.Description}
                                        </option>
                                    )}
                                </select>
                            </div>
                        </div>

                        {descriptionTextbox}
                        
                        <div className="row justify-content-center">
                            <div className="form-group col-lg-2 col-md-4 col-sm-12">
                                <input type="submit" className="form-control btn btn-danger" value="Report"/>
                            </div>
                        </div>
                    </form>
                </div>
            )       
        } 
    }

    renderUserAlreadyReportedRecipe(){
        if(this.state.hasUserAlreadyReported == true){ 
            return (
            <div className="container">
                <h3 style={{textAlign:"center", marginBottom:"30px"}}>Report the following Recipe</h3>
                <div className="row justify-content-center">
                    <p className="ReportRecipe-title">Recipe Name: <strong> {this.props.location.state.recipe.Name} </strong></p>
                </div>
                <div className="row justify-content-center">
                    <p className="ReportRecipe-title">From: <strong> {this.props.location.state.username} </strong></p>
                </div>

                < br />
                <div className="row justify-content-center">
                    <h4> <i>You have already reported this recipe</i> </h4>
                </div>
            </div>
            )
        }
    }

    render() {
        if(this.state.loaded == false) return null;
        
        var renderReportRecipeProcedure = this.renderReportRecipeProcedure();
        var renderUserAlreadyReportedRecipe = this.renderUserAlreadyReportedRecipe();

        return (
            <div>
                <Navbar />
                {renderReportRecipeProcedure}
                <div style={{marginTop: "30px"}}>
                    {renderUserAlreadyReportedRecipe}
                </div>
                
            </div>
        )
    }
}

export default ReportRecipe
