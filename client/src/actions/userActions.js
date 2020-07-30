import axios from 'axios';
import {GET_USER, GET_USER_BY_ID, RESET_USER} from './types';

export const getUser = (request) => dispatch => {
    axios.get('/getUser', request)
    .then((user) => dispatch({
        type: GET_USER,
        payload: user.data
    }))
}

export const getUserById = (request) => dispatch => {
    axios.get('/getUserById', request)
    .then((user) => dispatch({
        type: GET_USER_BY_ID,
        payload: user.data
    }))
}

export const resetUser = () => dispatch => {
    dispatch({
        type: RESET_USER,
        payload: []
    })
}

