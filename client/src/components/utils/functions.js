import axios from 'axios';

export function getRecipeById(recipeId){
    return new Promise(function(resolve,reject){
        var request = {
            params:{
                recipeId: recipeId,
            }
        }
        axios.get('/getRecipeById', request).then((response)=>{
            if (response.data.length === 0){
                reject("Error 404, Recipe Not found")
            } else{
                resolve(response);
            }
        })
    })
}

export function getIngredientsByRecepieId(recipeId){
    return new Promise(function(resolve,reject){
        var request = {
            params:{
                recipeId: recipeId,
            }
        }
        axios.get('/getIngredientsByRecepieId', request).then((response)=>{
            if (response.data.length === 0){
                reject("Error 404, Ingredients for Recipe Not found")
            } else{
                resolve(response);
            }
        })
    })
}

//Cooking procedure is OPTIONAL, so empty result is fine
export function getProcedureByRecipeId(recipeId){
    return new Promise(function(resolve,reject){
        var request = {
            params:{
                recipeId: recipeId,
            }
        }
        axios.get('/getProcedureByRecipeId', request).then((response)=>{
            resolve(response);
        })
    })
}

export function getSavedRecipe(userId, recipeId){
    return new Promise(function(resolve,reject){
        var query = {
            params:{
                userId: userId,
                recipeId: recipeId,
            }
        }
        axios.get('/getSavedRecipe', query).then((response)=>{
            resolve(response);
        })
    })
}

export function getUserNameAndSavesByRecipeId(recipeId){
    return new Promise(function(resolve,reject){
        var query = {
            params: {
                recipeId: recipeId
            }
        }
        axios.get('/getUserNameAndSavesByRecipeId', query).then((response)=>{
            resolve(response);
        })
    })
}

//Function recieves an array objects of ingredients
export function insertIngredient(recipeId, ingredients){
    return new Promise(function(resolve,reject){
        ingredients.map(ingredient => {
            var ingredientDetail = {
                recipeId: recipeId,
                measurementId: ingredient.MeasurementId,
                ingredientName: ingredient.Ingredient,
                amount: ingredient.Amount
            }
            axios.post('/insertIngredient', ingredientDetail).then((response)=>{})
        })
        resolve();
    })
}

export function deleteAllIngredientsFromRecipe(recipeId){
    return new Promise(function(resolve,reject){
            var ingredientDetail = {
                recipeId: recipeId
            }
            axios.post('/deleteAllIngredientsByRecipeId', ingredientDetail).then((response)=>{})
        resolve();
    })
}

export function insertSteps(recipeId, stepsList){
    return new Promise(function(resolve,reject){
        stepsList.map(step => {
            var cookingStepsDetails = {
                recipeId: recipeId,
                order: step.id,
                name: step.description
            }
            axios.post('/insertCookingProcedure', cookingStepsDetails).then((response)=>{})
        })
        resolve();
    })
}

export function deleteAllStepsFromRecipe(recipeId){
    return new Promise(function(resolve,reject){
            var stepDetail = {
                recipeId: recipeId
            }
            axios.post('/deleteAllCookingProcedureByRecipeId', stepDetail).then((response)=>{})
        resolve();
    })
}

export function deleteRecipe(recipeId){
    return new Promise(function(resolve,reject){
        var data = {
            recipeId: recipeId
        }
        axios.post('/deleteRecipeById', data).then((response)=>{
            resolve();
        }).catch((exception)=>{
            reject(exception)
        })
    })
}

export function doesEmailAlreadyExist (email){
    return new Promise(function(resolve,reject){
        var request = {
            params:{
                email: email
            }
        }
         axios.get('/getEmail', request).then((user)=>{
            if(user.data.length === 0){
                resolve(false);
            }
            else{
                reject("Error, email already exists");
            }
        })
    });
}

export function doesEmailExist (email){
    return new Promise(function(resolve,reject){
        var request = {
            params:{
                email: email
            }
        }
         axios.get('/getEmail', request).then((user)=>{
            if(user.data.length === 1){
                resolve(false);
            }
            else{
                reject("Error, email doesn't exist");
            }
        })
    });
}

export function updatePasswordByEmail(email,password){
    return new Promise(function(resolve,reject){
        var data = {
            email: email,
            password: password
        }
        axios.post('/updatePasswordByEmail', data).then((response)=>{
            resolve();
        }).catch((exception)=>{
            reject(exception)
        })
    })
}


