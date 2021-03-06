import React, {FunctionComponent, ReactElement, useContext, useEffect} from "react";
import {Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import SymptomLogPage from "../pages/SymptomLogPage";
import NavigationBar from "../components/NavigationBar";
import {barChart, home, settings} from "ionicons/icons";
import SettingsPage from "../pages/SettingsPage";
import LoginPage from "../pages/LoginPage";
import {APIContext} from "../api/API";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SignupPage from "../pages/SignupPage";
import VideoRecordingPage from "../pages/VideoRecordingPage";
import AssessmentPage from "../pages/AssessmentPage";

export interface RoutesProps {
}

const navigationEntries = [
    {
        icon: home,
        name: "Home",
        navigation: "/home"
    },
    {
        icon: barChart,
        name: "Assessment",
        navigation: "/assessment"
    },
    {
        icon: settings,
        name: "Settings",
        navigation: "/settings"
    }
];

const loggedInPaths = ["/", "/home", "/assessment", "/settings", "/record"];
const loggedOutPaths = ["/", "/login", "/sign-up", "/forgot-password"];


const Routes: FunctionComponent<RoutesProps> = ({}) => {
    const API = useContext(APIContext);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        API.addLoginListener(onLoginChange);
        return () => {
            API.removeLoginListener(onLoginChange);
        }
    }, [API]);

    function onLoginChange(loggedIn: boolean) {
        if (loggedIn) {
            if (!loggedOutPaths.every(path => !location.pathname.startsWith(path))) {
                history.push('/home')
            }
        } else {
            if (!loggedInPaths.every(path => !location.pathname.startsWith(path))) {
                history.push('/login')
            }
        }
    }

    function generateRedirect(): ReactElement {
        return <Redirect exact from="/" to="/login"/>;
    }

    return (<>
        <Switch>
            <Route exact path="/login" render={() => <LoginPage/>}/>
            <Route exact path="/home/:date?" render={() => <SymptomLogPage/>}/>
            <Route exact path="/assessment/:date?" render={() => <AssessmentPage/>}/>
            <Route exact path="/settings" render={() => <SettingsPage/>}/>
            <Route exact path="/record/:id" render={() => <VideoRecordingPage/>}/>
            <Route exact path="/forgot-password" render={() => <ForgotPasswordPage/>}/>
            <Route exact path="/sign-up" render={() => <SignupPage/>}/>
            {generateRedirect()}
        </Switch>
        <NavigationBar entries={navigationEntries}/>
    </>);
};

export default Routes;
