import React, { Component } from 'react'
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'react-bootstrap';

class FilterResult extends Component {
    constructor(props){
        super(props);
        this.state = {
            dropdownOpen: true,
            toggle:true
        }
    }

    handleNewest = (event) => {
        event.preventDefault();
        this.props.filterRecipes("Newest")
    }

    handleOldest = (event) => {
        event.preventDefault();
        this.props.filterRecipes("Oldest")
    }

    handleMostSaved = (event) => {
        event.preventDefault();
        this.props.filterRecipes("Most Saved")
    }

    render() {
        return (
            <div>
               <Dropdown>
                    <Dropdown.Toggle variant="default" id="dropdown-basic">
                        Sort By
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={this.handleNewest}>Newest</Dropdown.Item>
                        <Dropdown.Item onClick={this.handleOldest} >Oldest</Dropdown.Item>
                        <Dropdown.Item onClick={this.handleMostSaved} >Most Saved</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }
}

export default FilterResult

