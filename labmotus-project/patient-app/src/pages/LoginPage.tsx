import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, getThemeContext} from "../../../common/ui/theme/Theme";
import API, { getAPIContext } from "../../../common/api/API";
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
                    <div className="main-padding">
                        <LoginForm
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            onLogin={login}
                            onForgotPassword={forgotPassword}
                        />
                    </div>
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
    .main-padding {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        padding: 5%;
        box-sizing: border-box;
        .input {
            margin-bottom: 5%;
            text-align: left;
            border-radius: 5px;
            border: 1px solid #ddd;
            --padding-start: 10px;
        }
        pointer-events: none;
    }
    h1 {
        font-weight: bold;
        margin-top: 15vh;
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
