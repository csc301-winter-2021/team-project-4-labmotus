import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonButton, IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {APIContext} from "../api/API";
import {useHistory} from "react-router";

export interface LoginPageProps {
}

const LoginPage: FunctionComponent<LoginPageProps> = () => {
    const API = useContext(APIContext);
    const history = useHistory();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [iserror, openAlert] = useState<boolean>(false);
    const [header, setHeader] = useState<string>();
    const [message, setMessage] = useState<string>();

    async function login() {
        if (!email) {
            setHeader("Invalid email");
            setMessage("Please enter your email");
            openAlert(true);
            return;
        }

        if (!password) {
            setHeader("Invalid Password");
            setMessage("Please enter your password");
            openAlert(true);
            return;
        }
        try {
            await API.login(email, password);
        } catch (e) {
            console.error(e)
        }
        // TODO: USE FIREBASE AND CONNECT TO BACKEND
        // firebase
        //   .auth()
        //   .signInWithEmailAndPassword(email, password)
        //   .then((userCredential) => {
        //     // SIGNED IN
        //     var user = userCredential.user;
        //     // TODO: REDIRECT TO HOME PAGE
        //   })
        //   .catch((error) => {
        //     var errorCode = error.code;
        //     var errorMessage = error.message;
        //   });
    }

    function forgotPassword() {
        history.push('/forgot-password')
    }

    function signUp() {
        history.push('/sign-up')
    }

    return (
        <LoginPageDiv>
            <h1>LabMotus</h1>
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
            <a onClick={forgotPassword}>Forgot password?</a>
            <p id="bottom">
                Don't have an account? <a onClick={signUp}>Sign Up</a>
            </p>
            <IonAlert
                isOpen={iserror}
                onDidDismiss={() => openAlert(false)}
                header={header}
                message={message}
                buttons={["OK"]}
            />
        </LoginPageDiv>
  );
};

const LoginPageDiv = styled.div`
  overflow: hidden;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  padding: 5%;
  > * {
    margin-bottom: 2.5%;
  }
  .input {
    margin-bottom: 5%;
    text-align: left;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
  h1 {
    font-weight: bold;
  }
  h1,
  #bottom {
    margin: 15vh 0;
  }
  a {
    text-decoration: none;
    cursor: pointer;
  }
`;

export default LoginPage;
