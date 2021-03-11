import React, {FunctionComponent, ReactElement, useContext, useEffect} from "react";
import {Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";

import API, {getAPIContext} from "../../../patient-app/src/api/API";

import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import TermsOfServicePage from "../../../common/ui/pages/TermsOfServicePage";
import {ClinicianTermsOfServiceContent} from "../components/ClinicianTermsOfServiceContent";

export interface RoutesProps {}

const loggedInPaths = ["/", "/home", "/assessment", "/settings/*", "/record", "/terms-of-service"];
const loggedOutPaths = ["/", "/login", "/sign-up", "/forgot-password", "/terms-of-service"];

const Routes: FunctionComponent<RoutesProps> = ({}) => {
    const UseAPI: API = useContext(getAPIContext());
    const history = useHistory();
    const location = useLocation();

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
        return <Redirect exact from="/" to="/login" />;
    }

    return (
        <>
            <Switch>
                <Route exact path="/login" render={() => <LoginPage />} />
                <Route exact path="/forgot-password" render={() => <ForgotPasswordPage />} />
                <Route exact path="/sign-up" render={() => <SignupPage />} />
                <Route exact path="/terms-of-service"
                       render={() => <TermsOfServicePage getTermsOfService={() => {return <ClinicianTermsOfServiceContent />}} />}
                />
                {generateRedirect()}
            </Switch>
        </>
    );
};

export default Routes;
