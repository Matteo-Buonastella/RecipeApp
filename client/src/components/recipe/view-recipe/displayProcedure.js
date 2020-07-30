import React, { Component } from 'react'
import {getProcedureByRecipeId} from '../../utils/functions'
import '../../../styles/recipe/view-recipe/displayProcedure.css'

class DisplayProcedure extends Component {
    constructor(props){
        super(props);
        this.state = {
            recipeId: this.props.recipeId,
            procedure: [],
            errors: false,
            errorMessage: ""
        }
    }

    componentDidMount(){
        getProcedureByRecipeId(this.state.recipeId).then((response)=>{
            this.setState({procedure: response.data})
        })
    }

    render() {
        var procedure = this.state.procedure.map((procedure)=>{
            return(
                <div className="col-md-12 col-sm-12" key={procedure.Procedure_Id}>
                    <div className="procedureListDiv">
                        <p className="procedureItemName card-text"><strong>{procedure.Order}:</strong> &nbsp;{procedure.Name} </p> 
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
                                <h3 className="card-title">Procedure</h3>
                                {procedure}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DisplayProcedure;
