import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import API from "../api/API";
import {useHistory} from "react-router";
import LoginForm from "../../../common/ui/components/LoginForm";
import {getAPIContext} from "../../../common/api/BaseAPI";

export interface LoginPageProps {
}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = React.useContext(getThemeContext());

    const history = useHistory();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    // When user clicks login
    async function login() {
        if (!email) {
            setHeader("Invalid Email");
            setMessage("Please enter your email.");
            openAlert(true);
            return;
        }

        if (!password) {
            setHeader("Invalid Password");
            setMessage("Please enter your password.");
            openAlert(true);
            return;
        }
        try {
            const loginResult = await UseAPI.login(email, password);
            switch (loginResult) {
                case "invalid-email":
                    // User has entered an invalid email address
                    setHeader("Invalid Email");
                    setMessage("Please enter a valid email address.");
                    openAlert(true);
                    setPassword("");
                    return;
                case "user-disabled":
                    // User corresponding to the email is disabled
                    setHeader("Account Disabled");
                    setMessage("Sorry! Your account has been disabled. Please try again later.");
                    openAlert(true);
                    setPassword("");
                    return;
                case "user-not-found":
                    // There is no user corresponding to the given email
                    setHeader("Invalid Email");
                    setMessage("The email you have entered is not associated with an account. Please try again or sign up for an account.");
                    openAlert(true);
                    setPassword("");
                    return;
                case "wrong-password":
                    // User has entered the wrong password
                    setHeader("Incorrect Password");
                    setMessage("The password you entered is incorrect. Please try again.");
                    openAlert(true);
                    setPassword("");
                    return;
                default:
                    console.log(loginResult);
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // When user clicks 'Forgot Password?'
    function forgotPassword() {
        history.push('/forgot-password');
    }

    // When user clicks 'Sign Up'
    function signUp() {
        history.push('/sign-up');
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <LoginPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal</h3>
                    <LoginForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        onLogin={login}
                        onForgotPassword={forgotPassword}
                    />
                    <p className="footer">
                        Don't have an account? <span onClick={signUp}>Sign Up</span>
                    </p>
                </LoginPageDiv>
            </IonContent>
            <IonAlert
                isOpen={isError}
                onDidDismiss={() => openAlert(false)}
                header={header}
                message={message}
                buttons={["OK"]}
            />
        </IonPage>
    );
};

const LoginPageDiv = styled.div`
  overflow: hidden;
  text-align: center;

  h1 {
    font-weight: bold;
    margin-top: 15vh;
  }

  .footer {
    margin-top: 65vh;
  }

  span {
    cursor: pointer;
    color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
  }
`;

export default LoginPage;
