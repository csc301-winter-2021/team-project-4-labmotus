import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import API, { getAPIContext } from "../api/API";
import {useHistory} from "react-router";
import LoginForm from "../../../common/ui/components/LoginForm";

export interface LoginPageProps {
}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = React.useContext(getThemeContext());

    const history = useHistory();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [iserror, openAlert] = useState<boolean>(false);
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
            await UseAPI.login(email, password);
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
                isOpen={iserror}
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
    .login-button {
        background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
        color: white;
    }
    .footer {
        margin-top: 65vh;
    }
    span {
        cursor: pointer;
        color: ${({theme}: { theme: Theme }) => theme.colors.primary};
    }
`;

export default LoginPage;
