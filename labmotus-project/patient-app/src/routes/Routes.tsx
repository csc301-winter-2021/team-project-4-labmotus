import React, {FunctionComponent} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import SymptomLogPage from "../pages/SymptomLogPage";

export interface RoutesProps {
}

const Routes: FunctionComponent<RoutesProps> = ({}) => {
    return (<Router>
        <Switch>
            <Route exact path="/home" render={() => <SymptomLogPage/>}/>
            <Redirect from="/" to="/home"/>
        </Switch>
    </Router>);
};

export default Routes;
