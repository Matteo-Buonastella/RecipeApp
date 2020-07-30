import {GET_USER, GET_USER_BY_ID, RESET_USER} from '../actions/types';

const initialState = {
    user: [] //Stores all user data
}

export default function(state = initialState, action){
    switch(action.type){
        case GET_USER:
            return {
                ...state,
                user: action.payload
            };
        case GET_USER_BY_ID:
            return {
                ...state,
                user: action.payload
            };
        case RESET_USER:
            return {
                ...state,
                user: []
            }
        default:
            return state;
    }
}