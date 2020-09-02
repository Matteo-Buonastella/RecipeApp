import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {ProtectedRoute} from './components/utils/protected-routes'
import { PersistGate } from 'redux-persist/integration/react'
import LandingPage from './components/landingPage'
import Index from './components/recipe/main/index'
import Register from './components/register/register'
import ViewRecipe from './components/recipe/view-recipe/index'
import ViewRecipeNotLoggedIn from './components/recipe/view-recipe/viewRecipeNotLoggedIn'
import CreateRecipe from './components/recipe/create-recipe/index'
import ResetPassword from './components/account/reset-password/index'
import Discover from './components/recipe/discover/index'
import Bug from './components/user/bug/index'
import FeatureRequest from './components/user/feature-request/index'
import ReportRecipe from './components/account/report/report-recipe/index'

import {Provider} from 'react-redux'; //Wraps everything insider provider //
import {store, persistor} from './store';


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
            <div className="App">
              <Switch>
                <Route exact path ="/" component={LandingPage} /> 
                <ProtectedRoute path ="/Home" component={Index} />
                <Route path ="/Register" component={Register} />
                <ProtectedRoute path ="/ViewRecipe/:recipeId" component={ViewRecipe} />
                <Route path ="/NoAccount_ViewRecipe/:recipeId" component={ViewRecipeNotLoggedIn} />
                <ProtectedRoute path ="/CreateRecipe" component={CreateRecipe} />
                <ProtectedRoute path ="/EditRecipe" component={CreateRecipe} />
                <Route path ="/ResetPassword" component={ResetPassword} />
                <Route path ="/Discover" component={Discover} />
                <ProtectedRoute path ="/ReportBug" component={Bug} />
                <ProtectedRoute path ="/FeatureRequest" component={FeatureRequest} />
                <ProtectedRoute path ="/ReportRecipe" component={ReportRecipe} />

                <Route  path ="/*" component={() => "Error 404 Page Not Found"} />
              </Switch>
            </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
