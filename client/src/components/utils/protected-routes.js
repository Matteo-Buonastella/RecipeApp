//This component protects other components from being access from unauthorized users. Use this components if you only
//want to allow access to athenticated (Logged in) users.
//Example: <ProtectedRoute path ="/home" component={Home} />

import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Authenticated from './authentication'

export const ProtectedRoute = ({component: Component, ...rest}) => {
    return(
        <Route 
            {...rest} 
            render={props => {
                if(Authenticated.isAuthenticated()){
                    return<Component {...props} /> 
                }
                //User is not logged in, return to landing page
                else{
                    return <Redirect to={
                        {
                            pathname: "/",
                            state: {
                                from: props.location
                            }
                        }
                    }/>
                }
            }}
        />
    );
}