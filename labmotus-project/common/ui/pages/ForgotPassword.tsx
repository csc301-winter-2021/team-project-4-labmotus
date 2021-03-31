import {FunctionComponent, useContext} from "react";
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import {getThemeContext, Theme} from "../theme/Theme";

export interface ForgotPasswordProps {
    email: string;
    setEmail: any;
    onForgotPassword: any;
}

const ForgotPassword: FunctionComponent<ForgotPasswordProps> = (props: ForgotPasswordProps) => {
    const theme: Theme = useContext(getThemeContext());

    return (
        <ForgotPasswordDiv theme={theme}>
            <h1>Reset Password</h1>
            <div className="main-padding">
                <div className="form">
                    <p>
                        Enter the email address you used to register and we'll send you the instructions for resetting
                        your password.
                    </p>

                    <IonInput
                        className="input"
                        placeholder="Email"
                        type="email"
                        value={props.email}
                        autofocus={true}
                        onIonChange={(e) => props.setEmail(e.detail.value!)}
                    />
                    <button className="forgot-button" onClick={props.onForgotPassword}>
                        Submit
                    </button>
                </div>
            </div>
        </ForgotPasswordDiv>
    );
};

const ForgotPasswordDiv = styled.div`
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

    .forgot-button {
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
      .form {
        margin: 0 auto;
        max-width: 60vw;
      }

      .forgot-button {
        font-size: 1.1em;
      }
    }
    @media only screen and (min-width: 1024px) {
      .form {
        max-width: 40vw;
      }
    }
    pointer-events: auto;
  }

  h1 {
    font-weight: bold;
    margin-top: 15vh;
  }
`;

export default ForgotPassword;
