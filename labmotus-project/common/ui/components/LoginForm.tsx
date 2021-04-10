// @ts-ignore
import {FunctionComponent, useContext} from "react";
// @ts-ignore
import {IonInput} from "@ionic/react";
// @ts-ignore
import styled from "styled-components";
import Button from "./Button";

export interface LoginFormProps {
    email: string;
    setEmail: any;
    password: string;
    setPassword: any;
    onLogin: any;
    onForgotPassword: any;
}

export const LoginForm: FunctionComponent<LoginFormProps> = (props: LoginFormProps) => {

    return (
        <LoginFormDiv>
            <div className="main-padding">
                <div className="form">
                    <IonInput
                        class="input email"
                        placeholder="Email"
                        type="email"
                        inputmode="email"
                        value={props.email}
                        onIonChange={(e) => props.setEmail(e.detail.value!)}
                    />
                    <IonInput
                        class="input password"
                        placeholder="Password"
                        type="password"
                        value={props.password}
                        onIonChange={(e) => props.setPassword(e.detail.value!)}
                    />
                    <Button label="Login" onClick={props.onLogin} type="primary round"/>
                </div>
                <p onClick={props.onForgotPassword}>
                    <span>Forgot password?</span>
                </p>
            </div>
        </LoginFormDiv>
    );
};

const LoginFormDiv = styled.div`
  height: 100%;
  width: 100%;

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
    pointer-events: auto;
  }
`;

export default LoginForm;
