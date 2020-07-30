import axios from 'axios';
import {GET_USER_RECIPES, RESET_RECIPES} from './types';

export const getAllUserRecipes = (userId) => dispatch => {
    var request = {
        params:{
            userId: userId
        }
    }
    axios.get('/getMyRecipesAndSavedRecipes', request)
    .then((recipes) => dispatch({
        type: GET_USER_RECIPES,
        payload: recipes.data
    }))
}

export const resetRecipes = () => dispatch => {
    dispatch({
        type: RESET_RECIPES,
        payload: []
    })
}