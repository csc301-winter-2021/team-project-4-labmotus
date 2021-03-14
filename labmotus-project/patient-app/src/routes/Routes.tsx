import React, {FunctionComponent, ReactElement, useContext, useEffect} from "react";
import {Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import SymptomLogPage from "../../../common/ui/pages/SymptomLogPage";
import NavigationBar from "../components/NavigationBar";
import {barChart, home, settings} from "ionicons/icons";
import SettingsPage from "../pages/SettingsPage";
import EditEmailPage from "../pages/EditEmailPage";
import EditPhonePage from "../pages/EditPhonePage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import LoginPage from "../pages/LoginPage";
import API, {getAPIContext} from "../api/API";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SignupPage from "../pages/SignupPage";
import VideoRecordingPage from "../pages/VideoRecordingPage";
import AssessmentPage from "../../../common/ui/pages/AssessmentPage";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
// @ts-ignore
import styled from 'styled-components';
import TermsOfServicePage from "../../../common/ui/pages/TermsOfServicePage";
import {PatientTermsOfServiceContent} from "../components/PatientTermsOfServiceContent";
import {Moment} from "moment/moment";
import {Assessment} from "../../../common/types";

export interface RoutesProps {
}

const navigationEntries = [
    {
        icon: home,
        name: "Home",
        navigation: "/home",
    },
    {
        icon: barChart,
        name: "Assessment",
        navigation: "/assessment",
    },
    {
        icon: settings,
        name: "Settings",
        navigation: "/settings",
    },
];

const loggedInPaths = ["/", "/home", "/assessment", "/settings/*", "/record", "/terms-of-service"];
const loggedOutPaths = ["/", "/login", "/sign-up", "/forgot-password", "/terms-of-service"];

const Routes: FunctionComponent<RoutesProps> = ({}) => {
    const UseAPI: API = useContext(getAPIContext());
    const history = useHistory();
    const location = useLocation();
    const theme = useContext(getThemeContext());

    useEffect(() => {
        UseAPI.addLoginListener(onLoginChange);
        return () => {
            UseAPI.removeLoginListener(onLoginChange);
        };
    }, [UseAPI]);

    function onLoginChange(loggedIn: boolean) {
        if (loggedIn) {
            if (!loggedOutPaths.every((path) => !location.pathname.startsWith(path))) {
                history.push("/home");
            }
        } else {
            if (!loggedInPaths.every((path) => !location.pathname.startsWith(path))) {
                history.push("/login");
            }
        }
    }

    function generateRedirect(): ReactElement {
        return <Redirect exact from="/" to="/login"/>;
    }

    function getAssessments(week: Moment): Promise<Assessment[]> {
        return UseAPI.getCurrUsersAssessments(week)
    }

    return (
        <BackgroundDiv theme={theme}>
            <Switch>
                <Route exact path="/login" render={() => <LoginPage/>}/>
                <Route exact path="/home/:date?" render={() =>
                    <SymptomLogPage baseUrl="/home" getAssessments={getAssessments}/>
                }/>
                <Route exact path="/assessment/:date?" render={() =>
                    <AssessmentPage getAssessments={getAssessments}/>
                }/>
                <Route exact path="/settings" render={() => <SettingsPage/>}/>
                <Route exact path="/settings/edit-email" render={() => <EditEmailPage/>}/>
                <Route exact path="/settings/edit-phone" render={() => <EditPhonePage/>}/>
                <Route exact path="/settings/change-password" render={() => <ChangePasswordPage/>}/>
                <Route exact path="/record/:id" render={() => <VideoRecordingPage/>}/>
                <Route exact path="/forgot-password" render={() => <ForgotPasswordPage/>}/>
                <Route exact path="/sign-up" render={() => <SignupPage/>}/>
                <Route exact path="/terms-of-service" render={() =>
                    <TermsOfServicePage
                        getTermsOfService={() => {
                            return <PatientTermsOfServiceContent/>
                        }}
                    />
                }/>
                {generateRedirect()}
            </Switch>
            <NavigationBar entries={navigationEntries}/>
        </BackgroundDiv>
    );
};

const BackgroundDiv = styled.div`
    background-color: ${({theme}: { theme: Theme }) => theme.colors.background};
    width: 100%;
    height: 100%;
`;

export default Routes;
