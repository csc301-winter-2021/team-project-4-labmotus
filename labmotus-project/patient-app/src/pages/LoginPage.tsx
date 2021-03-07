import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonButton, IonContent, IonInput, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {Theme, ThemeContext} from "../theme/Theme";
import {APIContext} from "../api/API";
import {useHistory} from "react-router";

export interface LoginPageProps {
}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
    const API = useContext(APIContext);
    const theme = React.useContext(ThemeContext);

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
            await API.login(email, password);
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
                        <div className="main">
                            <form>
                                <IonInput
                                    class="input email"
                                    placeholder="Email"
                                    type="email"
                                    inputmode="email"
                                    value={email}
                                    onIonChange={(e) => setEmail(e.detail.value!)}
                                />
                                <IonInput
                                    class="input password"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onIonChange={(e) => setPassword(e.detail.value!)}
                                />

                                <IonButton expand="block" shape="round" onClick={login}>
                                    Login
                                </IonButton>
                            </form>
                            <p onClick={forgotPassword}><span>Forgot password?</span></p>
                        </div>
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
    .main {
        height: 100%;
        width: 100%;
        .input {
            margin-bottom: 5%;
            text-align: left;
            border-radius: 5px;
            border: 1px solid #ddd;
            --padding-start: 10px;
        }
        pointer-events: auto;
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
