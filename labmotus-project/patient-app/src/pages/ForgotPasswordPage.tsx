import React, { FunctionComponent, useState } from "react";
import { IonInput, IonButton, IonAlert } from "@ionic/react";

// @ts-ignore
import styled from "styled-components";

export interface ForgotPasswordPageProps {}

const ForgotPasswordPage: FunctionComponent<ForgotPasswordPageProps> = () => {
  const [email, setEmail] = useState<string>();
  const [iserror, openAlert] = useState<boolean>(false);
  const [header, setHeader] = useState<string>();
  const [message, setMessage] = useState<string>();

  function forgotPassword() {
    if (!email) {
      setHeader("Invalid email");
      setMessage("Please enter your email");
      openAlert(true);
      return;
    }

    // TODO: USE FIREBASE AND CONNECT TO BACKEND
    // firebase
    //   .auth()
    //   .sendPasswordResetEmail(email)
    //   .then(() => {
    //     // Email sent.
    //   })
    //   .catch((error) => {
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //   });
  }

  return (
    <ForgotPasswordPageDiv>
      <h1>Reset Password</h1>
      <p>
        Enter the email address you used to register and we'll send you the
        instructions for resetting your password.
      </p>
      <IonInput
        class="input email"
        placeholder="Email"
        type="email"
        inputmode="email"
        value={email}
        onIonChange={(e) => setEmail(e.detail.value!)}
      ></IonInput>
      <IonButton expand="block" shape="round" onClick={forgotPassword}>
        Submit
      </IonButton>
      <IonAlert
        isOpen={iserror}
        onDidDismiss={() => openAlert(false)}
        header={header}
        message={message}
        buttons={["OK"]}
      />
    </ForgotPasswordPageDiv>
  );
};

const ForgotPasswordPageDiv = styled.div`
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
    margin: 5vh 0;
  }
`;

export default ForgotPasswordPage;
