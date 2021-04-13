import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {IonAlert, IonContent, IonInput, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import API from "../api/API";
import {useHistory, useLocation} from "react-router";
import {getAPIContext} from "../../../common/api/BaseAPI";
import Button from "../../../common/ui/components/Button";
import CenterWrapper from "../../../common/ui/components/CenterWrapper";

export interface SignupPageProps {
}

const FinalizeSignupPage: FunctionComponent<SignupPageProps> = () => {
    const UseAPI: API = useContext(getAPIContext());
    const theme = React.useContext(getThemeContext());

    const history = useHistory();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [isError, openAlert] = useState<boolean>(false);
    const [redirectSignup, openRedirectSignup] = useState<boolean>(false);
    const [invalidSignup, openInvalidSignup] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    // Get email from sign up URL
    useEffect(() => {
        if (!params.has("continueUrl") || !params.get("continueUrl").includes("?email=")) {
            openInvalidSignup(true);
            return;
        }
        try {
            setEmail(new URLSearchParams(params.get("continueUrl").split("?")[1]).get("email"));
        } catch (e) {
            openInvalidSignup(true);
            return;
        }
    }, [location]);

    // When user signs up for an account
    async function signUp() {
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
            const link = await UseAPI.finishSignUp({...Object.fromEntries(params.entries()), email: email} as any);
            const signUpResult = await UseAPI.changePasswordWithLink(email, link, password);
            switch (signUpResult) {
                case "success":
                    openRedirectSignup(true);
                    return;
                case "argument-error":
                    // Error in the sign up link
                    openInvalidSignup(true);
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
                    setHeader("Error");
                    setMessage("An error has occurred while trying to sign you up. Please try again later.");
                    openAlert(true);
                    setPassword("");
                    console.log(signUpResult);
                    return;
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
                    <CenterWrapper>
                        <div className="main">
                            <div className="form">
                                <IonInput
                                    class="input"
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    disabled
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
            <IonAlert
                isOpen={redirectSignup}
                onDidDismiss={() => {
                    openRedirectSignup(false);
                    history.push("/");
                }}
                header="Thanks For Signing Up"
                message="You can now log in via our Patient App! We will be redirecting you to the home page."
                buttons={["OK"]}
            />
            <IonAlert
                isOpen={invalidSignup}
                onDidDismiss={() => {
                    openInvalidSignup(false);
                    history.push("/");
                }}
                header="Invalid Signup Link"
                message="This signup link is either invalid or has expired. We will be redirecting you to the home page."
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
`;

export default FinalizeSignupPage;
