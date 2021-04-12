import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonContent, IonInput, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import API from "../api/API";
import {useHistory} from "react-router";
import {getAPIContext} from "../../../common/api/BaseAPI";
import Button from "../../../common/ui/components/Button";
import CenterWrapper from "../../../common/ui/components/CenterWrapper";

export interface SignupPageProps {
}

const SignupPage: FunctionComponent<SignupPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = React.useContext(getThemeContext());

    const history = useHistory();
    const [name, setName] = useState<string>();
    const [clinic, setClinic] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [isError, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    // When user signs up for an account
    async function signUp() {
        if (!name) {
            setHeader("Empty Name");
            setMessage("Please enter your full name.");
            openAlert(true);
            return;
        }

        if (!clinic) {
            setHeader("Empty Clinic");
            setMessage("Please enter the name of your clinic.");
            openAlert(true);
            return;
        }

        if (!email) {
            setHeader("Invalid Email");
            setMessage("Please enter your email.");
            openAlert(true);
            return;
        }

        if (!password) {
            setHeader("Invalid Password");
            setMessage("Please enter a password.");
            openAlert(true);
            return;
        }

        if (password !== confirmPassword) {
            setHeader("Passwords Don't Match");
            setMessage("The passwords don't match. Please try again.");
            openAlert(true);
            setConfirmPassword("");
            return;
        }

        try {
            const signUpResult = await UseAPI.signUp(name, clinic, email, password);
            switch (signUpResult) {
                case "email-already-in-use":
                    // User has entered an email that's already in use
                    setHeader("Email Taken");
                    setMessage("The email you have entered already has an account associated with it. If this is your account please sign in or choose a different email.");
                    openAlert(true);
                    setPassword("");
                    setConfirmPassword("");
                    return;
                case "invalid-email":
                    // User has entered an invalid email address
                    setHeader("Invalid Email");
                    setMessage("Please enter a valid email address.");
                    openAlert(true);
                    setPassword("");
                    setConfirmPassword("");
                    return;
                case "weak-password":
                    // User chose a weak password under 6 characters
                    setHeader("Weak Password");
                    setMessage("Please choose a password that's at least 6 characters.");
                    openAlert(true);
                    setPassword("");
                    setConfirmPassword("");
                    return;
                default:
                    console.log(signUpResult);
                    break;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // When user clicks 'Login'
    function login() {
        history.push("/login");
    }

    // When user clicks 'Terms of Services'
    function termsOfService() {
        history.push("/terms-of-service");
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <SignupPageDiv theme={theme}>
                    <h1>LabMotus</h1>
                    <h3>Clinician Portal</h3>
                    <CenterWrapper>
                        <div className="main">
                            <div className="form">
                                <IonInput
                                    class="input"
                                    placeholder="Name"
                                    type="text"
                                    value={name}
                                    onIonChange={(e) => setName(e.detail.value!)}
                                />
                                <IonInput
                                    class="input"
                                    placeholder="Clinic Name"
                                    type="text"
                                    value={clinic}
                                    onIonChange={(e) => setClinic(e.detail.value!)}
                                />
                                <IonInput
                                    class="input"
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onIonChange={(e) => setEmail(e.detail.value!)}
                                />
                                <IonInput
                                    class="input"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onIonChange={(e) => setPassword(e.detail.value!)}
                                />
                                <IonInput
                                    class="input"
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                                />
                                <Button label="Sign Up" onClick={signUp} type="primary round"/>
                            </div>
                            <p>
                                By clicking 'Sign Up' you agree to our{" "}
                                <span onClick={termsOfService}>Terms of Service</span>
                            </p>
                        </div>
                    </CenterWrapper>
                    <p className="footer">
                        Already have an account? <span onClick={login}>Login</span>
                    </p>
                </SignupPageDiv>
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

const SignupPageDiv = styled.div`
  overflow: hidden;
  text-align: center;

  .input {
    margin-bottom: 10px;
    text-align: left;
    border-radius: 5px;
    border: 1px solid #ddd;
    --padding-start: 10px;
  }

  @media only screen and (min-width: 768px) {
    .form {
      margin: 0 auto;
      max-width: 60vw;
    }
  }
  @media only screen and (min-width: 1024px) {
    .form {
      max-width: 40vw;
    }
  }

  .main {
    height: 100%;
    width: 100%;
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
    color: ${({theme}: { theme: Theme }) => theme.colors.secondary};
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${({theme}: { theme: Theme }) => theme.colors.light} inset !important;
  }
`;

export default SignupPage;
