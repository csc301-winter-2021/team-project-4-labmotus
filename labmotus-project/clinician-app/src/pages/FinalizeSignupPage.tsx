import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {IonAlert, IonContent, IonInput, IonPage} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../../../common/ui/theme/Theme";
import API, {getAPIContext} from "../api/API";
import {useHistory, useLocation} from "react-router";

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
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    useEffect(() => {
        if (!params.has("continueUrl") || !params.get("continueUrl").includes('?email=')) {
            // TODO Show error message
            throw new Error("Invalid signup link")
        }
        setEmail(new URLSearchParams(params.get("continueUrl").split("?")[1]).get("email"))
    }, [location]);

    // When user signs up for an account
    async function signUp() {
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
            const link = await UseAPI.finishSignUp({...Object.fromEntries(params.entries()), email: email} as any);
            await UseAPI.changePasswordWithLink(email, link, password);
            setHeader("Thanks For Signing Up");
            setMessage("You can now log in via our Patient APP!");
            openAlert(true);
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
                    <div className="main-padding">
                        <div className="main">
                            <IonInput
                                class="input"
                                placeholder="Email"
                                type="email"
                                clearInput={true}
                                value={email}
                                disabled
                                onIonChange={(e) => setEmail(e.detail.value!)}
                            />
                            <IonInput
                                class="input"
                                placeholder="Password"
                                type="password"
                                clearInput={true}
                                value={password}
                                onIonChange={(e) => setPassword(e.detail.value!)}
                            />
                            <IonInput
                                class="input"
                                placeholder="Confirm Password"
                                type="password"
                                clearInput={true}
                                value={confirmPassword}
                                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                            />
                            <button className="signup-button" onClick={signUp}>
                                Sign Up
                            </button>
                            <p>
                                By clicking 'Sign Up' you agree to our{" "}
                                <span onClick={termsOfService}>Terms of Service</span>
                            </p>
                        </div>
                    </div>
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

  .main-padding {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    padding: 5%;
    box-sizing: border-box;

    .input {
      margin-bottom: 10px;
      text-align: left;
      border-radius: 5px;
      border: 1px solid #ddd;
      --padding-start: 10px;
    }

    .signup-button {
      width: 100%;
      border-radius: 25px;
      max-width: 490px;
      font-size: 0.8em;
      padding: 14px;
      font-weight: 500;
      outline: none;
      box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.1);
      background-color: ${({theme}: { theme: Theme }) => theme.colors.primary};
      color: white;
    }

    @media only screen and (min-width: 768px) {
      form {
        margin: 0 auto;
        max-width: 60vw;
      }

      .signup-button {
        font-size: 1.1em;
      }
    }
    @media only screen and (min-width: 1024px) {
      form {
        max-width: 40vw;
      }
    }
    pointer-events: none;
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
    color: ${({theme}: { theme: Theme }) => theme.colors.primary};
  }
`;

export default FinalizeSignupPage;
