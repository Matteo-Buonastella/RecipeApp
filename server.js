const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

const {getUserByNameOrEmailAndPassword, getUserById, getEmail, getUsername, addUser, getAllUserRecipes, getRecipeById, getIngredientsByRecepieId,
  getProcedureByRecipeId, getMeasurementOptions, createRecipe, insertIngredient, deleteAllIngredientsByRecipeId, insertCookingProcedure,
  deleteRecipeById, updateRecipe, deleteAllCookingProcedureByRecipeId, deleteEmailVerificationCodeByEmail, getSavedRecipe, saveRecipe,
  unsaveRecipe, createEmailVerificationCode, updatePasswordByEmail, searchForRecipeByName, searchForRecipebyIngredients, 
  searchForRecipebyNameAndIngredients, searchAllRecipes, getMyRecipesAndSavedRecipes, createBugReport, createFeatureRequest} = require('./db-services.js');

//Get Requests
app.get('/getUserByNameOrEmailAndPassword', getUserByNameOrEmailAndPassword);
app.get('/getUserById', getUserById);
app.get('/getEmail', getEmail);
app.get('/getUsername', getUsername);
app.get('/getAllUserRecipes', getAllUserRecipes);
app.get('/getRecipeById', getRecipeById);
app.get('/getIngredientsByRecepieId', getIngredientsByRecepieId);
app.get('/getProcedureByRecipeId', getProcedureByRecipeId);
app.get('/getMeasurementOptions', getMeasurementOptions);
app.get('/searchForRecipeByName', searchForRecipeByName);
app.get('/searchForRecipebyIngredients', searchForRecipebyIngredients);
app.get('/searchForRecipebyNameAndIngredients', searchForRecipebyNameAndIngredients);
app.get('/searchAllRecipes', searchAllRecipes);
app.get('/getSavedRecipe', getSavedRecipe);
app.get('/getMyRecipesAndSavedRecipes', getMyRecipesAndSavedRecipes)

//Post Requests
app.post('/addUser', addUser);
app.post('/createRecipe', createRecipe);
app.post('/updateRecipe', updateRecipe)
app.post('/insertIngredient', insertIngredient);
app.post('/deleteAllIngredientsByRecipeId', deleteAllIngredientsByRecipeId);
app.post('/insertCookingProcedure', insertCookingProcedure);
app.post('/deleteAllCookingProcedureByRecipeId', deleteAllCookingProcedureByRecipeId);
app.post('/deleteRecipeById', deleteRecipeById);
app.post('/deleteEmailVerificationCodeByEmail', deleteEmailVerificationCodeByEmail);
app.post('/createEmailVerificationCode', createEmailVerificationCode);
app.post('/updatePasswordByEmail', updatePasswordByEmail);
app.post('/saveRecipe', saveRecipe);
app.post('/unsaveRecipe', unsaveRecipe);
app.post('/createBugReport', createBugReport);
app.post('/createFeatureRequest', createFeatureRequest);


//Email Requests
//app.post('/sendWelcomeEmail', sendWelcomeEmail)

var transporter = nodemailer.createTransport({
  service: 'hotmail',
  secure: false,
  auth: {
         user: 'mbuonastella@myseneca.ca',
         pass: 'Napoli8!'
     }
 });

app.post('/sendWelcomeEmail', (req, res) => {
  const welcomeEmail = {
      from: 'mbuonastella@myseneca.ca', // sender address
      to: req.body.email,
      subject: 'Thanks for Signing Up', // Subject line
      text: 'We at Recipes Online would like to welcome you. Enjoy storying your recipes online for FREE'// plain text body
  };
  transporter.sendMail(welcomeEmail, function (err, info) {
      if(err){
        //console.log(err)
        res.end()
      }
      else{
        //console.log(info);
        res.end()
      }
   });
});

app.post('/sendEmailVerificationCode', (req, res) => {
  const welcomeEmail = {
      from: 'mbuonastella@myseneca.ca', // sender address
      to: req.body.email,
      subject: 'Verification Code', // Subject line
      text: 'Please use the following verification code to confirm your email: ' + req.body.verificationCode// plain text body
  };
  transporter.sendMail(welcomeEmail, function (err, info) {
      if(err){
        res.end()
      }
      else{
        res.end()
      }
   });
});

//DB Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'looser11',
    database: 'recipes'
  });

  db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
    });

    global.db = db;

const port = 5000;
app.listen(port, () => console.log('Server started on port 5000'));