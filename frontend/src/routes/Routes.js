import React from "react";
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

import {isAuthenticated} from "../services/auth";
import Login from "../components/Login";
import Register from "../components/Register";
import Home from "../components/Home";
import Update from "../components/Update";
import Senha from "../components/Senha";

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{pathname: "/"}}/>
            )
        }
    />
);

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Login}/>
            <Route exact path='/register' component={Register}/>
            <PrivateRoute path='/home' component={Home}/>
            <PrivateRoute path='/your_data' component={Update}/>
            <PrivateRoute path='/your_data_pass' component={Senha}/>
        </Switch>
    </BrowserRouter>
);

export default Routes;