import React, {FunctionComponent} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import SymptomLogPage from "../pages/SymptomLogPage";
import NavigationBar from "../components/NavigationBar";
import {home, settings, videocam} from "ionicons/icons";

export interface RoutesProps {
}

const navigationEntries = [
    {
        icon: home,
        name: "Home",
        navigation: "/home"
    },
    {
        icon: videocam,
        name: "Record",
        navigation: "/record"
    },
    {
        icon: settings,
        name: "Settings",
        navigation: "/settings"
    }
];


const Routes: FunctionComponent<RoutesProps> = ({}) => {
    return (<Router>
        <Switch>
            <Route exact path="/home" render={() => <SymptomLogPage/>}/>
            <Redirect exact from="/" to="/home"/>
        </Switch>
        <NavigationBar entries={navigationEntries}/>
    </Router>);
};

export default Routes;
