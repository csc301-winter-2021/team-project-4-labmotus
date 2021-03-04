import React, {FunctionComponent, useContext, useState} from "react";
import {IonAlert, IonButton, IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {APIContext} from "../api/API";
import {useHistory} from "react-router";

export interface SignupPageProps {
}

const SignupPage: FunctionComponent<SignupPageProps> = () => {
  const API = useContext(APIContext);
  const history = useHistory();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [iserror, openAlert] = useState<boolean>(false);
  const [header, setHeader] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function signUp() {
    if (!email) {
      setHeader("Invalid email");
      setMessage("Please enter your email");
      openAlert(true);
      return;
    }

    if (!password) {
      setHeader("Invalid Password");
      setMessage("Please enter a password");
      openAlert(true);
      return;
    }

    if (password !== confirmPassword) {
      setHeader("Passwords Don't Match");
      setMessage("The passwords don't match. Please try again.");
      openAlert(true);
      return;
    }

    try {
      await API.signUp(email, password);
      history.push('/home');
    } catch (e) {
      console.error(e)
    }

    // TODO: USE FIREBASE AND CONNECT TO BACKEND
    // firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(email, password)
    //   .then((userCredential) => {
    //     // SIGNED IN
    //     var user = userCredential.user;
    //     // TODO: CREATE ACCOUNT AND REDIRECT TO HOME PAGE
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //   });
  }

  return (
    <SignupPageDiv>
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
        <IonInput
          class="input password"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onIonChange={(e) => setConfirmPassword(e.detail.value!)}
        />

        <IonButton expand="block" shape="round" onClick={signUp}>
          Sign Up
        </IonButton>
      </form>
      <p>
        By clicking 'Sign Up' you agree to our <a>Terms of Service</a>
      </p>
      <p id="bottom">
        Already have an account? <a>Login</a>
      </p>
      <IonAlert
        isOpen={iserror}
        onDidDismiss={() => openAlert(false)}
        header={header}
        message={message}
        buttons={["OK"]}
      />
    </SignupPageDiv>
  );
};

const SignupPageDiv = styled.div`
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
  form {
      
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
    margin: 10vh 0;
  }
  a {
    text-decoration: none;
  }
`;

export default SignupPage;
