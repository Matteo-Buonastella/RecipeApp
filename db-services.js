module.exports = {

    //Gets user by Email or Username and Password
    getUserByNameOrEmailAndPassword:(req,res) => {
        var sql = "select * from users where (Username = (?) Or Email = (?)) And Password = (?)";
        var values = [req.query.username, req.query.username, req.query.password];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getUserById:(req,res) => {
        var sql = "select * from users where User_Id = (?)";
        var value = [req.query.userId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getEmail:(req,res) => {
        var sql = "select * from users where Email = (?)";
        var values = [req.query.email];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getUsername:(req,res) => {
        var sql = "select * from users where Username = (?)";
        var values = [req.query.username];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    addUser: (req,res) => {
        var sql = "insert into users values(default, ?, ?, ?, current_timestamp)"
        var values = [req.body.email, req.body.username, req.body.password];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getAllUserRecipes: (req,res) => {
        var sql = "select * from recipe where User_Id_FK = (?) Order by Name";
        var value = [req.query.userId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getRecipeById: (req,res) => {
        var sql = "Select * from recipe where Recipe_Id = (?)";
        var value = [req.query.recipeId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getIngredientsByRecepieId: (req,res) => {
        var sql = "Select i.*, m.Measurement_Id, m.Name As Measurement_Name from ingredient i JOIN Measurement m ON i.Ingredient_Measurement_Id_FK = m.Measurement_Id AND i.Ingredient_Recipe_Id_FK = (?)";
        var value = [req.query.recipeId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getProcedureByRecipeId: (req,res) => {
        var sql = "Select * from cooking_procedure where Procedure_Recipe_Id_FK = (?)";
        var value = [req.query.recipeId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getMeasurementOptions: (req,res) => {
        var sql = "Select * from measurement Order By Name"
        db.query(sql, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    createRecipe: (req,res) => {
        var sql = "Insert into recipe values (default, ?, ?, ?, ?, ?, ?, null, current_timestamp)"; //Set image to null
        var values = [req.body.userId, req.body.recipeName, req.body.description, req.body.cookingTime, req.body.servings, req.body.secretRecipe];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result)
        })
    },

    updateRecipe: (req,res) => {
        var sql = "Update recipe set Name = (?), Description = (?), Cooking_Time = (?), Servings = (?), Secret_Recipe = (?) Where Recipe_Id = (?)";
        var values = [req.body.recipeName, req.body.description, req.body.cookingTime, req.body.servings, req.body.secretRecipe, req.body.recipeId]
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result)
        })
    },
    
    insertIngredient: (req,res) => {
        var sql = "Insert into ingredient values (default, ?, ?, ?, ?, current_timestamp)";
        var values = [req.body.recipeId, req.body.measurementId, req.body.ingredientName, req.body.amount];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result)
        })
    },

    deleteAllIngredientsByRecipeId: (req,res) => {
        var sql = "Delete from ingredient where Ingredient_Recipe_Id_FK = (?)";
        var value = [req.body.recipeId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result)
        })
    },

    insertCookingProcedure: (req,res) => {
        var sql = "Insert into cooking_procedure values (default, ?, ?, ?, current_timestamp)";
        var values = [req.body.recipeId, req.body.order, req.body.name];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    deleteAllCookingProcedureByRecipeId: (req,res) => {
        var sql = "Delete from cooking_procedure where Procedure_Recipe_Id_FK = (?)";
        var value = [req.body.recipeId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result)
        })
    },

    deleteRecipeById: (req,res) => {
        var sql = "Delete from recipe where Recipe_Id = (?)";
        var value = [req.body.recipeId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    deleteEmailVerificationCodeByEmail: (req,res) => {
        var sql = "Delete from email_verification Where email = (?)";
        var value = [req.body.email];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    createEmailVerificationCode: (req,res) => {
        var sql = "Insert into email_verification values (default, ?, ?)";
        var value = [req.body.email, req.body.verificationCode];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    updatePasswordByEmail: (req,res) => {
        var sql = "Update users set Password = (?) Where Email = (?)";
        var values = [req.body.password, req.body.email];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    searchForRecipeByName: (req,res) => {
        req.query.recipeName = '%' + req.query.recipeName + '%' //Name includeds -> like how Pie would display Apple Pie, Pumpkin Pie etc
        var sql = "Select r.*, u.Username, Count(s.Saved_Recipe_Id_FK) As Saves from recipe r Join users u ON r.User_Id_FK = u.User_Id left outer Join saved_recipe s ON s.Saved_Recipe_Id_FK = r.Recipe_Id Where Name Like (?) AND Secret_Recipe = False Group By s.Saved_Recipe_Id_FK"; 
        var values = [req.query.recipeName];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    searchForRecipebyIngredients: (req,res) => {
        var sql = "Select *, Count(s.Saved_Recipe_Id_FK) As Saves FROM recipe r join ingredient i on i.Ingredient_Recipe_Id_FK = r.Recipe_Id Join users u on r.User_Id_FK = u.User_Id left outer Join saved_recipe s ON s.Saved_Recipe_Id_FK = r.Recipe_Id Where i.Ingredient in (?) And r.Secret_Recipe = false group by r.Recipe_Id HAVING COUNT(DISTINCT i.Ingredient) = (?)"; 
        var values = [req.query.ingredientsList, req.query.ingredientsList.length];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    searchForRecipebyNameAndIngredients: (req,res) => {
        req.query.recipeName = '%' + req.query.recipeName + '%'  //Name includeds -> like how Pie would display Apple Pie, Pumpkin Pie etc
        var sql = "Select *, Count(s.Saved_Recipe_Id_FK) As Saves FROM recipe r join ingredient i on i.Ingredient_Recipe_Id_FK = r.Recipe_Id Join users u on r.User_Id_FK = u.User_Id left outer Join saved_recipe s ON s.Saved_Recipe_Id_FK = r.Recipe_Id Where i.Ingredient in (?) And r.Secret_Recipe = false And r.Name Like (?) group by r.Recipe_Id HAVING COUNT(DISTINCT i.Ingredient) = (?)"; 
        var values = [req.query.ingredientsList, req.query.recipeName, req.query.ingredientsList.length];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    searchAllRecipes: (req,res) => {
        var sql = "Select *, Count(s.Saved_Recipe_Id_FK) As Saves FROM recipe r Join users u on r.User_Id_FK = u.User_Id left outer Join saved_recipe s ON s.Saved_Recipe_Id_FK = r.Recipe_Id Where r.Secret_Recipe = false group by r.Recipe_Id"
        db.query(sql, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getSavedRecipe: (req,res) => {
        var sql = "Select * FROM saved_recipe WHERE Saved_Recipe_Id_FK = (?) And Saved_Recipe_User_Id_FK = (?)";
        var value = [req.query.recipeId, req.query.userId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    saveRecipe:(req,res) => {
        var sql = "Insert Into saved_recipe values (default, ?, ?, current_timestamp)";
        var values = [req.body.recipeId, req.body.userId];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    unsaveRecipe:(req,res) => {
        var sql = "Delete from saved_recipe Where Saved_Recipe_Id = (?)";
        var value = [req.body.savedRecipeId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getMyRecipesAndSavedRecipes: (req,res) => {
        var sql = "Select r.* from recipe r Where r.User_Id_FK = (?) Union All Select r.* from recipe r join saved_recipe s ON r.Recipe_Id = s.Saved_Recipe_Id_FK WHere s.Saved_Recipe_User_Id_FK = (?) Order By Name";
        var values = [req.query.userId, req.query.userId];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result)
        })
    },

    createBugReport: (req,res) => {
        var sql = "Insert into bugs value (default, (?), (?), (?), current_timestamp)";
        var values = [req.body.userId, req.body.title, req.body.description];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result)
        })
    },

    createFeatureRequest: (req,res) => {
        var sql = "Insert into feature_request value (default, (?), (?), (?), current_timestamp)";
        var values = [req.body.userId, req.body.title, req.body.description];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result)
        }) 
    },

    getUserNameAndSavesByRecipeId: (req,res) => {
        var sql = "Select u.Username, Count(s.Saved_Recipe_Id_FK) As Saves FROM users u join recipe r ON u.User_Id = r.User_Id_FK left outer Join saved_recipe s ON s.Saved_Recipe_Id_FK = r.Recipe_Id Where r.Recipe_Id = (?)"
        var value = [req.query.recipeId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result)
        })
    },

    getAllReportRecipeOption: (req, res) => {
        var sql = "Select * from report_recipe_option";
        db.query(sql, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    insertReportRecipe: (req,res) => {
        var sql = "Insert into report_recipe values (default, ?, ?, ?, ?, current_timestamp)";
        var values = [req.body.recipeId, req.body.reportOptionsId, req.body.userId, req.body.description];
        db.query(sql, values, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    },

    getDidUserAlreadyReportRecipe: (req,res) => {
        var sql = "Select * from report_recipe where Report_Recipe_Recipe_Id_FK = (?) AND Report_Recipe_By_User_Id_FK = (?)";
        var value = [req.query.recipeId, req.query.userId];
        db.query(sql, value, function(err,result){
            if(err) throw err;
            res.send(result);
        })
    }

}