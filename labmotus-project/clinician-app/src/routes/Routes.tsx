import {FunctionComponent, ReactElement, useContext, useEffect} from "react";
import {Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";

import ForgotPasswordPage from "../../../common/ui/pages/ForgotPasswordPage";
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
import AssessmentPage from "../pages/AssessmentPage";
import { Assessment, AssessmentState } from "../../../common/types/types";
import { Moment } from "moment";

export interface RoutesProps {
}

const loggedInPaths = ["/home", "/assessment", "/settings/*", "/record", "/terms-of-service", "/sign-up-patients", "/patients/*"];
const loggedOutPaths = ["/login", "sign-up", "/forgot-password", "/terms-of-service"];

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
        if (location.pathname === '/') {
            history.push("/landing")
            // history.push(loggedIn ? loggedInPaths[0] : loggedOutPaths[0])
        }
    }

    function generateRedirect(): ReactElement {
        return <Redirect exact from="/" to="/landing"/>;
    }

    function createAssessment(patientId: string, date: Moment, type: string) {
        const assessment: Assessment = {
            id: Math.floor(Math.random() * 1000000).toString(),
            patientId: patientId,
            name: type,
            date: date,
            state: AssessmentState.MISSING,
            joints: ["placeholder joint 1", "placeholder joint 2"]
        }
        UseAPI.createAssessment(assessment);
    }

    return (
        <>
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
                <Route exact path="/patients/:patientId/assessment/:date?" render={(props) =>
                    <AssessmentPage 
                        createAssessment={(type: string) => 
                            createAssessment(props.match.params.patientId, props.match.params.date, type)}
                        getAssessments={() => 
                            UseAPI.getAssessments(props.match.params.patientId, props.match.params.date)}/>
                }/>
                <Route exact path="/sign-up-patient" render={() => <SignupPatientPage/>}/>
                <Route exact path="/settings" render={() => <SettingsPage/>}/>
                {generateRedirect()}
                {}
            </Switch>
        </>
    );
};

export default Routes;
