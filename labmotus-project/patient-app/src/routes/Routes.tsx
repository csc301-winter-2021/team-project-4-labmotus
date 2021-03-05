import React, {FunctionComponent, ReactElement, useContext, useEffect} from "react";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import SymptomLogPage from "../pages/SymptomLogPage";
import NavigationBar from "../components/NavigationBar";
import {home, settings, videocam} from "ionicons/icons";
import SettingsPage from "../pages/SettingsPage";
import LoginPage from "../pages/LoginPage";
import {APIContext} from "../api/API";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SignupPage from "../pages/SignupPage";

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
    const API = useContext(APIContext);
    const history = useHistory();

    useEffect(() => {
        API.addLoginListener(onLoginChange);
        return () => {
            API.removeLoginListener(onLoginChange);
        }
    }, [API]);

    function onLoginChange(loggedIn: boolean) {
        history.push(loggedIn ? '/home' : '/login');
    }

    function generateRedirect(): ReactElement {
        return <Redirect exact from="/" to="/login"/>;
    }

    return (<>
        <Switch>
            <Route exact path="/login" render={() => <LoginPage/>}/>
            <Route exact path="/home" render={() => <SymptomLogPage/>}/>
            <Route exact path="/settings" render={() => <SettingsPage/>}/>
            <Route exact path="/forgot-password" render={() => <ForgotPasswordPage/>}/>
            <Route exact path="/sign-up" render={() => <SignupPage/>}/>
            {generateRedirect()}
        </Switch>
        <NavigationBar entries={navigationEntries}/>
    </>);
};

export default Routes;
