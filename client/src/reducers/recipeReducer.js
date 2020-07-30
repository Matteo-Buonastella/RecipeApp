import {GET_USER_RECIPES, RESET_RECIPES} from '../actions/types';

const initialState = {
    recipes: [] //Stores all recipes from user
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_USER_RECIPES:
            return {
                ...state,
                recipes: action.payload
            };
        case RESET_RECIPES:
            return {
                ...state,
                recipes: []
            };
        default:
            return state;
    }
}