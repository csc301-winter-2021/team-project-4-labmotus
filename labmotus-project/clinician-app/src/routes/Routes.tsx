import {FunctionComponent, ReactElement, useContext, useEffect} from "react";
import {Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";

import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import TermsOfServicePage from "../../../common/ui/pages/TermsOfServicePage";
import {ClinicianTermsOfServiceContent} from "../components/ClinicianTermsOfServiceContent";
import API, {getAPIContext} from "../api/API";
import AllPatientsPage from "../pages/AllPatientsPage";
import PatientProfilePage from "../pages/PatientProfilePage";
import FinalizeSignupPage from "../pages/FinalizeSignupPage";
import SignupPatientPage from "../pages/SignupPatientPage";
import LandingPage from "../pages/LandingPage";
import SettingsPage from "../pages/SettingsPage";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import {home, settings} from "ionicons/icons";
// @ts-ignore
import styled from 'styled-components';
import NavigationBar from "../../../common/ui/components/NavigationBar";
import AssessmentPage from "../pages/AssessmentPage";

export interface RoutesProps {
}

const loggedInPaths = ["/home", "/assessment", "/settings/*", "/terms-of-service", "/sign-up-patients", "/patients/*"];
const loggedOutPaths = ["/landing", "/login", "/sign-up", "/forgot-password", "/terms-of-service"];

const navigationEntries = [
    {
        icon: home,
        name: "Home",
        navigation: "/home",
    },
    {
        disabled: true,
        navigation: "/patients",
    },
    {
        icon: settings,
        name: "Settings",
        navigation: "/settings",
    },
];

const Routes: FunctionComponent<RoutesProps> = ({}) => {
    const UseAPI: API = useContext(getAPIContext());
    const history = useHistory();
    const location = useLocation();
    const theme = useContext(getThemeContext());

    useEffect(() => {

    }, [location]);

    useEffect(() => {
        UseAPI.addLoginListener(onLoginChange);
        return () => {
            UseAPI.removeLoginListener(onLoginChange);
        };
    }, [UseAPI]);

    function onLoginChange(loggedIn: boolean) {
        const params = new URLSearchParams(location.search);
        if (params.has("mode")) {
            switch (params.get("mode")) {
                case "signIn":
                    history.push(`finalize-sign-up${location.search}`);
                    return;
            }
        }
        if (loggedIn) {
            if (!loggedOutPaths.every((path) => !location.pathname.startsWith(path))) {
                history.push("/home");
                return;
            }
        } else {
            if (!loggedInPaths.every((path) => !location.pathname.startsWith(path))) {
                history.push("/login");
                return;
            }
        }
        if (location.pathname === '/') {
            history.push(loggedIn ? loggedInPaths[0] : loggedOutPaths[0])
        }
    }

    function generateRedirect(): ReactElement {
        return <Redirect exact from="/" to="/landing"/>;
    }

    return (
        <BackgroundDiv theme={theme}>
            <PageDiv>
                <Switch>
                    <Route exact path="/landing" render={() => <LandingPage/>}/>
                    <Route exact path="/login" render={() => <LoginPage/>}/>
                    <Route exact path="/home" render={() => <AllPatientsPage/>}/>
                    <Route exact path="/forgot-password" render={() => <ForgotPasswordPage/>}/>
                    <Route exact path="/sign-up" render={() => <SignupPage/>}/>
                    <Route exact path="/finalize-sign-up" render={() => <FinalizeSignupPage/>}/>
                    <Route exact path="/terms-of-service"
                           render={() => <TermsOfServicePage getTermsOfService={() => {
                               return <ClinicianTermsOfServiceContent/>
                           }}/>}
                    />
                    <Route exact path="/patients/:patientId/:date?" render={() => <PatientProfilePage/>}/>
                    <Route exact path="/patients/:patientId/assessment/:date?" render={() => <AssessmentPage/>}/>
                    <Route exact path="/sign-up-patient" render={() => <SignupPatientPage/>}/>
                    <Route exact path="/settings" render={() => <SettingsPage/>}/>
                    {generateRedirect()}
                </Switch>
            </PageDiv>
            <NavigationBar entries={navigationEntries}/>
        </BackgroundDiv>
    );
};

const BackgroundDiv = styled.div`
  background-color: ${({theme}: { theme: Theme }) => theme.colors.background};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .navigation-bar {
    flex: unset;
  }
`;

const PageDiv = styled.div`
  position: relative;
  flex: 1;
`;

export default Routes;
